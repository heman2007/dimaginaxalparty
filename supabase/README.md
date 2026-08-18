# Supabase backend

This covers the database, auth, and the email template that together power
membership sign-up: a visitor enters their name/city/reason/email, we send
them a one-time code plus their membership details in the same email, they
verify the code, and get their card on screen instantly. Returning visitors
verify the same way and land back on their existing card — that's the
"login." No separate email service is needed — Supabase's built-in auth
email does the job.

## 1. Create a project

Create a project at [supabase.com](https://supabase.com/dashboard). Note
the **Project URL** and **anon public key** from *Project Settings > API* —
you'll need them for `.env.local` (local dev) and for Vercel's environment
variables (production).

## 2. Run the schema

Open the SQL editor in the Supabase dashboard and run
[`migrations/0001_init.sql`](./migrations/0001_init.sql). It creates:

- `public.members` — one row per member, keyed by their auth user id, with
  row-level security so a member can only ever read/write their own row.
- `generate_membership_id()` — a DB-side fallback generator (ids like
  `DNP-2026-AB12C`). In normal use the frontend generates this same-shaped
  id itself so it can be included in the email *before* the row exists —
  see step 4.
- `get_member_count()` — a `security definer` function that returns just
  the total row count to anonymous visitors, without exposing any member's
  data. This powers the "N members and counting" counter on the site.

If you prefer the CLI: `supabase db push` after linking this repo's
`supabase/` folder to your project.

## 3. Enable email OTP

*Authentication > Providers* — confirm **Email** is enabled (on by
default).

## 4. Customize the OTP email template to include membership details

The frontend calls `signInWithOtp` with a `data` payload containing
`name`, `city`, `reason`, and `membership_id`. Supabase makes anything in
that payload available in the email template as `{{ .Data.<field> }}`.

Go to *Authentication > Email Templates > Magic Link* and replace the body
with something like:

```html
<h2>Your Dimagi Naxal Party details</h2>
<p><strong>Name:</strong> {{ .Data.name }}</p>
<p><strong>City:</strong> {{ .Data.city }}</p>
<p><strong>Membership ID:</strong> {{ .Data.membership_id }}</p>
<p><strong>Why you think:</strong> {{ .Data.reason }}</p>

<h3>Your verification code</h3>
<p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">{{ .Token }}</p>
<p>Enter this code on the site to confirm and see your card on screen.</p>
```

Keep `{{ .Token }}` in there — it's the 6-digit code the frontend's OTP
step actually verifies. Everything else is just informational text pulled
from what the visitor typed into the join form.

Note: Supabase's default rate limit for auth emails (a few per hour per
project on the free tier) applies here too — fine for testing, but keep an
eye on it if you expect a signup surge; you can request a higher limit or
switch to a custom SMTP provider under *Project Settings > Auth > SMTP
Settings* later without changing any app code.

## 5. Add allowed URLs

*Authentication > URL Configuration* — add `http://localhost:8080` (local
dev) and your production URL once you have one, under Redirect URLs.

## 6. Frontend environment variables

Copy `.env.example` to `.env.local` for local dev, and add the same two
variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel's
project settings for production. See [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

## Viewing / exporting signups

There's no admin UI yet. Query `public.members` directly from the
Supabase dashboard's Table Editor (which also has a CSV export button), or
via SQL:

```sql
select name, city, email, membership_id, created_at
from public.members
order by created_at desc;
```
