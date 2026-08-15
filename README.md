# CampusEats 🍽️

A food rating platform for Bennett University students. Discover and rate food items across campus outlets with crowd-sourced reviews.

## Features

- **Magic-link Authentication**: Sign in with your `@bennett.edu.in` email
- **Browse Outlets**: View all campus food outlets with photos and ratings
- **Rate Items**: Rate food on 4 dimensions (Taste, Hygiene, Quantity, Value for Money)
- **View Reviews**: See what other students think about each item
- **Admin Panel**: Manage outlets and menu items
- **Report Comments**: Flag inappropriate content for moderation

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend/Auth/Database**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (frontend) + Supabase Cloud (database)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be ready (takes 1-2 minutes)
3. Go to Project Settings → API to get your credentials

### 2. Set Up Database Schema

1. In Supabase, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it to create all tables and RLS policies

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Configure Email Auth

1. In Supabase, go to Authentication → Providers
2. Enable Email provider
3. Under "Email Confirmation", disable "Confirm email" (for magic-link)
4. Set "Site URL" to your local URL: `http://localhost:3000`
5. Set "Redirect URLs" to: `http://localhost:3000/auth/callback`

### 5. Set Up Admin User

1. In Supabase, go to Table Editor → `profiles`
2. Find your user row (after first login)
3. Set `is_admin` to `true`
4. Save the changes

### 6. Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment to Vercel

### 1. Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a repository on GitHub and push your code

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

### 3. Update Supabase Redirect URLs

After deployment, update your Supabase auth settings:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app/auth/callback`

## Usage

### For Students

1. Sign in with your `@bennett.edu.in` email
2. Browse outlets and their menus
3. Rate items you've tried
4. Read reviews from other students

### For Admins

1. Access the Admin Panel (visible if `is_admin = true`)
2. Add/edit/delete food outlets
3. Add/edit/delete menu items
4. Review and delete reported comments

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── auth/              # Auth callback routes
│   ├── items/[id]/        # Item detail page
│   ├── login/             # Login page
│   ├── outlets/[id]/      # Outlet detail page
│   └── page.tsx           # Home page (outlet listing)
├── components/            # React components
│   ├── Navbar.tsx
│   ├── RatingForm.tsx
│   └── ReportButton.tsx
├── lib/
│   └── supabase/          # Supabase client configuration
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
└── middleware.ts          # Next.js middleware for auth
```

## License

This project is for Bennett University campus use.
