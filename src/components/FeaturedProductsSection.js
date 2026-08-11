import React from "react";
import RevealGrid from "@/components/ui/RevealGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedProductsSection({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <SectionHeading>Featured Products</SectionHeading>
      <RevealGrid
        items={products}
        eagerCount={6}
        size="compact"
        showWhatsApp
        showViewBtn
        viewAllHref="/products"
      />
    </section>
  );
}
