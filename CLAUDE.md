# next-frontend — the production storefront

Read the parent `../CLAUDE.md` first for business facts and standing rules.

## Stack

Next.js **16.1.1**, **Pages Router** (`src/pages`), **JavaScript** (`jsconfig.json`, not TypeScript), Tailwind **4** via `@tailwindcss/postcss`, MUI **7.3.6** with `@emotion/cache`, axios, react-slick.

Path alias: `@/*` → `./src/*`

```
npm run dev     # next dev
npm run build   # next build   <- run before every commit
npm start       # next start
npm run lint    # eslint
```

There is **no test script**. Adding one is a P6 item.

Env: `NEXT_PUBLIC_API_URL` (names only — never commit values). See `.env.example`.

## Layout

```
src/
  pages/          index.js, products/index.js, products/[id].js, admin/*, api/product-bot.js
  components/     storefront + components/admin
  constants/      business.js   <- single source of truth, import from here
  lib/api.js      axios client
  hooks/  layouts/  styles/  utils/
```

## Route reality (measured 27 Jul 2026)

| Route | Data fetch | `<Head>` |
|---|---|---|
| `index.js` | `getStaticProps`, `revalidate: 60` | yes |
| `products/index.js` | `getServerSideProps` | yes |
| `products/[id].js` | `getServerSideProps` | yes |
| `admin/*` (9 pages) | none, client-only | no — needs `noindex` |

**Only three storefront routes exist.** `/about`, `/contact`, `/our-story`, `/faqs`, `/returns`, `/shipping`, `/careers` and `/why-us` are linked from the header and footer on every page and **all 404**. The real copy for six of them exists in `../snaap-connections/client/src/pages/` — port it rather than writing placeholder text.

The two `products` routes use `getServerSideProps` where `getStaticProps` + `revalidate` would be cheaper. Revisit in P4.

## Conventions actually used

- MUI `sx` prop for most styling; Tailwind classes appear in a few components (`ContactSection`, `PromoCardsSection`). Two systems coexist — a P4 decision, don't unify unilaterally.
- `"use client"` directives appear at the top of many components. They are **inert** in the Pages Router — leftovers from the abandoned App Router attempt. Harmless, but don't add more.
- Images: `next/image` with Cloudinary (`res.cloudinary.com` is allowlisted in `next.config.mjs`). Cloud name `dltfgasbb`. **Always pass `sizes`** — `/products` currently requests `w=3840` renditions for ~220px cards.
- Prices: use `formatKES` from `@/constants/business`. Never `Intl.NumberFormat` with `style: "currency"` — it produces `Ksh 25,500.00`.

## Gotchas

- `next build` cannot run inside a Linux container against this Windows checkout — the SWC binary is platform-specific. Build on Windows.
- Admin JWT is stored in `localStorage` (`src/lib/api.js`). Known weakness, logged for P6.
- `src/pages/api/product-bot.js` and `components/ProductAdvisorBot.js` run on DeepSeek. **The subscription has expired — decision is to retire both.**
- `PromoCardsSection.js` hardcodes five promo cards. Four advertise phones not in the catalogue. P3 moves them into the `/homepage-sections` API.

## Verify before committing

```powershell
npm run build
git grep -n "wa\.me/"          # should only match constants/business.js
git grep -ni "free delivery"   # should return nothing
```
