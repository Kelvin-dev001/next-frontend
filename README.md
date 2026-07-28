# Snaap Connections — storefront (`next-frontend`)

Production storefront for **Snaap Connections**, an online smartphone and
accessories retailer based in Mombasa, Kenya. Deployed to
<https://www.snaapconnections.co.ke> via Vercel. **WhatsApp is the only checkout.**

> Read [`CLAUDE.md`](./CLAUDE.md) in this folder **and** the parent
> [`../CLAUDE.md`](../CLAUDE.md) before changing anything — they hold the business
> facts and standing rules that override framework defaults.

## Stack

- **Next.js 16.1.1** — Pages Router (`src/pages`), **JavaScript** (no TypeScript)
- **Tailwind 4** (`@tailwindcss/postcss`) + **MUI 7** (`@emotion/cache`)
- axios, react-slick
- Path alias `@/*` → `./src/*`

## Scripts

```bash
npm run dev     # next dev
npm run build   # next build — run before every commit
npm start       # next start
npm run lint    # eslint
```

There is no test script yet (tracked for P6).

## Environment

Names only — **never commit values**. See [`.env.example`](./.env.example).

- `NEXT_PUBLIC_API_URL` — base URL of the `snaap-backend` API

## Layout

```
src/
  pages/       index.js, products/, admin/, content pages (contact, faqs, …)
  components/  storefront UI + components/admin
  constants/   business.js — single source of truth for business facts
  lib/api.js   axios client
  hooks/  layouts/  styles/  utils/
```

## Conventions

- Import every business fact (phone, address, hours, delivery, prices) from
  `@/constants/business`. Never hardcode them.
- Money: `formatKES` from `@/constants/business` → `KSh 12,999` (no decimals, ever).
- Every indexable route needs `getStaticProps`/`getServerSideProps` **and** a
  `<Head>` with a unique title, description and canonical.
- Every internal navigation is a real `<a href>` via `next/link` — never
  `router.push()` as the only path.

See [`CLAUDE.md`](./CLAUDE.md) for the full engagement context, route reality, and
gotchas.
