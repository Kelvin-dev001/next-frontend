import { Api } from "@/lib/api";
import { SITE_URL } from "@/constants/business";

/**
 * Dynamic XML sitemap (P1-2).
 *
 * Lists only indexable, canonical routes: the homepage, the /products listing,
 * every product detail page, and the four approved content pages.
 *
 * Deliberately EXCLUDED:
 *   - /admin/*                         (noindex, auth-gated)
 *   - /returns /our-story /why-us /careers   (unapproved placeholder copy; these
 *     carry `noindex` meta, so listing them here would send a mixed signal)
 *
 * Never 500s: if the product API is unreachable we still serve the static routes.
 */

// Static indexable routes only. See exclusions above.
const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/shipping", changefreq: "monthly", priority: "0.5" },
  { path: "/faqs", changefreq: "monthly", priority: "0.5" },
  { path: "/locations/mombasa", changefreq: "monthly", priority: "0.7" },
  { path: "/locations/kilifi", changefreq: "monthly", priority: "0.6" },
  { path: "/locations/kwale", changefreq: "monthly", priority: "0.6" },
  { path: "/locations/nairobi", changefreq: "monthly", priority: "0.6" },
  { path: "/locations/machakos", changefreq: "monthly", priority: "0.6" },
  // Safaricom Corner hub (P9) — the front door, above its twelve services
  { path: "/safaricom", changefreq: "weekly", priority: "0.7" },
  // Safaricom Corner service pages (P7)
  { path: "/safaricom/mpesa", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/sim", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/airtime-data", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/home-fibre", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/mpesa-business", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/paybill", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/pochi-la-biashara", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/business-app", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/business-connectivity", changefreq: "monthly", priority: "0.6" },
  // The Devices page carries stock, so it changes more often than the copy pages.
  { path: "/safaricom/devices", changefreq: "weekly", priority: "0.7" },
  { path: "/safaricom/bulk-payments", changefreq: "monthly", priority: "0.6" },
  { path: "/safaricom/support", changefreq: "monthly", priority: "0.6" },
];

const xmlEscape = (value = "") =>
  String(value).replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c])
  );

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// Pull the whole catalogue, paging so we never miss products beyond the API's
// default page size. Guard rails cap us at 50 pages / 10k products.
async function fetchAllProducts() {
  const pageSize = 200;
  const all = [];
  let page = 1;
  let total = Infinity;

  while (all.length < total && page <= 50) {
    const res = await Api.get("/products", { params: { limit: pageSize, page } });
    const batch = res.data?.products || [];
    total = res.data?.total ?? res.data?.count ?? batch.length;
    all.push(...batch);
    if (batch.length < pageSize) break;
    page += 1;
  }

  return all;
}

export async function getServerSideProps({ res }) {
  const base = SITE_URL.replace(/\/$/, "");

  const entries = STATIC_ROUTES.map((r) =>
    urlEntry({ loc: `${base}${r.path}`, changefreq: r.changefreq, priority: r.priority })
  );

  try {
    const products = await fetchAllProducts();
    for (const p of products) {
      const id = p?._id || p?.id;
      if (!id) continue;
      const lastmod = p?.updatedAt ? new Date(p.updatedAt).toISOString() : undefined;
      entries.push(
        urlEntry({ loc: `${base}/products/${id}`, lastmod, changefreq: "weekly", priority: "0.8" })
      );
    }
  } catch (e) {
    // Serve a valid sitemap of the static routes even when the API is down.
    console.error("sitemap: product fetch failed —", e?.message);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
