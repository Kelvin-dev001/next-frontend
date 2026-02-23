"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

const POCKET_FRIENDLY_LIMIT = 10;
const POCKET_FRIENDLY_MAX_PRICE = 20000;

export default function PocketFriendlySection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Api.get("/products", {
      params: { maxPrice: POCKET_FRIENDLY_MAX_PRICE, limit: POCKET_FRIENDLY_LIMIT, sort: "price_asc" },
    })
      .then((res) => setProducts(res.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.0, fontSize: { xs: "1.45rem", md: "1.8rem" } }}
      >
        Pocket Friendly Picks
      </Typography>

      <ProductGrid
        items={products.slice(0, 8)}
        eagerCount={4}
        size="compact"
        showWhatsApp
        showViewBtn
      />
    </Box>
  );
}