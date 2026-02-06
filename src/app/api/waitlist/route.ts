import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Get Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helper function to get Supabase client (created on demand to handle missing env vars)
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Insert email into waitlist
    const { data: waitlistEntry, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        status: 'pending',
        early_bird: true, // All waitlist signups get early bird pricing
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting into waitlist:', insertError);
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email
    if (!resend) {
      console.warn('⚠️ Resend API key not configured. Email not sent, but signup was successful.');
      console.warn('RESEND_API_KEY environment variable is missing or invalid.');
    } else {
      try {
        console.log(`📧 Attempting to send welcome email to: ${email}`);
        const emailResult = await resend.emails.send({
          // IMPORTANT: Domain must be verified in Resend first!
          // 1. Go to Resend Dashboard → Domains → Add Domain: fampo-marketing.com
          // 2. Add DNS records in Namecheap (TXT and CNAME from Resend)
          // 3. Wait for verification (5-30 minutes)
          // 4. Once verified, this email will work for any recipient
          from: 'hello@fampo-marketing.com',
          to: email,
          subject: 'Welcome to Fampo - Your 2-Month Free Trial Starts Now!',
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
                <p style="font-size: 18px; margin-bottom: 20px;">Hi there!</p>
                
                <p style="margin-bottom: 20px;">
                  Thank you for joining the Fampo waitlist! We're excited to have you on board.
                </p>
                
                <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                  <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">🎁 Your Special Offer</h2>
                  <p style="margin-bottom: 10px;"><strong>2-Month Free Trial</strong></p>
                  <p style="margin-bottom: 10px;">Start your free trial when you create your account!</p>
                  <p style="margin-bottom: 0;"><strong>Early Bird Pricing:</strong> Just $44 CAD/month after your trial</p>
                  <p style="margin-bottom: 0; font-size: 14px; color: #6b7280;">(Regular price: $62 CAD/month)</p>
                </div>
                
                <p style="margin-bottom: 20px;">
                  <strong>What happens next?</strong>
                </p>
                
                <ol style="margin-bottom: 30px; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Create your Fampo account (we'll send you the link when we're ready)</li>
                  <li style="margin-bottom: 10px;">Start your 2-month free trial immediately</li>
                  <li style="margin-bottom: 10px;">Enjoy all Family plan features during your trial</li>
                  <li style="margin-bottom: 10px;">After 2 months, continue at just $44 CAD/month (early bird price)</li>
                </ol>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="margin-bottom: 15px; font-size: 16px; color: #6b7280;">
                    We're putting the finishing touches on Fampo and will notify you as soon as it's ready!
                  </p>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                  <p style="margin: 0;">Questions? Reply to this email - we'd love to hear from you!</p>
                  <p style="margin: 10px 0 0 0;">The Fampo Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
        });
        console.log('✅ Email sent successfully!', emailResult);
      } catch (emailError: any) {
        console.error('❌ Error sending email:', emailError);
        console.error('Error details:', {
          message: emailError?.message,
          name: emailError?.name,
          statusCode: emailError?.statusCode,
        });
        // Don't fail the request if email fails - the signup was successful
      }
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist! Check your email for details.',
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

