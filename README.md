# GoTicket — Event Registration Platform

<div align="center">

**A full-stack event management and registration platform built with Go and Next.js**

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Overview

GoTicket is a modern event management platform where users can browse events, register with a booking form, and manage their registrations. It features a **Go backend** for API handling with Supabase as the database, and a **Next.js frontend** with a sleek dark-themed UI.

### Key Features

- 🎫 **Event Discovery** — Browse, search, and filter events by category
- 📝 **Event Registration** — Book events with a comprehensive form (name, email, phone, ticket count, notes)
- 👤 **User Authentication** — Secure signup/login with Supabase Auth
- 🏗️ **Event Creation** — Organizers can create and manage events
- 💰 **Indian Rupees (₹)** — All prices displayed in INR
- 📊 **Capacity Tracking** — Real-time availability and spot tracking
- 🛡️ **Duplicate Prevention** — Users can't register for the same event twice
- 🔒 **Row-Level Security** — Supabase RLS policies for data protection

---

## 🏛️ Architecture

```
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│                    │       │                    │       │                    │
│   Next.js 16       │──────▶│   Go Backend       │──────▶│   Supabase         │
│   (Frontend)       │ HTTP  │   (REST API)       │ REST  │   (PostgreSQL)     │
│   Port 3000        │       │   Port 8080        │       │   + Auth           │
│                    │◀──────│                    │◀──────│                    │
└────────────────────┘       └────────────────────┘       └────────────────────┘
```

---

## 🗂️ Project Structure

```
GoTicket/
├── main.go                    # Go backend — API handlers, middleware, routes
├── supabase.go                # Supabase Auth client (signup, signin, profile)
├── go.mod / go.sum            # Go dependencies
│
├── app/                       # Next.js App Router pages
│   ├── page.tsx               # Home page
│   ├── login/page.tsx         # Login page
│   ├── register/page.tsx      # Registration page
│   ├── events/
│   │   ├── page.tsx           # Events list (fetches from API)
│   │   ├── [id]/page.tsx      # Event detail + booking form (dynamic)
│   │   ├── [slug]/page.tsx    # Event detail (static/demo events)
│   │   └── create/page.tsx    # Create event form
│   ├── my-registrations/page.tsx  # User's registrations
│   └── success/page.tsx       # Booking success page
│
├── lib/
│   └── api.ts                 # Frontend API client for Go backend
│
├── components/                # UI components (Header, etc.)
├── styles/                    # Global CSS
│
├── supabase_schema.sql        # Database schema (events, registrations, profiles)
├── .env.example               # Backend env template
├── .env.frontend.example      # Frontend env template
└── README.md
```

---

## ⚡ API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/register` | Create a new account | ✓ |
| `POST` | `/api/login` | Sign in | ✓ |
| `GET` | `/api/profile` | Get user profile | ✓ |

### Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/events` | List all active events | ✓ |
| `GET` | `/api/events?category=Tech` | Filter by category | ✓ |
| `GET` | `/api/events?search=AI` | Search events | ✓ |
| `POST` | `/api/events` | Create a new event | ✓ |
| `GET` | `/api/events/{id}` | Get event details | ✓ |
| `PUT` | `/api/events/{id}` | Update event (organizer only) | ✓ |
| `DELETE` | `/api/events/{id}` | Cancel event (organizer only) | ✓ |

### Registrations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/registrations` | List user's registrations | ✓ |
| `POST` | `/api/registrations` | Register for an event | ✓ |
| `POST` | `/api/registrations/cancel` | Cancel a registration | ✓ |

**Auth = ✓** means the endpoint requires an `Authorization: Bearer <token>` header.

---

## 🗄️ Database Schema

The project uses **Supabase (PostgreSQL)** with the following tables:

### `events`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Event name |
| `description` | TEXT | Event description |
| `event_date` | TIMESTAMPTZ | When the event occurs |
| `location` | TEXT | Venue/location |
| `category` | TEXT | Category (Tech, Business, etc.) |
| `price` | DECIMAL(10,2) | Ticket price in ₹ |
| `capacity` | INTEGER | Max attendees |
| `organizer_id` | UUID | FK to auth.users |
| `status` | TEXT | active / draft / cancelled / completed |

### `registrations`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `event_id` | UUID | FK to events |
| `user_id` | UUID | FK to auth.users |
| `status` | TEXT | confirmed / pending / cancelled |
| `notes` | TEXT | Booking details |
| `UNIQUE` | — | `(event_id, user_id)` prevents duplicates |

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | FK to auth.users |
| `full_name` | TEXT | User's full name |
| `phone_number` | TEXT | Phone number |
| `account_type` | TEXT | attendee / organizer |

> Run `supabase_schema.sql` in Supabase SQL Editor to set up all tables and RLS policies.

---

## 🚀 Getting Started

### Prerequisites

- [Go 1.21+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- [Supabase account](https://supabase.com/) (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/AmoghTalawar/GoTicket.git
cd GoTicket
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to **SQL Editor** and run the contents of `supabase_schema.sql`
3. Copy your **Project URL**, **anon key**, and **service role key** from Settings → API

### 3. Configure Environment Variables

**Backend (.env):**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=8080
```

**Frontend (.env.local):**
```bash
cp .env.frontend.example .env.local
# Edit .env.local with your values
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install Dependencies & Run

**Backend (Go):**
```bash
go mod tidy
go run main.go
# Server starts on http://localhost:8080
```

**Frontend (Next.js):**
```bash
npm install
npm run dev
# App starts on http://localhost:3000
```

### 5. Use the App

1. Open `http://localhost:3000` in your browser
2. **Register** a new account at `/register`
3. **Browse events** at `/events`
4. **Click an event** → **Book Now** → fill in the form → submit
5. Check your registrations at `/my-registrations`

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Go (net/http, encoding/json) |
| **Frontend** | Next.js 16 (App Router, Turbopack) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI, Material Symbols |
| **Env Loading** | godotenv (Go), Next.js built-in (.env.local) |

---

## 🔐 Middleware

The Go backend includes the following middleware:

- **CORS** — Allows cross-origin requests from the frontend (`Access-Control-Allow-Origin: *`)
- **Rate Limiting** — IP-based, 100 requests per hour
- **Authentication** — Extracts and validates JWT tokens from the `Authorization` header

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using Go + Next.js + Supabase</p>
</div>
