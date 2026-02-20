import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import FampoLogo from '@/components/FampoLogo';
import CheckoutSuccessHandler from '@/components/CheckoutSuccessHandler';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

/**
 * Checkout Success Page
 * 
 * WHY THIS PAGE IS NEEDED:
 * - Confirms successful payment to user
 * - Provides next steps after subscription
 * - Verifies user is authenticated
 * - Shows subscription status
 * 
 * FLOW:
 * 1. User completes payment on Stripe
 * 2. Stripe redirects to this page with session_id
 * 3. Page verifies user authentication
 * 4. Shows success message and next steps
 * 5. Provides link to dashboard
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  // Step 1: Verify user is authenticated
  // WHY: Only authenticated users should see success page
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup');
  }

  // Step 2: Get user profile
  // WHY: Display user's name/email in success message
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', user.id)
    .single() as { data: { email: string; full_name: string | null } | null };

  // Step 3: Sync subscription and send email
  // WHY: Webhook might not have fired yet, so we sync immediately
  // Also send confirmation email since user didn't receive one from Stripe
  // NOTE: This is handled by CheckoutSuccessHandler client component

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <FampoLogo size={40} className="rounded-lg shadow-md" />
            <span className="text-xl font-semibold text-zinc-900">Fampo</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Client component to handle sync and email */}
        <Suspense fallback={null}>
          <CheckoutSuccessHandler />
        </Suspense>
        
        <div className="mx-auto max-w-2xl text-center">
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle2 className="h-20 w-20 text-green-600" />
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400" />
              </div>
            </div>

            {/* Success Message */}
            <div>
              <h1 className="mb-4 text-4xl font-bold text-zinc-900">
                Welcome to Fampo! 🎉
              </h1>
              <p className="mb-2 text-xl text-zinc-600">
                Your subscription is active
              </p>
              {profile?.full_name && (
                <p className="text-lg text-zinc-500">
                  {profile.full_name}
                </p>
              )}
            </div>

            {/* Subscription Details */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
                What's Next?
              </h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-zinc-900">
                      2-Month Free Trial Started
                    </p>
                    <p className="text-sm text-zinc-600">
                      Enjoy full access to Fampo for 2 months, completely free!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-zinc-900">
                      Automatic Billing After Trial
                    </p>
                    <p className="text-sm text-zinc-600">
                      Your subscription will automatically continue after the trial period.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-medium text-zinc-900">
                      Access Your Dashboard
                    </p>
                    <p className="text-sm text-zinc-600">
                      Start using Fampo right away from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Session ID (for debugging) */}
            {searchParams.session_id && (
              <p className="pt-4 text-xs text-zinc-400">
                Session ID: {searchParams.session_id.substring(0, 20)}...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

