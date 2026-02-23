"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import ProductGrid from "@/components/ProductGrid";

export default function FeaturedProductsSection({ products = [] }) {
  if (!products.length) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "primary.main",
          letterSpacing: 1.2,
          fontFamily: "'Montserrat', 'Roboto', sans-serif",
          fontSize: { xs: "1.45rem", md: "1.8rem" },
        }}
      >
        Featured Products
      </Typography>

      <ProductGrid
        items={products}
        eagerCount={6}
        size="compact"
        showWhatsApp
        showViewBtn
      />
    </Box>
  );
}