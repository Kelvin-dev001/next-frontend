#!/usr/bin/env node
/**
 * Live-data CI gate (P6-E). Hits the PRODUCTION API and fails if the live data has
 * drifted into a bad state — the kind that happens with no code change:
 *   - a published promo card's CTA resolves to nothing (product missing/deleted,
 *     browse filter returns 0, or a whatsapp card claims NEW IN STOCK)
 *   - two published cards point at the same destination
 *   - a brand is duplicated by case/whitespace (the Redmi/REDMI class of split)
 *
 * Runs on a schedule (data rots silently) as well as on PRs. Only GET requests to
 * public endpoints — no secret required.
 *
 * Env: LIVE_API_URL (default https://snaap-connections.onrender.com/api)
 */
const BASE = (process.env.LIVE_API_URL || "https://snaap-connections.onrender.com/api").replace(/\/$/, "");

const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

const NEW_IN_STOCK = /new\s*in\s*stock/i;
const PREORDER = /pre[\s-]?order|order\s*on\s*request/i;
const SUPPORTED = ["brand", "category", "search", "minPrice", "maxPrice", "dealType"];
const now = Date.now();

function active(entity) {
  if (!entity) return false;
  if (entity.startsAt && new Date(entity.startsAt).getTime() > now) return false;
  if (entity.endsAt && new Date(entity.endsAt).getTime() <= now) return false;
  return true;
}

function parseBrowse(ctaLink) {
  const qi = String(ctaLink || "").indexOf("?");
  if (qi === -1) return { params: {}, hadQuery: false, hadSupported: false };
  const usp = new URLSearchParams(ctaLink.slice(qi + 1));
  const params = {};
  let hadSupported = false;
  for (const k of SUPPORTED) {
    const v = usp.get(k);
    if (v && v.trim()) { params[k] = v.trim(); hadSupported = true; }
  }
  return { params, hadQuery: true, hadSupported };
}

async function checkPromoCards() {
  let sections;
  try {
    sections = await getJson("/homepage-sections");
  } catch (e) {
    fail(`homepage-sections unreachable: ${e.message}`);
    return;
  }
  const seen = new Map();
  for (const s of sections || []) {
    if (s.enabled === false || !active(s)) continue;
    for (const it of s.items || []) {
      const ctaType = it.ctaType || "";
      if (!ctaType || !active(it)) continue; // service tiles / scheduled-out cards
      const label = `"${it.title || "card"}" (${s.sectionKey})`;

      if (it.ctaLink) {
        if (seen.has(it.ctaLink)) fail(`Two published cards share ${it.ctaLink}: ${label} and ${seen.get(it.ctaLink)}`);
        else seen.set(it.ctaLink, label);
      }

      if (ctaType === "product") {
        if (!it.productId) { fail(`${label}: product card has no productId`); continue; }
        try {
          const d = await getJson(`/products/${it.productId}`);
          if (!d.product || d.product.isDeleted) fail(`${label}: linked product ${it.productId} is missing/removed`);
        } catch {
          fail(`${label}: linked product ${it.productId} returns 404`);
        }
      } else if (ctaType === "browse") {
        const { params, hadQuery, hadSupported } = parseBrowse(it.ctaLink);
        if (hadQuery && !hadSupported) {
          warnings.push(`${label}: browse link uses an ignored filter (${it.ctaLink}) — lands on the full catalogue`);
          continue;
        }
        const usp = new URLSearchParams(params);
        usp.set("limit", "1");
        try {
          const d = await getJson(`/products?${usp.toString()}`);
          const total = d.total ?? d.count ?? (d.products?.length || 0);
          if (!total) fail(`${label}: browse ${it.ctaLink} returns 0 products`);
        } catch (e) {
          fail(`${label}: browse check failed: ${e.message}`);
        }
      } else if (ctaType === "whatsapp") {
        if (it.badge && NEW_IN_STOCK.test(it.badge) && !PREORDER.test(it.badge)) {
          fail(`${label}: whatsapp card badges "NEW IN STOCK" — use PRE-ORDER / ORDER ON REQUEST`);
        }
      }
    }
  }
}

async function checkBrands() {
  let brands;
  try {
    const d = await getJson("/brands");
    brands = d.brands || d || [];
  } catch (e) {
    fail(`brands unreachable: ${e.message}`);
    return;
  }
  const norm = new Map();
  for (const b of brands) {
    const raw = typeof b === "string" ? b : b?.name || "";
    if (!raw) continue;
    const key = raw.toLowerCase().replace(/\s+/g, " ").trim();
    if (norm.has(key) && norm.get(key) !== raw) {
      fail(`Brand duplicated by case/whitespace: "${raw}" vs "${norm.get(key)}"`);
    } else {
      norm.set(key, raw);
    }
  }
}

(async () => {
  console.log(`Live-data checks against ${BASE}`);
  await checkPromoCards();
  await checkBrands();
  for (const w of warnings) console.warn("  warn:", w);
  if (failures.length) {
    console.error(`\n✗ ${failures.length} live-data check(s) failed:`);
    for (const m of failures) console.error("  - " + m);
    process.exit(1);
  }
  console.log("✓ All live-data checks passed.");
})();
