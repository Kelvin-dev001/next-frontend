/**
 * Where an admin-authored card actually points.
 *
 * The homepage-section model stores intent (`ctaType`) rather than a URL, so
 * that the server-side validator can check it — a "product" card is resolved
 * against the catalogue and refused if the product is gone. Turning that intent
 * back into an href is this function's job.
 *
 * Shared by the hero sliders and the entry pop-up so the two cannot drift.
 *
 * P10-3: "whatsapp" cards are no longer offered — the owner removed WhatsApp as
 * a buying path (orders go through the cart; WhatsApp is support). Any legacy
 * card still carrying that type falls through to the catalogue rather than
 * opening a chat.
 */
export default function ctaTarget(item, fallback = "/products") {
  if (!item) return { href: fallback, external: false };

  if (item.ctaType === "product" && item.productId) {
    return { href: `/products/${item.productId}`, external: false };
  }
  return { href: item.ctaLink || fallback, external: false };
}
