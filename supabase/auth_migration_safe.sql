-- ============================================
-- PHASE 0: Authentication System Migration (SAFE VERSION)
-- ============================================
-- This version avoids DROP statements to prevent warnings
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Users can read their own profile
-- Drop policy if exists, then create
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    DROP POLICY "Users can view own profile" ON public.profiles;
  END IF;
END $$;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 5. RLS Policy: Users can update their own profile
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON public.profiles;
  END IF;
END $$;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. RLS Policy: Users can insert their own profile (via trigger)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    DROP POLICY "Users can insert own profile" ON public.profiles;
  END IF;
END $$;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 7. Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger to call the function when a new user is created
-- Check if trigger exists first
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 9. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Trigger to automatically update updated_at
-- Check if trigger exists first
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 11. Update waitlist table: Add early_bird_cutoff_date column
ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS early_bird_cutoff_date TIMESTAMP WITH TIME ZONE;

-- 12. Set early bird cutoff date to March 31, 2025
-- Only update if column is NULL (safe update)
UPDATE public.waitlist
SET early_bird_cutoff_date = '2025-03-31 23:59:59+00'::TIMESTAMP WITH TIME ZONE
WHERE early_bird_cutoff_date IS NULL;

-- 13. Update early_bird status based on cutoff date
-- Only update if early_bird is NULL (safe update)
UPDATE public.waitlist
SET early_bird = true
WHERE created_at <= '2025-03-31 23:59:59+00'::TIMESTAMP WITH TIME ZONE
  AND early_bird IS NULL;

-- 14. Add comment for documentation
COMMENT ON COLUMN public.waitlist.early_bird_cutoff_date IS 
  'Cutoff date for early bird pricing. Users who joined waitlist before this date get $44 CAD/month, others get $62 CAD/month.';







