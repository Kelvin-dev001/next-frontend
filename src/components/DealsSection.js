"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { Api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

const dealTypes = [
  { key: "dealOfTheDay", label: "🔥 Deal of the Day", color: "error" },
  { key: "flashSale", label: "⚡ Flash Sale", color: "warning" },
  { key: "limitedOffer", label: "🎯 Limited Offer", color: "info" },
];

function CountdownTimer({ expiry }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiry));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiry));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  if (!expiry) return null;
  if (timeLeft.expired) return <Chip label="Expired" size="small" color="default" />;

  return (
    <Stack direction="row" spacing={0.8} alignItems="center">
      <Chip label="Ends in:" size="small" variant="outlined" />
      {timeLeft.days > 0 && <TimeBox value={timeLeft.days} label="d" />}
      <TimeBox value={timeLeft.hours} label="h" />
      <TimeBox value={timeLeft.minutes} label="m" />
      <TimeBox value={timeLeft.seconds} label="s" />
    </Stack>
  );
}

function TimeBox({ value, label }) {
  return (
    <Box
      sx={{
        bgcolor: "error.main",
        color: "#fff",
        borderRadius: 1,
        px: 0.8,
        py: 0.3,
        minWidth: 32,
        textAlign: "center",
        fontWeight: 700,
        fontSize: { xs: "0.75rem", md: "0.85rem" },
      }}
    >
      {String(value).padStart(2, "0")}{label}
    </Box>
  );
}

function getTimeLeft(expiry) {
  if (!expiry) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = new Date(expiry) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export default function DealsSection() {
  const [deals, setDeals] = useState({ dealOfTheDay: [], flashSale: [], limitedOffer: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Api.get("/products/deals/active")
      .then((res) => {
        setDeals(res.data?.deals || { dealOfTheDay: [], flashSale: [], limitedOffer: [] });
      })
      .catch(() => setDeals({ dealOfTheDay: [], flashSale: [], limitedOffer: [] }))
      .finally(() => setLoading(false));
  }, []);

  const hasAnyDeals = dealTypes.some(({ key }) => deals[key]?.length > 0);
  if (!loading && !hasAnyDeals) return null;

  return (
    <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: "background.default" }}>
      {dealTypes.map(({ key, label, color }) => {
        const items = deals[key] || [];
        if (!items.length) return null;

        const earliestExpiry = items
          .map((p) => p.dealExpiry)
          .filter(Boolean)
          .sort()[0];

        return (
          <Box key={key} sx={{ mb: { xs: 4, md: 6 }, px: { xs: 0, md: 2 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 2, px: { xs: 1.5, md: 0 } }}
              spacing={1}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.dark", letterSpacing: 0.6, fontSize: { xs: "1.1rem", md: "1.4rem" } }}>
                {label}
              </Typography>
              <CountdownTimer expiry={earliestExpiry} />
            </Stack>

            <ProductGrid
              items={items}
              loading={loading}
              eagerCount={4}
              size="compact"
              showWhatsApp
              showViewBtn
            />
          </Box>
        );
      })}
    </Box>
  );
}