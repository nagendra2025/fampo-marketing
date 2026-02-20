import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { getPricing, calculateTrialEndDate } from '@/lib/stripe/utils';

/**
 * API Route: Create Stripe Checkout Session
 * 
 * WHY THIS IS NEEDED:
 * - Stripe Checkout Sessions must be created server-side for security
 * - We need to verify user authentication before allowing checkout
 * - We need to check waitlist status to determine early bird pricing
 * - We need to set up trial period and pricing before redirecting to Stripe
 * 
 * FLOW:
 * 1. Verify user is authenticated
 * 2. Get user's email from profile
 * 3. Check waitlist table for early bird eligibility
 * 4. Calculate pricing (early bird: $44 CAD, regular: $62 CAD)
 * 5. Create Stripe Checkout Session with:
 *    - 2-month trial period
 *    - Correct pricing based on early bird status
 *    - Success/cancel URLs
 * 6. Return session URL for redirect
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to continue.' },
        { status: 401 }
      );
    }

    // Step 2: Get user profile to get email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found. Please try signing up again.' },
        { status: 404 }
      );
    }

    // Type guard: ensure profile has email
    // WHY: TypeScript needs explicit type checking for profile.email
    const profileEmail = (profile as { email?: string | null })?.email;
    const userEmail = profileEmail 
      ? profileEmail.toLowerCase().trim() 
      : user.email?.toLowerCase().trim();
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found. Please try signing up again.' },
        { status: 404 }
      );
    }

    // Step 3: Check waitlist for early bird eligibility
    // WHY: We need to determine if user gets $44 CAD (early bird) or $62 CAD (regular) pricing
    const { data: waitlistEntry } = await supabase
      .from('waitlist')
      .select('early_bird, email')
      .eq('email', userEmail)
      .single();

    // Determine early bird status
    // WHY: early_bird field in waitlist table indicates if user joined before cutoff date (March 31, 2025)
    const isEarlyBird = (waitlistEntry as { early_bird?: boolean } | null)?.early_bird ?? false;

    // Step 4: Calculate pricing
    // WHY: getPricing() returns price in cents (Stripe format)
    // Early bird: 4400 cents = $44.00 CAD
    // Regular: 6200 cents = $62.00 CAD
    const priceAmount = getPricing(isEarlyBird);

    // Step 5: Calculate trial dates
    // WHY: Trial starts now and ends 2 months from now
    const trialStart = new Date();
    const trialEnd = calculateTrialEndDate(trialStart);

    // Step 6: Get origin for success/cancel URLs
    // WHY: We need absolute URLs for Stripe redirects
    const origin = request.headers.get('origin') || 
                   request.nextUrl.origin || 
                   process.env.NEXT_PUBLIC_SITE_URL || 
                   'https://fampo-marketing.com';

    // Step 7: Initialize Stripe client
    // WHY: We need Stripe client to create checkout session
    const stripe = getStripeClient();

    // Step 8: Create Stripe Checkout Session
    // WHY: Stripe Checkout handles payment collection securely
    // We configure:
    // - Customer email (pre-fills Stripe form)
    // - Line items (subscription with price)
    // - Trial period (2 months)
    // - Success/cancel URLs (where to redirect after payment)
    // - Metadata (store user info for webhook processing)
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Fampo Family Plan',
              description: 'Complete family platform dashboard with all features',
            },
            unit_amount: priceAmount, // Price in cents
            recurring: {
              interval: 'month', // Monthly subscription
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // WHY: Trial period starts immediately and lasts 2 months
      // After trial, Stripe automatically charges the customer
      subscription_data: {
        trial_period_days: 60, // 2 months = 60 days
        metadata: {
          user_id: user.id,
          user_email: userEmail,
          is_early_bird: isEarlyBird.toString(),
          price_amount: priceAmount.toString(),
        },
      },
      // WHY: Metadata helps us identify the session in webhooks
      metadata: {
        user_id: user.id,
        user_email: userEmail,
        is_early_bird: isEarlyBird.toString(),
        price_amount: priceAmount.toString(),
      },
      // WHY: Success URL redirects user after successful payment
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // WHY: Cancel URL redirects user if they cancel checkout
      cancel_url: `${origin}/checkout/cancel`,
    });

    // Step 9: Return session URL
    // WHY: Frontend needs the URL to redirect user to Stripe Checkout
    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}



