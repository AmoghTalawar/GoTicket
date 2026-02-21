-- GoTicket Database Schema for Supabase (Updated to handle existing policies)
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  account_type TEXT DEFAULT 'attendee' CHECK (account_type IN ('attendee', 'organizer', 'vendor')),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  category TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  capacity INTEGER,
  organizer_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  price_paid DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled', 'refunded')),
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Registrations Table (for event registrations)
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DO $$
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    
    -- Events policies
    DROP POLICY IF EXISTS "Anyone can view active events" ON events;
    DROP POLICY IF EXISTS "Organizers can manage own events" ON events;
    
    -- Tickets policies
    DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
    DROP POLICY IF EXISTS "Users can create own tickets" ON tickets;
    
    -- Registrations policies
    DROP POLICY IF EXISTS "Users can view own registrations" ON registrations;
    DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
    DROP POLICY IF EXISTS "Users can update own registrations" ON registrations;
END $$;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for Events
CREATE POLICY "Anyone can view active events" 
  ON events FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Organizers can manage own events" 
  ON events FOR ALL 
  USING (organizer_id = auth.uid());

-- RLS Policies for Tickets
CREATE POLICY "Users can view own tickets" 
  ON tickets FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own tickets" 
  ON tickets FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Registrations
CREATE POLICY "Users can view own registrations" 
  ON registrations FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own registrations" 
  ON registrations FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own registrations" 
  ON registrations FOR UPDATE 
  USING (user_id = auth.uid());

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_events_organizer;
DROP INDEX IF EXISTS idx_events_date;
DROP INDEX IF EXISTS idx_events_status;
DROP INDEX IF EXISTS idx_tickets_user;
DROP INDEX IF EXISTS idx_tickets_event;
DROP INDEX IF EXISTS idx_registrations_user;
DROP INDEX IF EXISTS idx_registrations_event;

-- Create indexes for better performance
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);

-- Insert sample data (optional, for testing) - only if table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM events LIMIT 1) THEN
    INSERT INTO events (title, description, event_date, location, category, price, capacity, status) VALUES
    ('Tech Conference 2024', 'Annual technology conference', '2024-06-15 09:00:00+00', 'San Francisco, CA', 'Technology', 299.99, 500, 'active'),
    ('Music Festival', 'Outdoor music festival', '2024-07-20 18:00:00+00', 'Austin, TX', 'Entertainment', 150.00, 2000, 'active'),
    ('Business Workshop', 'Professional development workshop', '2024-05-10 14:00:00+00', 'New York, NY', 'Business', 99.99, 100, 'active');
  END IF;
END $$;
