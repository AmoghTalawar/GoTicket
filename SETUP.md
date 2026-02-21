# GoTicket Setup Instructions

## Backend Setup (Go + Supabase)

### 1. Set Up Supabase Database
1. Go to https://app.supabase.com
2. Select your project (umyarehflskhhjkkvypd)
3. Go to SQL Editor → New Query
4. Run the SQL from `register_fields.sql`:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT UNIQUE,
  account_type TEXT DEFAULT 'attendee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone_number, email, account_type, created_at, updated_at)
  VALUES (NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    NEW.email,
    'attendee',
    NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users 
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Run the Go Backend

#### Windows (PowerShell):
```powershell
# Set environment variables
$env:SUPABASE_URL = "https://umyarehflskhhjkkvypd.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteWFyZWhmbHNraGhqa2t2eXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDQ2ODgsImV4cCI6MjA4NzE4MDY4OH0.8XA678Wq4OszO4-TmFHb7A08CHCHRmbPViKJgPYedGk"
$env:PORT = "8080"

# Run the server
go run main.go
```

#### Linux/Mac:
```bash
# Set environment variables
export SUPABASE_URL="https://umyarehflskhhjkkvypd.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteWFyZWhmbHNraGhqa2t2eXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDQ2ODgsImV4cCI6MjA4NzE4MDY4OH0.8XA678Wq4OszO4-TmFHb7A08CHCHRmbPViKJgPYedGk"
export PORT="8080"

# Run the server
go run main.go
```

#### Or use .env file:
```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
# Then run:
go run main.go
```

### 3. Run the Frontend (Next.js)

In a new terminal:

```bash
# Navigate to project directory
cd go-ticket-organizer-dashboard

# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000/register
- **Backend API**: http://localhost:8080

### 5. Test the Registration

1. Open http://localhost:3000/register
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1 555-123-4567
   - Password: TestPass123 (must have uppercase, lowercase, number)
3. Click "Create Account"
4. Check browser console for response

### 6. Verify in Supabase

1. Go to Supabase Dashboard
2. Check Authentication → Users (new user should appear)
3. Check Table Editor → profiles (user profile should be created)

## Features Implemented

### Security:
- ✅ Input validation (email, phone, password strength)
- ✅ Rate limiting (100 requests per hour per IP)
- ✅ CORS enabled for frontend
- ✅ Secure error messages (no secrets exposed)
- ✅ Password requirements: 8+ chars, uppercase, lowercase, number

### Backend:
- ✅ Supabase Auth integration
- ✅ User registration with profile creation
- ✅ Login endpoint
- ✅ Protected profile endpoint
- ✅ JWT token generation

### Frontend:
- ✅ Form validation with error messages
- ✅ Loading states
- ✅ Success/error notifications
- ✅ Real-time validation feedback
- ✅ Disabled inputs during submission

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/register | POST | Create new user |
| /api/login | POST | Authenticate user |
| /api/profile | GET | Get user profile (requires token) |

## Troubleshooting

### "Failed to connect to Supabase"
- Check SUPABASE_URL and SUPABASE_ANON_KEY are set correctly
- Verify Supabase project is active

### "CORS error"
- Backend CORS is configured for all origins (*)
- Check browser console for detailed error

### "Rate limit exceeded"
- Wait 1 hour or restart backend to reset
- Or modify rate limit in main.go

### "Validation error"
- Check password meets requirements
- Verify email format
- Ensure phone number has 10+ digits

## Next Steps

1. Add email verification
2. Implement password reset
3. Add OAuth (Google/GitHub)
4. Create user dashboard
5. Add event management endpoints
