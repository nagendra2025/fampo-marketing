-- Create waitlist table for storing email signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active')),
  early_bird BOOLEAN DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE,
  created_account_at TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for signups)
CREATE POLICY "Allow public waitlist signups" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin purposes)
CREATE POLICY "Allow authenticated read" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);


