-- ============================================
-- PHASE 1: Subscriptions & Payments Migration
-- ============================================
-- This migration creates tables for Stripe subscription management
-- Run this in your Supabase SQL Editor

-- 1. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
  plan_type TEXT NOT NULL DEFAULT 'family' CHECK (plan_type = 'family'),
  price_amount INTEGER NOT NULL, -- Amount in cents (e.g., 4400 = $44.00 CAD)
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency = 'CAD'),
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false NOT NULL,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- 3. Create index on stripe_subscription_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- 4. Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 5. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency = 'CAD'),
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending', 'canceled', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. Create index on subscription_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id);

-- 7. Create index on stripe_payment_intent_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON public.payments(stripe_payment_intent_id);

-- 8. Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policy: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 11. RLS Policy: Users can read their own payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE subscriptions.id = payments.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- 12. RLS Policy: Service role can insert/update subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 13. RLS Policy: Service role can insert/update payments (for webhooks)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 14. Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_subscriptions_updated_at();

-- 16. Add comments for documentation
COMMENT ON TABLE public.subscriptions IS 
  'Stores user subscription data synced from Stripe. Links users to their Stripe subscriptions.';

COMMENT ON TABLE public.payments IS 
  'Stores payment history for subscriptions. Records all payment attempts and their status.';

COMMENT ON COLUMN public.subscriptions.price_amount IS 
  'Price in cents (e.g., 4400 = $44.00 CAD). Early bird: 4400, Regular: 6200.';

COMMENT ON COLUMN public.subscriptions.status IS 
  'Subscription status from Stripe: active, trialing, past_due, canceled, etc.';

COMMENT ON COLUMN public.subscriptions.trial_end IS 
  'End date of 2-month free trial. After this date, billing starts automatically.';

