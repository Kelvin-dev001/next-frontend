import { waLink } from "@/constants/business";

/**
 * Where an admin-authored card actually points.
 *
 * The homepage-section model stores intent (`ctaType`) rather than a URL, so
 * that the server-side validator can check it — a "product" card is resolved
 * against the catalogue and refused if the product is gone. Turning that intent
 * back into an href is this function's job.
 *
 * Shared by the hero sliders and the entry pop-up so the two cannot drift: a
 * WhatsApp card must open the same chat with the same prefilled message
 * wherever the visitor meets it.
 */
export default function ctaTarget(item, fallback = "/products") {
  if (!item) return { href: fallback, external: false };

  if (item.ctaType === "whatsapp") {
    return {
      href: waLink(`Hello Snaap Connections, I'm interested in: ${item.title || "this offer"}`),
      external: true,
    };
  }
  if (item.ctaType === "product" && item.productId) {
    return { href: `/products/${item.productId}`, external: false };
  }
  return { href: item.ctaLink || fallback, external: false };
}
