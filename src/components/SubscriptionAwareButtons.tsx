'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';
import CanceledSubscriptionBanner from './CanceledSubscriptionBanner';

/**
 * Canceled Subscription Banner Wrapper
 * 
 * WHY THIS IS A CLIENT COMPONENT:
 * - Prevents hydration errors by checking subscription status on client
 * - Uses useEffect to check after mount, ensuring consistent initial render
 * - Only shows banner if user has canceled subscription
 */
export function CanceledSubscriptionBannerWrapper() {
  const [hasCanceledSubscription, setHasCanceledSubscription] = useState(false);

  useEffect(() => {
    // WHY: Check subscription status on client after mount
    // This prevents hydration errors by ensuring initial render is consistent
    async function checkSubscription() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (user && !authError) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'canceled')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          setHasCanceledSubscription(!!subscription);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    }

    checkSubscription();
  }, []);

  if (!hasCanceledSubscription) return null;

  return <CanceledSubscriptionBanner />;
}

/**
 * Subscription-Aware Button Component
 * 
 * WHY THIS IS A CLIENT COMPONENT:
 * - Prevents hydration errors by checking subscription status on client
 * - Uses useEffect to check after mount, ensuring consistent initial render
 * - Handles subscription-aware button text and links
 */
export default function SubscriptionAwareButtons() {
  const [hasCanceledSubscription, setHasCanceledSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // WHY: Check subscription status on client after mount
    // This prevents hydration errors by ensuring initial render is consistent
    async function checkSubscription() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (user && !authError) {
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'canceled')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          setHasCanceledSubscription(!!subscription);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, []);

  return (
    <div className="mb-3 flex flex-col items-center justify-center gap-3 sm:mb-4 sm:flex-row">
      <a
        href={hasCanceledSubscription ? "/checkout" : "/signup"}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
      >
        {isLoading ? "Get Started Now" : hasCanceledSubscription ? "Subscribe Again" : "Get Started Now"}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </a>
      <a
        href="#join-waitlist"
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-blue-600 bg-white px-8 py-3.5 text-base font-semibold text-blue-600 transition-all hover:border-blue-700 hover:bg-blue-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
      >
        Join Waitlist
      </a>
      <a
        href="#how-it-works"
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto"
      >
        Learn More
      </a>
    </div>
  );
}

