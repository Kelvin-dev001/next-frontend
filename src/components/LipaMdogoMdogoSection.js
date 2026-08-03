import React from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/ProductGrid";
import { getSection } from "@/utils/sections";

// P3e: lists products the admin has explicitly flagged lipaMdogoMdogoEligible.
// Terms vary by device and live in each product's description — no global figure here.
// Rendered only when the admin-managed `lipa_mdogo_mdogo` section is enabled AND at
// least one eligible product exists.
export default function LipaMdogoMdogoSection({ sections = [], products = [] }) {
  const section = getSection(sections, "lipa_mdogo_mdogo");
  if (!section || products.length === 0) return null;

  return (
    <section aria-label="Lipa Mdogo Mdogo" className="py-6 md:py-9">
      <div className="mx-auto max-w-screen-2xl px-4">
        <SectionHeading className="mb-3">{section.title || "Lipa Mdogo Mdogo"}</SectionHeading>
        <p className="mx-auto mb-6 max-w-[720px] text-center text-gray-500">
          {section.subtitle ||
            "Own a phone now and pay in small amounts. Terms vary by device — message us on WhatsApp for the specific phone you want."}
        </p>
        <ProductGrid items={products} eagerCount={4} size="compact" showWhatsApp showViewBtn />
      </div>
    </section>
  );
}
