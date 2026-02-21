-- Fix RLS policies for profile creation
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies that allow service role (for backend) and user role
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Grant service role permissions
GRANT ALL ON profiles TO service_role;
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

SELECT 'RLS policies fixed for service role' as status;
