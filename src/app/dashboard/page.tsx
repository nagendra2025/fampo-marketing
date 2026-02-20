import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import FampoLogo from '@/components/FampoLogo';
import SyncSubscriptionButton from '@/components/SyncSubscriptionButton';
import SubscriptionManagement from '@/components/SubscriptionManagement';
import { formatAmountForDisplay, isInTrialPeriod } from '@/lib/stripe/utils';
import { Calendar, CreditCard, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

/**
 * Dashboard Page with Subscription Management
 * 
 * WHY THIS PAGE IS NEEDED:
 * - Shows user's subscription status
 * - Displays trial period information
 * - Shows payment history
 * - Provides subscription management options
 * 
 * FLOW:
 * 1. Verify user authentication
 * 2. Get user profile
 * 3. Get subscription from database
 * 4. Get payment history
 * 5. Display all information
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: { email?: string; full_name?: string | null; created_at?: string } | null };

  // Get subscription from database
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: {
      id: string;
      status: string;
      trial_end: string | null;
      current_period_end: string | null;
      price_amount: number;
      cancel_at_period_end: boolean;
      stripe_subscription_id: string;
    } | null };

  // If no subscription in database, try to sync from Stripe
  // WHY: Webhook might not have fired yet, so we check Stripe directly
  let syncedSubscription = subscription;
  if (!subscription) {
    try {
      const { getStripeClient } = await import('@/lib/stripe/client');
      const stripe = getStripeClient();
      
      // Find customer by email
      const profileEmail = (profile as { email?: string } | null)?.email;
      const customers = await stripe.customers.list({
        email: profileEmail || user.email || '',
        limit: 1,
      });

      if (customers.data.length > 0) {
        const customer = customers.data[0];
        
        // Get subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 1,
          status: 'all',
        });

        if (subscriptions.data.length > 0) {
          // Subscription exists in Stripe but not in database
          // Trigger sync (non-blocking)
          fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/subscription/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }).catch(err => console.error('Sync error:', err));
        }
      }
    } catch (error) {
      // Silently fail - don't block page render
      console.error('Error checking Stripe:', error);
    }
  }

  // Get payment history
  const subscriptionId = (subscription as { id?: string } | null)?.id;
  const { data: payments } = subscriptionId
    ? await supabase
        .from('payments')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: null };

  // Format dates
  const trialEndDate = subscription?.trial_end
    ? new Date(subscription.trial_end)
    : null;
  const nextBillingDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const isInTrial = trialEndDate ? isInTrialPeriod(trialEndDate) : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <FampoLogo size={40} className="rounded-lg shadow-md" />
            <span className="text-xl font-semibold text-zinc-900">Fampo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">{profile?.email || user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-200"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-zinc-900">Welcome to Fampo!</h1>
            <p className="text-lg text-zinc-600">
              Manage your subscription and view your account details
            </p>
          </div>

          {/* Subscription Status Card */}
          {subscription ? (
            <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
              {/* Show canceled message if subscription is canceled */}
              {subscription.status === 'canceled' && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-800 mb-4">
                    <strong>Subscription Canceled:</strong> Your subscription has been canceled. Access has ended.
                  </p>
                  <p className="text-sm text-red-700 mb-4">
                    If you'd like to subscribe again, please visit our home page to start a new subscription.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Go to Home Page
                  </Link>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-zinc-900">Subscription Status</h2>
                <div className="flex items-center gap-2">
                  {subscription.status === 'active' || subscription.status === 'trialing' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : subscription.status === 'past_due' ? (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  ) : subscription.status === 'canceled' ? (
                    <X className="h-5 w-5 text-red-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-zinc-400" />
                  )}
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 capitalize">
                    {subscription.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-sm font-medium text-zinc-500">Plan</p>
                    <p className="text-lg font-semibold text-zinc-900">Family Plan</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-zinc-500">Monthly Price</p>
                    <p className="text-lg font-semibold text-zinc-900">
                      {formatAmountForDisplay(subscription.price_amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {isInTrial && trialEndDate && (
                    <div>
                      <p className="mb-1 text-sm font-medium text-zinc-500">Trial Ends</p>
                      <p className="text-lg font-semibold text-zinc-900">
                        {trialEndDate.toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    </div>
                  )}
                  {nextBillingDate && !isInTrial && (
                    <div>
                      <p className="mb-1 text-sm font-medium text-zinc-500">Next Billing Date</p>
                      <p className="text-lg font-semibold text-zinc-900">
                        {nextBillingDate.toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {subscription.status === 'past_due' && (
                <div className="mt-6 rounded-lg bg-orange-50 border border-orange-200 p-4">
                  <p className="text-sm text-orange-800">
                    <strong>Payment Required:</strong> Your last payment failed. Please update your payment method to continue using Fampo.
                  </p>
                </div>
              )}

              {/* Subscription Management */}
              <div className="mt-6 border-t border-zinc-200 pt-6">
                {subscription && subscription.current_period_end && (
                  <SubscriptionManagement
                    subscription={{
                      id: subscription.id,
                      status: subscription.status,
                      cancel_at_period_end: subscription.cancel_at_period_end,
                      current_period_end: subscription.current_period_end,
                      stripe_subscription_id: subscription.stripe_subscription_id,
                    }}
                    payments={payments || []}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900">No Active Subscription</h2>
              <p className="mb-6 text-zinc-600">
                {syncedSubscription 
                  ? 'Subscription found in Stripe but not synced to database yet. Click "Sync Subscription" to update.'
                  : 'You don\'t have an active subscription yet. Start your 2-month free trial today!'}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {syncedSubscription && (
                  <SyncSubscriptionButton />
                )}
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <CreditCard className="h-5 w-5" />
                  Subscribe Now
                </Link>
              </div>
            </div>
          )}


          {/* Account Information */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-zinc-500">Email</p>
                <p className="text-base text-zinc-900">{profile?.email || user.email}</p>
              </div>
              {profile?.full_name && (
                <div>
                  <p className="text-sm font-medium text-zinc-500">Full Name</p>
                  <p className="text-base text-zinc-900">{profile.full_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-zinc-500">Account Created</p>
                <p className="text-base text-zinc-900">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
