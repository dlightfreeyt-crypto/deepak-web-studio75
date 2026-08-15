# Supabase + GitHub + Netlify Aesthetic Portfolio

This version uses **Supabase for Auth, Postgres and Storage** and is designed for a GitHub → Netlify deployment.

## 1. Supabase

Create a Supabase project.

Open SQL Editor and run `supabase-schema.sql`.

**Before running it**, replace:

`REPLACE_ADMIN_EMAIL`

with the email you will use for `/admin`.

Then create that user in Supabase Authentication → Users with Email/Password.

## 2. Environment variables

Create `.env.local` locally and set:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email
```

The publishable key is safe for browser use when Row Level Security is configured correctly. Never put the Supabase service-role key in `NEXT_PUBLIC_*`.

## 3. Run

```bash
npm install
npm run dev
```

Open `/` and `/admin`.

## 4. GitHub

Create a GitHub repository and push the project.

Do NOT upload `.env.local`.

## 5. Netlify

Import the GitHub repository into Netlify.

Netlify should detect Next.js. Build command:

`npm run build`

Publish directory:

`.next`

Add these environment variables in Netlify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`

Then deploy.

## 6. Important security note

The admin dashboard is protected by Supabase Auth and database/storage RLS. The admin email in the SQL function must exactly match the Supabase Auth user's email.

For production, keep RLS enabled and never expose a service-role key in the browser.

## Current admin controls

- Site name
- Tagline
- WhatsApp number
- Contact details/social links
- About content
- Profile image
- Per-slide backgrounds
- Gallery upload/delete
- Feedback inbox/delete
