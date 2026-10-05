# Vercel deployment

This application uses Prisma with PostgreSQL. Vercel serverless filesystems are ephemeral, so a hosted PostgreSQL database is required for production and preview deployments.

## Required production setup

1. Provision a hosted PostgreSQL database (for example Vercel Postgres/Neon).
2. Set `DATABASE_URL` to its pooled PostgreSQL connection string in Vercel Project Settings → Environment Variables for Production and Preview. Do not use `file:./dev.db`.
3. Set `ADMIN_SESSION_SECRET` to a long random value.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_STORE_NAME` in Vercel.
5. Keep the Prisma datasource provider set to `postgresql` in `prisma/schema.prisma`.
6. Run `npx prisma migrate deploy` against the hosted database.
7. Seed the production database with `npm run db:seed` only when an initial dataset is desired; the seed clears existing application data.

The build is configured to defer database-backed storefront and admin pages to request time, so Vercel does not require a database during static generation. A production `DATABASE_URL` is still required when those routes receive requests. Run migrations before deploying or as part of a controlled release step; do not run `prisma migrate dev` in Vercel's build.

## Important

Do not use `file:./dev.db` in Vercel. It will not provide persistent production data and may be lost between serverless invocations.