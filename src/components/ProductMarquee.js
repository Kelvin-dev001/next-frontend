import React from "react";
import Marquee from "@/components/ui/Marquee";
import ProductCard from "@/components/ProductCard";

/**
 * A looping rail of product cards. Used by the deals sections, where a full
 * grid of three deal types buried the rest of the homepage.
 *
 * Deliberately slower than the brand/category rails: these cards are tap
 * targets with a price to read, not logos to glance at. The rail also stops
 * the moment a pointer or focus enters it (handled inside Marquee), so a card
 * is never moving at the instant it gets tapped.
 */
export default function ProductMarquee({ products = [], direction = "left", speed = 26, paused = false }) {
  if (!products.length) return null;

  return (
    <Marquee
      items={products}
      direction={direction}
      speed={speed}
      paused={paused}
      gap="0.75rem"
      className="py-2"
      renderItem={(product) => (
        <div className="h-full w-[46vw] max-w-[240px] sm:w-[210px] md:w-[230px]">
          <ProductCard
            product={product}
            imageSizes="(max-width: 640px) 46vw, 230px"
            showWhatsApp
            showViewBtn
          />
        </div>
      )}
    />
  );
}
