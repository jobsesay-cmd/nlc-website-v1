# Sierra Leone National Land Commission (NLC) Website

This repository now contains the baseline **Next.js App Router** architecture for the NLC public website, admin routes, and API endpoints.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env` and set values:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`

Environment variables are validated in `src/lib/env.ts` with Zod.
