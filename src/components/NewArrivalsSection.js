import React from "react";
import RevealGrid from "@/components/ui/RevealGrid";
import SectionHeading from "@/components/ui/SectionHeading";

export default function NewArrivalsSection({ products = [], title = "New Smartphones in Kenya" }) {
  if (!products.length) return null;

  return (
    <section className="py-6 md:py-10">
      <SectionHeading>{title}</SectionHeading>
      {/* Five rows at a time — this section carries 48 products and used to
          drop all of them between the visitor and the next section. */}
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
