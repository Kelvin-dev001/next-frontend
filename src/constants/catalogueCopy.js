/**
 * Intro copy for category & brand landing pages (P5-5).
 *
 * EMPTY until the owner / Cowork (C5) supplies approved copy. A landing page stays
 * `noindex` while its `intro` is empty, so bare filtered grids never get indexed as
 * duplicates of /products?category= / ?brand=.
 *
 * To PUBLISH a landing page: add an entry keyed by the slug (see slugify) with a
 * genuinely-useful `intro` (2–4 sentences, no invented facts). Optionally set
 * `title` / `description`. Filling `intro` flips the page to index automatically.
 *
 * Example:
 *   export const CATEGORY_COPY = {
 *     smartphones: {
 *       title: "Buy Smartphones in Mombasa & Kenya | Snaap Connections",
 *       description: "…",
 *       intro: "First paragraph.\nSecond paragraph.",
 *     },
 *   };
 */

export const CATEGORY_COPY = {
  // slug: { title?, description?, intro }
};

export const BRAND_COPY = {
  // slug: { title?, description?, intro }
};

export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function getCopy(type, slug) {
  const map = type === "brand" ? BRAND_COPY : CATEGORY_COPY;
  const entry = map[slug];
  return entry && entry.intro ? entry : null;
}
