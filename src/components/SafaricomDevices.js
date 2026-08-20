import React from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductMarquee from "@/components/ProductMarquee";

/**
 * The Safaricom device shop's shelves — smartphones, routers, MiFi.
 *
 * Two placements, one component:
 *   variant="rail"  /safaricom, where the devices are a taste of what's behind
 *                   the Devices page and the services still need room
 *   variant="grid"  /safaricom/devices, which IS the shop — every device
 *                   visible at once, nothing hidden behind a swipe
 *
 * Both render ProductCard, so "Buy on WhatsApp" on a Safaricom router is the
 * same button, the same number and the same message as everywhere else on the
 * site. There is no second checkout to build.
 *
 * Empty shelves never reach this component (see utils/safaricomDevices.js).
 */
export default function SafaricomDevices({ shelves = [], variant = "grid" }) {
  if (!shelves.length) return null;

  return (
    <>
      {shelves.map((shelf) => (
        <section key={shelf.type} className="mb-8" aria-label={shelf.title}>
          <h2 className="mb-1 text-[1.2rem] font-bold text-saf-700 md:text-[1.35rem]">
            {shelf.title}
          </h2>
          {shelf.blurb && <p className="mb-3 max-w-[760px] text-[0.92rem] text-gray-600">{shelf.blurb}</p>}

          {variant === "rail" ? (
            <ProductMarquee products={shelf.products} />
          ) : (
            <ProductGrid items={shelf.products} eagerCount={4} />
          )}
        </section>
      ))}
    </>
  );
}
