import React from "react";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export default function NewArrivalsSection({ products = [], title = "New Smartphones in Kenya" }) {
  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <SectionHeading>{title}</SectionHeading>
      <ProductGrid items={products} eagerCount={6} size="compact" showWhatsApp showViewBtn />
    </section>
  );
}
