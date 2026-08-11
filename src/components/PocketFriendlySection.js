import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import RevealGrid from "@/components/ui/RevealGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export const POCKET_FRIENDLY_LIMIT = 40;
export const POCKET_FRIENDLY_MAX_PRICE = 20000;

/**
 * Products come from getStaticProps now (P8). They used to be fetched in a
 * useEffect, which meant none of them existed in the served HTML — a whole
 * homepage section of product links that no crawler ever saw. The client fetch
 * survives only as a fallback for callers that don't pass the prop.
 */
export default function PocketFriendlySection({ products: productsProp = [] }) {
  const [products, setProducts] = useState(productsProp);
  const shouldFetch = productsProp.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let active = true;
    Api.get("/products", {
      params: {
        maxPrice: POCKET_FRIENDLY_MAX_PRICE,
        limit: POCKET_FRIENDLY_LIMIT,
        sort: "price_asc",
      },
    })
      .then((res) => { if (active) setProducts(res.data?.products || []); })
      .catch(() => setProducts([]));
    return () => { active = false; };
  }, [shouldFetch]);

  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <SectionHeading>Pocket Friendly Picks</SectionHeading>
      <RevealGrid
        items={products}
        eagerCount={4}
        size="compact"
        showWhatsApp
        showViewBtn
        viewAllHref={`/products?sort=price-low&maxPrice=${POCKET_FRIENDLY_MAX_PRICE}`}
        viewAllLabel="View all pocket friendly picks"
      />
    </section>
  );
}
