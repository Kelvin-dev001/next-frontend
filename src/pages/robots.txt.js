import { SITE_URL } from "@/constants/business";

/**
 * Dynamic robots.txt (P1-3).
 *
 * - Public storefront is crawlable; /admin is not.
 * - AI answer engines / search assistants are allowed to read the storefront
 *   (they can send real buyers here).
 * - AI model-training crawlers are blocked (Google-Extended is training-only and
 *   does NOT affect Googlebot search indexing).
 * - The unapproved placeholder pages are intentionally NOT disallowed here; they
 *   carry `noindex` meta and must stay crawlable for that signal to be honoured.
 */
export async function getServerSideProps({ res }) {
  const base = SITE_URL.replace(/\/$/, "");

  const body = `# robots.txt — Snaap Connections

# Default: crawl the storefront, stay out of admin.
User-agent: *
Allow: /
Disallow: /admin

# AI answer engines / search assistants — allowed (they refer real buyers).
User-agent: PerplexityBot
Allow: /
Disallow: /admin

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin

User-agent: ClaudeBot
Allow: /
Disallow: /admin

# AI model-training crawlers — not permitted.
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${base}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Robots() {
  return null;
}
