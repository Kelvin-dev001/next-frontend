"use client";
import React from "react";
import { Box } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

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
  sx = {},
}) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 1, sm: 1.5, md: 2.5 },
          width: "100%",
          px: { xs: 1, sm: 1.5, md: 0 },
          boxSizing: "border-box",
          ...sx,
        }}
      >
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={`skeleton-${idx}`} size={size} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: { xs: 1, sm: 1.5, md: 2.5 },
        width: "100%",
        px: { xs: 1, sm: 1.5, md: 0 },
        boxSizing: "border-box",
        ...sx,
      }}
    >
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
    </Box>
  );
}