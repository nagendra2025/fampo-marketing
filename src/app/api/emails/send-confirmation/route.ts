import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { formatAmountFromStripe, formatAmountForDisplay } from '@/lib/stripe/utils';

/**
 * Send Confirmation Email After Checkout
 * 
 * WHY THIS IS NEEDED:
 * - User completes checkout but doesn't receive email from Stripe
 * - We need to send our own confirmation email
 * - Provides better user experience and branding
 * - Includes subscription details and next steps
 * 
 * WHEN IT'S CALLED:
 * - After successful checkout (from success page or webhook)
 * - Contains subscription details and receipt information
 */

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Email confirmation API called');
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      console.error('❌ No session ID provided');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    console.log('✅ Session ID:', sessionId);

    // Get Stripe session first (doesn't require auth)
    console.log('🔍 Retrieving Stripe session...');
    const { getStripeClient } = await import('@/lib/stripe/client');
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Session retrieved:', session.id);

    if (!session.subscription) {
      return NextResponse.json(
        { error: 'No subscription found in session' },
        { status: 404 }
      );
    }

    // Get customer email from session
    const customerEmail = session.customer_email || session.customer_details?.email;
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'No email found in session' },
        { status: 404 }
      );
    }

    // Try to get user profile, but don't fail if not found
    let profile: { email: string; full_name: string | null } | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single();
        profile = profileData;
      }
    } catch (error) {
      // Continue without profile - we have email from session
      console.log('Could not get profile, using session email');
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const priceAmount = subscription.items.data[0]?.price.unit_amount || 0;
    const priceDisplay = formatAmountForDisplay(priceAmount);
    const isEarlyBird = session.metadata?.is_early_bird === 'true';

    // Calculate trial end date
    const trialEndDate = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;
    const trialEndDisplay = trialEndDate
      ? trialEndDate.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';

    // Send email
    if (!resend) {
      console.warn('⚠️ Resend API key not configured. Email not sent.');
      return NextResponse.json(
        { message: 'Email service not configured' },
        { status: 200 }
      );
    }

    const origin = request.headers.get('origin') ||
                   request.nextUrl.origin ||
                   process.env.NEXT_PUBLIC_SITE_URL ||
                   'https://fampo-marketing.com';

    const dashboardUrl = `${origin}/dashboard`;
    const recipientEmail = (profile as { email?: string } | null)?.email || customerEmail;
    const recipientName = (profile as { full_name?: string | null } | null)?.full_name || 'there';

    console.log('📧 Sending email to:', recipientEmail);
    console.log('📧 Email details:', {
      from: 'hello@fampo-marketing.com',
      to: recipientEmail,
      subject: '🎉 Welcome to Fampo - Your Subscription is Active!',
    });

    const emailResult = await resend.emails.send({
      from: 'hello@fampo-marketing.com',
      to: recipientEmail,
      subject: '🎉 Welcome to Fampo - Your Subscription is Active!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Fampo</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Fampo! 🎉</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 18px; margin-bottom: 20px;">Hi ${recipientName}!</p>
              
              <p style="margin-bottom: 20px;">
                Thank you for subscribing to Fampo! Your subscription is now active and you're all set to start organizing your family.
              </p>
              
              <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">📋 Subscription Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Plan:</td>
                    <td style="padding: 8px 0;">Family Plan</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Monthly Price:</td>
                    <td style="padding: 8px 0;">${priceDisplay}${isEarlyBird ? ' <span style="color: #10b981; font-size: 12px;">(Early Bird Price)</span>' : ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Trial End Date:</td>
                    <td style="padding: 8px 0;">${trialEndDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">Subscription ID:</td>
                    <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${subscription.id.substring(0, 20)}...</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="color: #065f46; margin-top: 0; font-size: 20px;">🎁 Your 2-Month Free Trial</h2>
                <p style="margin-bottom: 10px;">
                  You're currently enjoying a <strong>2-month free trial</strong>! After ${trialEndDisplay}, your subscription will automatically continue at ${priceDisplay}/month.
                </p>
                <p style="margin: 0; font-size: 14px; color: #065f46;">
                  No charges will be made during your trial period.
                </p>
              </div>
              
              <p style="margin-bottom: 20px;">
                <strong>What's next?</strong>
              </p>
              
              <ol style="margin-bottom: 30px; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Access your dashboard to start using Fampo</li>
                <li style="margin-bottom: 10px;">Set up your family members and preferences</li>
                <li style="margin-bottom: 10px;">Enjoy all Family plan features during your trial</li>
                <li style="margin-bottom: 10px;">Your subscription will automatically continue after the trial</li>
              </ol>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  Go to Dashboard →
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">Questions? Reply to this email - we'd love to help!</p>
                <p style="margin: 10px 0 0 0;">The Fampo Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Confirmation email sent successfully!');
    console.log('📧 Email result:', emailResult);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

