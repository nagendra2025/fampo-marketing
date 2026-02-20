'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FampoLogo from '@/components/FampoLogo';
import { Loader2, CreditCard, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * Checkout Page Component
 * 
 * WHY THIS PAGE IS NEEDED:
 * - Provides a loading state while creating Stripe Checkout Session
 * - Automatically redirects user to Stripe Checkout
 * - Shows user-friendly UI during the redirect process
 * 
 * FLOW:
 * 1. Page loads → Automatically calls API to create checkout session
 * 2. Shows loading state while API processes
 * 3. Gets Stripe Checkout URL from API
 * 4. Redirects user to Stripe Checkout
 * 5. User completes payment on Stripe
 * 6. Stripe redirects back to success/cancel page
 */
export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * WHY: We create checkout session on page load
     * - Ensures user is authenticated before checkout
     * - Gets latest pricing based on waitlist status
     * - Creates fresh session each time (prevents reuse)
     */
    async function createCheckoutSession() {
      try {
        setIsLoading(true);
        setError(null);

        // Call API to create Stripe Checkout Session
        // WHY: Must be done server-side for security (API keys are secret)
        const response = await fetch('/api/checkout/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }

        if (!data.url) {
          throw new Error('No checkout URL received');
        }

        // Redirect to Stripe Checkout
        // WHY: Stripe Checkout handles payment securely
        // User completes payment on Stripe's secure page
        window.location.href = data.url;
      } catch (err) {
        console.error('Checkout error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    }

    createCheckoutSession();
  }, [router]);

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
          {isLoading && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold text-zinc-900">
                  Preparing Your Checkout
                </h1>
                <p className="text-lg text-zinc-600">
                  We're setting up your secure payment session...
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-zinc-700">
                      Verifying your account
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-zinc-700">
                      Checking early bird eligibility
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-sm text-zinc-700">
                      Creating secure checkout session
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-red-50 p-8 shadow-lg">
                <h2 className="mb-4 text-2xl font-bold text-red-900">
                  Checkout Error
                </h2>
                <p className="mb-6 text-red-700">{error}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="rounded-lg border border-red-300 bg-white px-6 py-3 font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
