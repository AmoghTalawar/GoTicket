-- Simplified SQL for GoTicket - Run this in Supabase SQL Editor

-- 1. First, check if profiles table exists and drop it if needed
DROP TABLE IF EXISTS profiles;

-- 2. Create profiles table (all fields optional to avoid trigger failures)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  account_type TEXT DEFAULT 'attendee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 5. Create simple policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 6. Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 7. Test: Check if you can manually insert (this will help debug)
-- Uncomment to test: 
-- INSERT INTO auth.users (id, email) VALUES ('test-id', 'test@test.com') ON CONFLICT DO NOTHING;

SELECT 'SQL executed successfully. Table profiles created.' as status;
