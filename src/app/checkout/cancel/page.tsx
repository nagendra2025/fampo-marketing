import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import FampoLogo from '@/components/FampoLogo';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

/**
 * Checkout Cancel Page
 * 
 * WHY THIS PAGE IS NEEDED:
 * - Handles case when user cancels Stripe Checkout
 * - Provides friendly message and options to retry
 * - Verifies user is authenticated
 * 
 * FLOW:
 * 1. User clicks "Cancel" on Stripe Checkout
 * 2. Stripe redirects to this page
 * 3. Page shows cancel message
 * 4. Provides options to retry checkout or go to dashboard
 */
export default async function CheckoutCancelPage() {
  // Step 1: Verify user is authenticated
  // WHY: Only authenticated users should see cancel page
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup');
  }

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
        <div className="mx-auto max-w-2xl text-center">
          <div className="space-y-6">
            {/* Cancel Icon */}
            <div className="flex justify-center">
              <XCircle className="h-20 w-20 text-orange-500" />
            </div>

            {/* Cancel Message */}
            <div>
              <h1 className="mb-4 text-4xl font-bold text-zinc-900">
                Checkout Cancelled
              </h1>
              <p className="text-xl text-zinc-600">
                No charges were made to your account.
              </p>
            </div>

            {/* Information Card */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-zinc-900">
                What Happened?
              </h2>
              <p className="mb-6 text-zinc-600">
                You cancelled the checkout process. Your account is still active,
                but you haven't started a subscription yet.
              </p>
              <div className="rounded-lg bg-zinc-50 p-4 text-left">
                <p className="text-sm text-zinc-700">
                  <strong>No worries!</strong> You can try again anytime. Your
                  early bird pricing eligibility is still valid if you joined
                  the waitlist before March 31, 2025.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <CreditCard className="h-5 w-5" />
                Try Checkout Again
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-8 py-4 text-lg font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <ArrowLeft className="h-5 w-5" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}




