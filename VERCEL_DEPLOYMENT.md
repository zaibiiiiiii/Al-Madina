# Vercel deployment

This application uses Prisma with SQLite for local development. Vercel serverless filesystems are ephemeral and cannot persist a local SQLite database between requests.

## Required production setup

1. Provision a hosted PostgreSQL database (for example Vercel Postgres/Neon).
2. Set `DATABASE_URL` in Vercel Project Settings → Environment Variables for Production, Preview, and Development.
3. Set `ADMIN_SESSION_SECRET` to a long random value.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_STORE_NAME` in Vercel.
5. Change the Prisma datasource provider from `sqlite` to `postgresql`.
6. Run the Prisma migration and seed against the hosted database.

The build is configured to defer database-backed storefront and admin pages to request time, so Vercel does not require a database during static generation. A production `DATABASE_URL` is still required when those routes receive requests.

## Important

Do not use `file:./dev.db` in Vercel. It will not provide persistent production data and may be lost between serverless invocations.