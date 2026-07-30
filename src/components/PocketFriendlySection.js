import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

const POCKET_FRIENDLY_LIMIT = 10;
const POCKET_FRIENDLY_MAX_PRICE = 20000;

export default function PocketFriendlySection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Api.get("/products", {
      params: { maxPrice: POCKET_FRIENDLY_MAX_PRICE, limit: POCKET_FRIENDLY_LIMIT, sort: "price_asc" },
    })
      .then((res) => setProducts(res.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <h2 className="mb-4 text-center font-bold tracking-wide text-[#1e3c72] text-[1.45rem] md:text-[1.8rem]">
        Pocket Friendly Picks
      </h2>
      <ProductGrid items={products.slice(0, 8)} eagerCount={4} size="compact" showWhatsApp showViewBtn />
    </section>
  );
}
