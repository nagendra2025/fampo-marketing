import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';

/**
 * Create Stripe Customer Portal Session
 * 
 * WHY THIS IS NEEDED:
 * - Users need to update payment methods
 * - Users need to view invoices and receipts
 * - Stripe Customer Portal provides secure, self-service management
 * - Handles all payment method updates securely
 * 
 * FLOW:
 * 1. Verify user is authenticated
 * 2. Get user's subscription from database
 * 3. Get Stripe customer ID
 * 4. Create Stripe Customer Portal session
 * 5. Return portal URL for redirect
 * 
 * WHAT USERS CAN DO IN PORTAL:
 * - Update payment method
 * - View payment history
 * - Download invoices/receipts
 * - Update billing information
 * - Cancel subscription (if needed)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Create customer portal session API called');

    // Step 1: Verify user is authenticated
    // WHY: Only authenticated users can access customer portal
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

    // Step 2: Get user's subscription from database
    // WHY: We need the Stripe customer ID to create portal session
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      console.error('❌ Subscription not found:', subError);
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    const subscriptionData = subscription as { stripe_customer_id: string };
    console.log('✅ Subscription found, customer ID:', subscriptionData.stripe_customer_id);

    // Step 3: Get origin for return URL
    // WHY: After user finishes in portal, redirect back to our dashboard
    const origin = request.headers.get('origin') ||
                   request.nextUrl.origin ||
                   process.env.NEXT_PUBLIC_SITE_URL ||
                   'https://fampo-marketing.com';

    const returnUrl = `${origin}/dashboard`;

    // Step 4: Create Stripe Customer Portal session
    // WHY: Stripe Customer Portal is a secure, hosted page for subscription management
    // It handles payment method updates, invoice viewing, etc.
    const stripe = getStripeClient();

    console.log('🔗 Creating portal session...');
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscriptionData.stripe_customer_id,
      return_url: returnUrl,
    });

    console.log('✅ Portal session created:', portalSession.id);

    // Step 5: Return portal URL
    // WHY: Frontend needs the URL to redirect user to Stripe Customer Portal
    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('❌ Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}



