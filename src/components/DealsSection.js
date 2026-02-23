"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

const DEALS_LIMIT = 8;
const dealTypes = [
  { key: "dealOfTheDay", label: "Deal of the Day" },
  { key: "flashSale", label: "Flash Sale" },
  { key: "limitedOffer", label: "Limited Offer" },
];

export default function DealsSection() {
  const [deals, setDeals] = useState({ dealOfTheDay: [], flashSale: [], limitedOffer: [] });

  useEffect(() => {
    Api.get("/products", { params: { isOnSale: true, limit: 30 } })
      .then((res) => {
        const allDeals = res.data?.products || [];
        setDeals({
          dealOfTheDay: allDeals.filter((p) => p.tags?.includes("deal-of-the-day") || p.dealType === "dealOfTheDay"),
          flashSale: allDeals.filter((p) => p.tags?.includes("flash-sale") || p.dealType === "flashSale"),
          limitedOffer: allDeals.filter((p) => p.tags?.includes("limited-offer") || p.dealType === "limitedOffer"),
        });
      })
      .catch(() => setDeals({ dealOfTheDay: [], flashSale: [], limitedOffer: [] }));
  }, []);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      {dealTypes.map(({ key, label }) =>
        deals[key]?.length ? (
          <Box key={key} sx={{ mb: { xs: 6, md: 8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, px: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.dark", letterSpacing: 0.6 }}>
                {label}
              </Typography>
            </Stack>

            <ProductGrid
              items={deals[key].slice(0, DEALS_LIMIT)}
              eagerCount={4}
              size="compact"
              showWhatsApp
              showViewBtn
            />
          </Box>
        ) : null
      )}
    </Box>
  );
}