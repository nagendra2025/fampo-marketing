import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
import { createClient as createSupabaseServiceClient } from '@supabase/supabase-js';

/**
 * Cancel Subscription API Route
 * 
 * WHY THIS IS NEEDED:
 * - Users need a way to cancel their subscription
 * - Must be done server-side for security (Stripe API keys)
 * - Updates both Stripe and our database
 * - Provides immediate cancellation or cancel at period end
 * 
 * FLOW:
 * 1. Verify user is authenticated
 * 2. Get user's subscription from database
 * 3. Cancel subscription in Stripe
 * 4. Update subscription status in database
 * 5. Return success response
 * 
 * CANCELLATION OPTIONS:
 * - Immediate: Cancels now, access ends immediately
 * - At period end: Cancels but keeps access until billing period ends
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Cancel subscription API called');

    // Step 1: Verify user is authenticated
    // WHY: Only authenticated users can cancel their subscription
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

    // Step 2: Get cancellation option from request
    // WHY: User can choose immediate cancellation or cancel at period end
    const { cancelImmediately = false } = await request.json();

    // Step 3: Get user's subscription from database
    // WHY: We need the Stripe subscription ID to cancel it
    // NOTE: We look for active or trialing subscriptions (not already canceled)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !subscription) {
      console.error('❌ Subscription not found:', subError);
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const subscriptionData = subscription as { stripe_subscription_id: string };
    console.log('✅ Subscription found:', subscriptionData.stripe_subscription_id);

    // Step 4: Cancel subscription in Stripe
    // WHY: Stripe handles the actual cancellation
    const stripe = getStripeClient();

    let canceledSubscription;
    if (cancelImmediately) {
      // WHY: Cancel immediately - user loses access right away
      // Use case: User wants to stop immediately, no refund needed
      console.log('🗑️ Canceling subscription immediately');
      canceledSubscription = await stripe.subscriptions.cancel(
        subscriptionData.stripe_subscription_id
      );
    } else {
      // WHY: Cancel at period end - user keeps access until billing period ends
      // Use case: User paid for the period, should have access until it ends
      // This is the default and recommended option
      console.log('🗑️ Canceling subscription at period end');
      canceledSubscription = await stripe.subscriptions.update(
        subscriptionData.stripe_subscription_id,
        {
          cancel_at_period_end: true,
        }
      );
    }

    console.log('✅ Subscription canceled in Stripe:', canceledSubscription.id);

    // Step 5: Update subscription in database
    // WHY: Keep our database in sync with Stripe
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseService = createSupabaseServiceClient(supabaseUrl, supabaseServiceKey);

    const updateData: any = {
      cancel_at_period_end: canceledSubscription.cancel_at_period_end,
    };

    // If canceled immediately, update status now
    if (cancelImmediately) {
      updateData.status = 'canceled';
      updateData.canceled_at = new Date().toISOString();
    }

    const subscriptionId = (subscription as { id: string }).id;
    const { error: updateError } = await supabaseService
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('❌ Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    console.log('✅ Subscription updated in database');

    // Step 6: Send cancellation email
    // WHY: User needs confirmation that subscription was canceled
    try {
      const { Resend } = await import('resend');
      const resendApiKey = process.env.RESEND_API_KEY;
      const resend = resendApiKey ? new Resend(resendApiKey) : null;

      if (resend) {
        // Get user email
        const { data: profile } = await supabaseService
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single();

        const recipientEmail = profile?.email || user.email;
        const recipientName = profile?.full_name || 'there';

        if (recipientEmail) {
          // WHY: Get origin from request to handle both www and non-www domains
          // This ensures the signup link works regardless of how the user accessed the site
          const origin = request.headers.get('origin') || 
                         request.nextUrl.origin || 
                         process.env.NEXT_PUBLIC_SITE_URL || 
                         'https://fampo-marketing.com';
          const signupUrl = `${origin}/signup?email=${encodeURIComponent(recipientEmail)}`;

          await resend.emails.send({
            from: 'hello@fampo-marketing.com',
            to: recipientEmail,
            subject: cancelImmediately 
              ? 'Your Fampo Subscription Has Been Canceled' 
              : 'Your Fampo Subscription Will End Soon',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Subscription Canceled</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">${cancelImmediately ? 'Subscription Canceled' : 'Subscription Ending Soon'}</h1>
                  </div>
                  
                  <div style="background: #ffffff; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${recipientName}!</p>
                    
                    <p style="margin-bottom: 20px;">
                      ${cancelImmediately 
                        ? 'We\'re sorry to see you go! Your Fampo subscription has been canceled immediately. You no longer have access to your account.'
                        : `Your Fampo subscription will be canceled at the end of your current billing period. You'll continue to have access until then.`}
                    </p>
                    
                    ${cancelImmediately ? `
                      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #991b1b;">
                          <strong>Access Ended:</strong> Your subscription has been canceled and access has ended immediately.
                        </p>
                      </div>
                    ` : `
                      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #991b1b;">
                          <strong>Access Continues:</strong> You'll keep access until ${(canceledSubscription as any).current_period_end ? new Date((canceledSubscription as any).current_period_end * 1000).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : 'the end of your billing period'}.
                        </p>
                      </div>
                    `}
                    
                    <p style="margin-bottom: 20px;">
                      ${cancelImmediately 
                        ? 'If you change your mind, you can always reactivate your subscription by signing up again.'
                        : 'If you change your mind before then, you can reactivate your subscription from your dashboard.'}
                    </p>
                    
                    ${cancelImmediately ? `
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${signupUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          Sign Up Again →
                        </a>
                      </div>
                    ` : `
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${origin}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          Go to Dashboard →
                        </a>
                      </div>
                    `}
                    
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                      <p style="margin: 0;">Questions? Reply to this email - we'd love to help!</p>
                      <p style="margin: 10px 0 0 0;">The Fampo Team</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
          console.log('✅ Cancellation email sent successfully');
        }
      }
    } catch (emailError) {
      // Don't fail the cancellation if email fails
      console.error('⚠️ Failed to send cancellation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: cancelImmediately
        ? 'Subscription canceled immediately'
        : 'Subscription will be canceled at the end of the billing period',
      subscription: {
        status: canceledSubscription.status,
        cancel_at_period_end: canceledSubscription.cancel_at_period_end,
        canceled_at: canceledSubscription.canceled_at
          ? new Date(canceledSubscription.canceled_at * 1000).toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error('❌ Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}



