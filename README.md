# Dimagi Naxal Party

Official website for the Dimagi Naxal Party — a movement for Indians who
question propaganda, follow facts, and put the Constitution first.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- Tailwind CSS + shadcn/ui
- [Supabase](https://supabase.com/) for auth and the members database.
  Membership details and the verification code are delivered through
  Supabase's built-in auth email — no separate email service needed.
- Deployed on [Vercel](https://vercel.com/)

## Development

You need Node.js 18+ and npm.

```sh
git clone <this-repository-url>
cd dimagi-naxal-party
npm i
cp .env.example .env.local   # then fill in your Supabase project values
npm run dev
```

## Scripts

```sh
npm run dev        # start the local dev server
npm run build       # production build
npm run preview     # preview the production build locally
npm run lint         # eslint
npm run test         # run the test suite once
npm run test:watch  # run tests in watch mode
```

## Backend / Supabase setup

See [`supabase/README.md`](./supabase/README.md) for the database schema,
the email-sending edge function, and required environment variables.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full Vercel + Supabase deploy
runbook.
