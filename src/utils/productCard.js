/**
 * Trims an API product down to the fields ProductCard actually renders.
 *
 * The homepage ships every product it lists twice: once as HTML and again as
 * JSON inside __NEXT_DATA__. Before this, /'s page data was ~268 kB and Next
 * was warning about it — full product documents carry descriptions, spec
 * objects, image arrays and timestamps that no card ever reads.
 *
 * Payload is a business metric here: the audience is overwhelmingly on metered
 * mobile data, so every KB the homepage ships has a KES cost to the customer.
 * Raising the section limits (needed for "See more" to mean anything) is only
 * defensible alongside this.
 */
export function toCardProduct(product) {
  if (!product) return null;
  const images = Array.isArray(product.images) ? product.images : [];
  const card = {
    _id: product._id || product.id || "",
    name: product.name || "",
    price: product.price ?? null,
    thumbnail: product.thumbnail || images[0] || "",
  };

  // Only carry the optional fields when they hold something — an absent key
  // costs nothing in the serialised payload, a null still costs its name.
  if (product.brand) card.brand = product.brand;
  if (product.model) card.model = product.model;
  if (product.discountPrice) card.discountPrice = product.discountPrice;
  if (typeof product.rating === "number" && product.rating > 0) card.rating = product.rating;
  if (product.dealExpiry) card.dealExpiry = product.dealExpiry;

  const storage = product.specs?.storage;
  const ram = product.specs?.ram;
  if (storage || ram) {
    card.specs = {};
    if (storage) card.specs.storage = storage;
    if (ram) card.specs.ram = ram;
  }

  return card;
}

export const toCardProducts = (products = []) =>
  (Array.isArray(products) ? products : []).map(toCardProduct).filter(Boolean);
