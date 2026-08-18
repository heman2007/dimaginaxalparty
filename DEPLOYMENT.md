# Deployment runbook

Same stack as the other site: **Supabase** for the backend, **Vercel** for
hosting. These steps happen in your own Supabase/Vercel/GitHub accounts —
nothing here can be run on your behalf.

## 1. Backend first

Follow [`supabase/README.md`](./supabase/README.md) end to end: create the
project, run the migration, turn on email OTP, and customize the auth
email template to show membership details. Keep the Project URL and anon
key handy for step 3.

## 2. Push the repo to GitHub

```sh
git init   # if this isn't already a git repo
git add -A
git commit -m "Dimagi Naxal Party site + Supabase backend"
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## 3. Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. Build command: `npm run build`, output directory: `dist` (defaults —
   no change needed).
4. Add environment variables (Project Settings > Environment Variables,
   for the Production, Preview, *and* Development environments):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

`vercel.json` in the repo root already adds the SPA rewrite so client-side
routes (and the 404 page) work correctly instead of Vercel 404ing on
anything that isn't `/`.

## 4. Custom domain (optional)

Project Settings > Domains in Vercel → add your domain → follow the DNS
instructions it gives you (usually a CNAME or A record at your registrar).
Then add that same domain to Supabase's allowed redirect URLs
(Authentication > URL Configuration) so auth email links work from
production.

## 5. Verify end to end

- Visit the deployed URL, fill in the join form with a real email you can
  check, confirm the email arrives with your membership details and code,
  and that entering the code shows the card on screen.
- Refresh the page mid-flow to confirm the 404 page and routing still work.
- Check `public.members` in the Supabase Table Editor to confirm the row
  was written and the counter on the homepage reflects it.

## Ongoing

- `npm run test` and `npm run lint` before pushing — there's no CI wired up
  yet, so this is manual for now.
- Vercel redeploys automatically on every push to `main`.
