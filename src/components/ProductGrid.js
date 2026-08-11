import React from "react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

// 2 cols mobile → 3 (md) → 4 (lg). MUI spacing(1)=8px, so gap 1/1.5/2.5 → gap-2/3/5.
const GRID =
  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5 w-full px-2 sm:px-3 md:px-0 box-border";

export default function ProductGrid({
  items = [],
  loading = false,
  skeletonCount = 8,
  eagerCount = 6,
  size = "compact",
  showWhatsApp = true,
  showViewBtn = true,
  onWishlistToggle,
  isWishlisted,
  // RevealGrid needs to tag and measure this container; everything else spreads
  // straight through (e.g. data-pages).
  className = "",
  containerRef,
  ...containerProps
}) {
  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={`skeleton-${idx}`} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${GRID} ${className}`} {...containerProps}>
      {items.map((product, idx) => (
        <ProductCard
          key={product._id || product.id || idx}
          product={product}
          size={size}
          showWhatsApp={showWhatsApp}
          showViewBtn={showViewBtn}
          onWishlistToggle={onWishlistToggle}
          isWishlisted={isWishlisted?.(product)}
          imagePriority={idx < eagerCount}
        />
      ))}
    </div>
  );
}
