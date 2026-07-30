import React from "react";
import ProductGrid from "@/components/ProductGrid";

export default function NewArrivalsSection({ products = [], title = "New Smartphones in Kenya" }) {
  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <h2 className="mb-4 text-center font-bold tracking-wide text-[#1e3c72] text-[1.45rem] md:text-[1.8rem]">
        {title}
      </h2>
      <ProductGrid items={products} eagerCount={6} size="compact" showWhatsApp showViewBtn />
    </section>
  );
}
