import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';

/**
 * Get Receipt/Invoice Download URL
 * 
 * WHY THIS IS NEEDED:
 * - Users need to download receipts for their records
 * - Receipts are needed for tax/accounting purposes
 * - Stripe stores invoices, we provide download links
 * 
 * FLOW:
 * 1. Verify user is authenticated
 * 2. Get payment from database
 * 3. Get invoice from Stripe
 * 4. Return invoice PDF download URL
 * 
 * SECURITY:
 * - Only user's own payments can be accessed
 * - Verifies payment belongs to user's subscription
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📄 Get receipt API called');

    // Step 1: Verify user is authenticated
    // WHY: Only authenticated users can download their receipts
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

    // Step 2: Get payment intent ID from query params
    // WHY: We need to know which receipt to download
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Step 3: Verify payment belongs to user
    // WHY: Security - users can only download their own receipts
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        id,
        subscription_id,
        stripe_payment_intent_id,
        subscriptions!inner(user_id)
      `)
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (paymentError || !payment) {
      console.error('❌ Payment not found:', paymentError);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify payment belongs to user
    // WHY: Get subscription to verify ownership
    const paymentData = payment as { subscription_id: string };
    const { data: paymentSubscription } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('id', paymentData.subscription_id)
      .single();

    const subscriptionData = paymentSubscription as { user_id: string } | null;
    if (!subscriptionData || subscriptionData.user_id !== user.id) {
      console.error('❌ Payment does not belong to user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    console.log('✅ Payment verified:', paymentIntentId);

    // Step 4: Get invoice from Stripe
    // WHY: Stripe stores invoices and provides PDF download URLs
    const stripe = getStripeClient();

    // Find invoice by payment intent
    const invoices = await stripe.invoices.list({
      limit: 100,
    });

    const invoice = invoices.data.find(
      inv => (inv as any).payment_intent === paymentIntentId
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Step 5: Get invoice PDF URL
    // WHY: Stripe provides hosted PDF URLs for invoices
    const invoicePdfUrl = invoice.invoice_pdf;

    if (!invoicePdfUrl) {
      return NextResponse.json(
        { error: 'Invoice PDF not available' },
        { status: 404 }
      );
    }

    console.log('✅ Invoice PDF URL retrieved');

    return NextResponse.json({
      url: invoicePdfUrl,
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      date: new Date(invoice.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error('❌ Error getting receipt:', error);
    return NextResponse.json(
      { error: 'Failed to get receipt' },
      { status: 500 }
    );
  }
}



