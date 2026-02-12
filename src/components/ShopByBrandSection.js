"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Card, CardActionArea, Avatar, Container, Chip } from "@mui/material";
import Link from "next/link";
import { Api } from "@/lib/api";

export default function ShopByBrandSection({ brands: brandsProp = [] }) {
  const [brands, setBrands] = useState(brandsProp);
  const shouldFetch = brandsProp.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let active = true;
    Api.get("/brands")
      .then((res) => {
        if (!active) return;
        const arr = res.data?.brands || res.data || [];
        setBrands(arr);
      })
      .catch(() => setBrands([]));
    return () => {
      active = false;
    };
  }, [shouldFetch]);

  const list = useMemo(
    () => (brands && brands.length > 0 ? brands : [{ name: "Coming Soon", logo: "/brand-placeholder.png" }]),
    [brands]
  );

  return (
    <Box component="section" aria-label="Shop by top brands" sx={{ py: { xs: 6, md: 9 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          align="center"
          sx={{ fontWeight: 800, mb: 4, color: "primary.main", letterSpacing: 0.6 }}
        >
          Shop by Top Brands
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {list.map((brand, idx) => (
            <Card
              key={brand._id || idx}
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: "#fff",
                boxShadow: "0 6px 24px rgba(30, 60, 114, 0.08)",
                border: "1px solid rgba(15, 23, 42, 0.05)",
              }}
            >
              <CardActionArea
                component={Link}
                href={`/products?brand=${encodeURIComponent(brand.name || "")}`}
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Avatar
                  src={brand.logo || "/brand-placeholder.png"}
                  alt={`${brand.name} logo`}
                  variant="rounded"
                  sx={{ width: 56, height: 56, bgcolor: "#f8fafc" }}
                />
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: "primary.dark" }}>
                  {brand.name || "Loading"}
                </Typography>
                <Chip
                  label="Shop now"
                  size="small"
                  sx={{
                    bgcolor: "#0f172a",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: 0.3,
                  }}
                />
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}