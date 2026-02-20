import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import SignupForm from '@/components/auth/SignupForm';
import FampoLogo from '@/components/FampoLogo';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  // Check if user is already logged in
  // WHY: Wrap in try-catch to prevent errors from breaking the page
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Only check subscription if user is authenticated and no auth error
    if (user && !authError) {
      // Check if user has canceled subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'canceled')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // If user has canceled subscription, redirect to checkout
      if (subscription) {
        redirect('/checkout');
      }

      // If user is logged in with active subscription, redirect to dashboard
      const { data: activeSubscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeSubscription) {
        redirect('/dashboard');
      }
    }
  } catch (error) {
    // Silently fail - don't break signup page if subscription check fails
    // User can still sign up, just won't get redirected if already logged in
    console.error('Error checking subscription status:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <FampoLogo size={48} className="rounded-lg shadow-md" />
            <span className="text-2xl font-semibold text-zinc-900">Fampo</span>
          </div>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}

