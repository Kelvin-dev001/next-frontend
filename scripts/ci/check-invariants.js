#!/usr/bin/env node
/**
 * Snaap invariant gates for CI (P6-A). Pure static checks — no network, no build.
 * Run: node scripts/ci/check-invariants.js   (exit 1 on any violation)
 *
 * Gates:
 *   1. Retired WhatsApp numbers never appear in src/.
 *   2. SSR coverage: every indexable page route has getStaticProps/getServerSideProps
 *      AND a <Head>. (admin/* is client-only + noindex; api/* and the non-HTML
 *      routes sitemap/robots/llms are exempt.)
 *   3. PLACEHOLDER COPY is never on an indexable page (must carry noindex).
 *   4. sitemap.xml and robots.txt exist.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const SRC = path.join(ROOT, "src");
const PAGES = path.join(SRC, "pages");

const failures = [];
const fail = (m) => failures.push(m);
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/");

function walk(dir, filter) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, filter));
    else if (!filter || filter(p)) out.push(p);
  }
  return out;
}

// 1) Retired WhatsApp numbers must not appear anywhere in src/.
const RETIRED = ["722800278", "711111602"];
for (const f of walk(SRC, (p) => /\.(jsx?|tsx?|json|md|css)$/.test(p))) {
  const txt = fs.readFileSync(f, "utf8");
  for (const n of RETIRED) if (txt.includes(n)) fail(`Retired WhatsApp number ${n} found in ${rel(f)}`);
}

// Page routes that must ship HTML (exclude framework, api, admin, non-HTML routes).
const FRAMEWORK = new Set(["_app.js", "_document.js", "_error.js", "404.js", "500.js"]);
const NON_HTML = new Set(["sitemap.xml.js", "robots.txt.js", "llms.txt.js"]);
const segments = (p) => rel(p).split("/");
function htmlPageFiles() {
  return walk(PAGES, (p) => /\.(jsx?)$/.test(p)).filter((p) => {
    const base = path.basename(p);
    if (FRAMEWORK.has(base) || NON_HTML.has(base)) return false;
    const segs = segments(p);
    if (segs.includes("api") || segs.includes("admin")) return false;
    return true;
  });
}

// 2) SSR coverage.
for (const f of htmlPageFiles()) {
  const txt = fs.readFileSync(f, "utf8");
  if (!/getStaticProps|getServerSideProps/.test(txt)) fail(`SSR: ${rel(f)} has no getStaticProps/getServerSideProps`);
  if (!/from ["']next\/head["']|<Head[ >]/.test(txt)) fail(`SSR: ${rel(f)} has no <Head>`);
}

// 3) PLACEHOLDER COPY must be noindex.
for (const f of htmlPageFiles()) {
  const txt = fs.readFileSync(f, "utf8");
  if (txt.includes("PLACEHOLDER COPY") && !/content=["']noindex/.test(txt)) {
    fail(`PLACEHOLDER: ${rel(f)} contains placeholder copy but is not noindex`);
  }
}

// 4) sitemap + robots must exist.
if (!fs.existsSync(path.join(PAGES, "sitemap.xml.js"))) fail("sitemap.xml.js is missing");
if (!fs.existsSync(path.join(PAGES, "robots.txt.js")) && !fs.existsSync(path.join(ROOT, "public", "robots.txt"))) {
  fail("robots.txt is missing (no src/pages/robots.txt.js and no public/robots.txt)");
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} invariant check(s) failed:`);
  for (const m of failures) console.error("  - " + m);
  process.exit(1);
}
console.log("✓ All Snaap invariant checks passed.");
