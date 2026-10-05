# Al Madinah Pakwan and Sheermal House

Integrated ecommerce storefront + admin portal for **Al Madinah Pakwan and Sheermal House** — a Pakistani restaurant / bakery in Gulistan-e-Johar, Karachi (sheermal, pakwan trays, korma, biryani, tandoor breads).

Brand contact and imagery are seeded from the public Google Business listing:

- Share link: https://share.google/Dt1YKtNeIkhfiHcWQ
- Maps listing name: **Al Madina Pakwan And Sheermaal Center**
- Address: A-35, Block 4 / Block 3 Gulistan-e-Johar, Karachi 75500
- Phone: +92 310 7784620
- Hours: daily 11:00 AM – 12:00 AM

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Prisma + SQLite (local, no external secrets required)
- Mock cash checkout + cookie-based admin login

## Quick start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

App runs at [http://127.0.0.1:43127](http://127.0.0.1:43127).

- Storefront: `/`
- Admin: `/admin/login`

### Admin login (mock)

- Email: `admin@almadinah.pk`
- Password: `admin123`

### Demo coupons

- `SHEERMAL10` — 10% off orders over Rs 1,000
- `JOHAR150` — Rs 150 off orders over Rs 1,500

## Features

### Storefront
- Brand-forward home with Google Business photography
- Menu catalog with categories, search, product detail
- Cart + checkout (pickup/delivery, mock cash payment)
- Order confirmation + guest order tracking
- About page with real address, hours, phone, ratings

### Admin
- Dashboard (sales, queue, low stock, day P&L signal)
- Products CRUD, orders status workflow, customers
- Inventory adjustments + move history
- Ledger / day-book (sales, expenses, cash entries)
- Coupons and store settings (delivery/pickup/tax/fees)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port **43127** |
| `npm run build` | Production build |
| `npm run db:seed` | Reseed SQLite with menu + settings |
| `npm run db:reset` | Reset DB + reseed |

## Notes

- Checkout is intentionally local/mock — cash on pickup/delivery; no real payment gateway.
- Product images reuse public photos downloaded from the Google Business listing under `public/images/brand/`.
- SQLite file lives at `prisma/dev.db` (gitignored); seed after migrate.
