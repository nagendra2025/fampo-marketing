'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  X, 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

/**
 * Subscription Management Component
 * 
 * WHY THIS IS NEEDED:
 * - Provides UI for subscription management actions
 * - Cancel subscription button
 * - Update payment method button
 * - Download receipts button
 * - User-friendly interface for all subscription actions
 * 
 * FEATURES:
 * - Cancel subscription (immediate or at period end)
 * - Update payment method (via Stripe Customer Portal)
 * - Download receipts
 * - Status feedback for all actions
 */
interface SubscriptionManagementProps {
  subscription: {
    id: string;
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string;
    stripe_subscription_id: string;
  };
  payments?: Array<{
    id: string;
    stripe_payment_intent_id: string;
    amount: number;
    paid_at: string | null;
    status: string;
  }>;
}

export default function SubscriptionManagement({
  subscription,
  payments = [],
}: SubscriptionManagementProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cancelMessage, setCancelMessage] = useState('');

  // WHY: Handle cancel subscription action
  // Provides two options: immediate or at period end
  const handleCancel = async (immediately: boolean = false) => {
    if (!confirm(
      immediately
        ? 'Are you sure you want to cancel immediately? You will lose access right away.'
        : 'Cancel subscription at the end of the billing period? You will keep access until then.'
    )) {
      return;
    }

    setIsCanceling(true);
    setCancelStatus('idle');
    setCancelMessage('');

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelImmediately: immediately }),
      });

      const data = await response.json();

      if (response.ok) {
        setCancelStatus('success');
        setCancelMessage(data.message || 'Subscription canceled successfully');
        // If canceled immediately, redirect to home page after showing message
        // WHY: User canceled, they shouldn't be forced to checkout immediately
        if (immediately) {
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        } else {
          // Reload page after 2 seconds to show updated status
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setCancelStatus('error');
        setCancelMessage(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      setCancelStatus('error');
      setCancelMessage('Network error. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  // WHY: Handle update payment method action
  // Opens Stripe Customer Portal for secure payment method updates
  const handleUpdatePaymentMethod = async () => {
    setIsOpeningPortal(true);

    try {
      const response = await fetch('/api/subscription/update-payment-method', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open payment method settings');
        setIsOpeningPortal(false);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setIsOpeningPortal(false);
    }
  };

  // WHY: Handle download receipt action
  // Opens receipt PDF in new tab
  const handleDownloadReceipt = async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `/api/subscription/receipt?payment_intent_id=${paymentIntentId}`
      );

      const data = await response.json();

      if (response.ok && data.url) {
        // Open receipt PDF in new tab
        window.open(data.url, '_blank');
      } else {
        alert(data.error || 'Failed to download receipt');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  // WHY: Check if subscription is already canceled
  // If status is 'canceled', it's fully canceled
  // If cancel_at_period_end is true, it's scheduled to cancel
  const isCanceled = subscription.status === 'canceled' || subscription.cancel_at_period_end;
  // WHY: Only allow cancellation if subscription is active or trialing (not already canceled)
  const canCancel = (subscription.status === 'active' || subscription.status === 'trialing') && !isCanceled;

  return (
    <div className="space-y-6">
      {/* Subscription Actions */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-zinc-900">Manage Subscription</h3>
        
        <div className="space-y-4">
          {/* Update Payment Method */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-zinc-600" />
              <div>
                <p className="font-medium text-zinc-900">Update Payment Method</p>
                <p className="text-sm text-zinc-500">
                  Change your card or billing information
                </p>
              </div>
            </div>
            <button
              onClick={handleUpdatePaymentMethod}
              disabled={isOpeningPortal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOpeningPortal ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                'Update'
              )}
            </button>
          </div>

          {/* Cancel Subscription */}
          {canCancel && !isCanceled && (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center gap-3">
                <X className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-zinc-900">Cancel Subscription</p>
                  <p className="text-sm text-zinc-500">
                    Cancel at period end to keep access until billing period ends
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCancel(false)}
                  disabled={isCanceling}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCanceling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Cancel at Period End'
                  )}
                </button>
                <button
                  onClick={() => handleCancel(true)}
                  disabled={isCanceling}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCanceling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Cancel Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Cancel Status Messages */}
          {cancelStatus === 'success' && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">{cancelMessage}</p>
            </div>
          )}

          {cancelStatus === 'error' && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{cancelMessage}</p>
            </div>
          )}

          {/* Already Canceled Message */}
          {isCanceled && (
            <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4">
              <p className="text-sm text-zinc-700">
                <strong>Subscription Canceled:</strong>{' '}
                {subscription.cancel_at_period_end
                  ? `Your subscription will end on ${new Date(subscription.current_period_end).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}. You will keep access until then.`
                  : 'Your subscription has been canceled. Access has ended.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment History with Receipt Downloads */}
      {payments && payments.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-zinc-900">Payment History</h3>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-zinc-100 p-2">
                    <CreditCard className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      ${(payment.amount / 100).toFixed(2)} CAD
                    </p>
                    <p className="text-sm text-zinc-500">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      payment.status === 'succeeded'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                  {payment.status === 'succeeded' && (
                    <button
                      onClick={() => handleDownloadReceipt(payment.stripe_payment_intent_id)}
                      className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                      title="Download Receipt"
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



