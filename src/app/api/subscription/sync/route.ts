import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { createClient as createSupabaseServiceClient } from '@supabase/supabase-js';

/**
 * Sync Subscription from Stripe
 * 
 * WHY THIS IS NEEDED:
 * - Webhook might not have fired yet or failed
 * - User needs immediate feedback after checkout
 * - Fallback mechanism to ensure data is synced
 * - Can be called manually or automatically
 * 
 * FLOW:
 * 1. Get user's email from profile
 * 2. Find customer in Stripe by email
 * 3. Get subscription from Stripe
 * 4. Sync to database
 * 5. Return subscription data
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Sync subscription API called');
    
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('❌ Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profileData = profile as { email: string };
    console.log('✅ Profile found:', profileData.email);

    // Get Supabase service client for writes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseService = createSupabaseServiceClient(supabaseUrl, supabaseServiceKey);

    // Get Stripe client
    const stripe = getStripeClient();

    // Find customer in Stripe by email
    const userEmail = profileData.email.toLowerCase().trim();
    console.log('🔍 Searching for customer in Stripe:', userEmail);
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 10, // Increase limit to handle multiple customers
    });

    console.log(`📊 Found ${customers.data.length} customers`);

    if (customers.data.length === 0) {
      console.error('❌ No Stripe customer found');
      return NextResponse.json(
        { error: 'No Stripe customer found for this email' },
        { status: 404 }
      );
    }

    // Get the most recent customer (in case there are multiple)
    const customer = customers.data[0];
    console.log('✅ Customer found:', customer.id);

    // Get subscriptions for this customer
    console.log('🔍 Searching for subscriptions for customer:', customer.id);
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 10,
      status: 'all',
    });

    console.log(`📊 Found ${subscriptions.data.length} subscriptions`);

    if (subscriptions.data.length === 0) {
      console.error('❌ No subscription found');
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Get the most recent active/trialing subscription
    const subscription = subscriptions.data.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    ) || subscriptions.data[0];
    
    console.log('✅ Subscription found:', subscription.id, 'Status:', subscription.status);

    // Calculate pricing
    const priceAmount = subscription.items.data[0]?.price.unit_amount || 0;

    // Sync to database
    console.log('💾 Syncing subscription to database...');
    const subscriptionData = {
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customer.id,
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
      cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
      canceled_at: (subscription as any).canceled_at
        ? new Date((subscription as any).canceled_at * 1000).toISOString()
        : null,
    };

    console.log('📝 Subscription data to sync:', {
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_amount: priceAmount,
    });

    const { data: syncedSubscription, error: syncError } = await supabaseService
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'stripe_subscription_id',
      })
      .select()
      .single();

    if (syncError) {
      console.error('❌ Error syncing subscription:', syncError);
      return NextResponse.json(
        { error: 'Failed to sync subscription', details: syncError.message },
        { status: 500 }
      );
    }

    console.log('✅ Subscription synced to database:', syncedSubscription?.id);

    // Get payment history
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 10,
    });

    // Sync payments
    if (syncedSubscription && invoices.data.length > 0) {
      for (const invoice of invoices.data) {
        const inv = invoice as any;
        if (inv.payment_intent && invoice.status === 'paid') {
          // Check if payment already exists
          const { data: existingPayment } = await supabaseService
            .from('payments')
            .select('id')
            .eq('stripe_payment_intent_id', inv.payment_intent as string)
            .single();

          if (!existingPayment) {
            await supabaseService
              .from('payments')
              .insert({
                subscription_id: syncedSubscription.id,
                stripe_payment_intent_id: inv.payment_intent as string,
                amount: invoice.amount_paid,
                currency: 'CAD',
                status: 'succeeded',
                paid_at: (invoice.status_transitions as any)?.paid_at
                  ? new Date((invoice.status_transitions as any).paid_at * 1000).toISOString()
                  : null,
              });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      subscription: syncedSubscription,
    });
  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}

