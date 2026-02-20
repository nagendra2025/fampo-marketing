import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeClient } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * Stripe Webhook Endpoint
 * 
 * WHY THIS IS NEEDED:
 * - Stripe sends webhook events when subscription/payment events occur
 * - We need to sync subscription data to our database
 * - Webhooks are the only reliable way to stay in sync with Stripe
 * - Handles: subscription.created, subscription.updated, payment_intent.succeeded, etc.
 * 
 * SECURITY:
 * - Verifies webhook signature from Stripe
 * - Ensures requests are actually from Stripe
 * - Prevents unauthorized access
 * 
 * FLOW:
 * 1. Stripe sends webhook event
 * 2. Verify webhook signature
 * 3. Handle event type (subscription, payment, etc.)
 * 4. Sync data to database
 * 5. Return success response
 */

// Get Supabase service role client (for database writes)
function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Get webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // WHY: Verify webhook signature to ensure request is from Stripe
    // This prevents unauthorized access and ensures data integrity
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    const supabase = getSupabaseServiceClient();

    switch (event.type) {
      case 'checkout.session.completed':
        // WHY: This event fires when user completes checkout
        // We need to create subscription record in our database
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // WHY: Subscription status changes (trial, active, canceled, etc.)
        // We need to sync subscription status to our database
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'customer.subscription.deleted':
        // WHY: Subscription was canceled
        // We need to update subscription status in database
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;

      case 'invoice.payment_succeeded':
        // WHY: Payment was successful (trial ended, renewal, etc.)
        // We need to record payment in our database
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
        break;

      case 'invoice.payment_failed':
        // WHY: Payment failed (card declined, etc.)
        // We need to update subscription status
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 * WHY: User just completed checkout, create subscription record
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof getSupabaseServiceClient>
) {
  console.log('📦 Processing checkout.session.completed:', session.id);

  // Get user_id from session metadata (set in checkout API)
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('❌ No user_id in session metadata');
    return;
  }

  // Get subscription from Stripe
  const stripe = getStripeClient();
  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    console.error('❌ No subscription ID in session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
  const customerId = subscription.customer as string;

  // Get customer details
  const customer = await stripe.customers.retrieve(customerId);
  const customerEmail = typeof customer === 'object' && !customer.deleted
    ? customer.email
    : session.customer_email;

  // Calculate pricing from subscription
  const priceAmount = subscription.items.data[0]?.price.unit_amount || 0;
  const isEarlyBird = session.metadata?.is_early_bird === 'true';

  // Insert subscription into database
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status as any,
      plan_type: 'family',
      price_amount: priceAmount,
      currency: 'CAD',
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    });

  if (error) {
    console.error('❌ Error inserting subscription:', error);
    throw error;
  }

  console.log('✅ Subscription created in database:', subscription.id);
}

/**
 * Handle subscription.created or subscription.updated event
 * WHY: Subscription status changed, update our database
 */
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof getSupabaseServiceClient>
) {
  console.log('🔄 Processing subscription update:', subscription.id);

  // Get user_id from subscription metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.log('⚠️ No user_id in subscription metadata, skipping');
    return;
  }

  // Calculate pricing
  const priceAmount = subscription.items.data[0]?.price.unit_amount || 0;

  // Update or insert subscription
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status as any,
      plan_type: 'family',
      price_amount: priceAmount,
      currency: 'CAD',
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    }, {
      onConflict: 'stripe_subscription_id',
    });

  if (error) {
    console.error('❌ Error updating subscription:', error);
    throw error;
  }

  console.log('✅ Subscription updated in database:', subscription.id);
}

/**
 * Handle subscription.deleted event
 * WHY: Subscription was canceled, update status
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof getSupabaseServiceClient>
) {
  console.log('🗑️ Processing subscription deleted:', subscription.id);

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('❌ Error updating deleted subscription:', error);
    throw error;
  }

  console.log('✅ Subscription marked as canceled:', subscription.id);
}

/**
 * Handle invoice.payment_succeeded event
 * WHY: Payment was successful, record it in payments table
 */
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof getSupabaseServiceClient>
) {
  console.log('💰 Processing payment succeeded:', invoice.id);

  // Only process if it's a subscription invoice
  const subscriptionId = (invoice as any).subscription as string | null;
  if (!subscriptionId) {
    console.log('⚠️ Not a subscription invoice, skipping');
    return;
  }

  // Get subscription from database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!subscription) {
    console.log('⚠️ Subscription not found in database, skipping payment record');
    return;
  }

  // Get payment intent
  const paymentIntentId = (invoice as any).payment_intent as string;
  if (!paymentIntentId) {
    console.log('⚠️ No payment intent in invoice, skipping');
    return;
  }

  // Insert payment record
  const { error } = await supabase
    .from('payments')
    .insert({
      subscription_id: subscription.id,
      stripe_payment_intent_id: paymentIntentId,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase() as 'CAD',
      status: 'succeeded',
      paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
    });

  if (error) {
    console.error('❌ Error inserting payment:', error);
    throw error;
  }

  console.log('✅ Payment recorded in database:', paymentIntentId);
}

/**
 * Handle invoice.payment_failed event
 * WHY: Payment failed, update subscription status
 */
async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof getSupabaseServiceClient>
) {
  console.log('❌ Processing payment failed:', invoice.id);

  const subscriptionId = (invoice as any).subscription as string | null;
  if (!subscriptionId) {
    return;
  }

  // Update subscription status to past_due
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('❌ Error updating failed payment:', error);
    throw error;
  }

  console.log('✅ Subscription marked as past_due:', subscriptionId);
}




