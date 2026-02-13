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
    <Box component="section" aria-label="Shop by top brands" sx={{ py: { xs: 5, md: 8 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 800, mb: 3, color: "primary.main", letterSpacing: 0.4, fontSize: { xs: "1.45rem", md: "1.8rem" } }}
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
            gap: { xs: 1.6, md: 2 },
          }}
        >
          {list.map((brand, idx) => (
            <Card
              key={brand._id || idx}
              elevation={0}
              sx={{
                borderRadius: 2.5,
                bgcolor: "#fff",
                boxShadow: "0 5px 18px rgba(30, 60, 114, 0.08)",
                border: "1px solid rgba(15, 23, 42, 0.05)",
              }}
            >
              <CardActionArea
                component={Link}
                href={`/products?brand=${encodeURIComponent(brand.name || "")}`}
                sx={{
                  p: 1.6,
                  textAlign: "center",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Avatar
                  src={brand.logo || "/brand-placeholder.png"}
                  alt={`${brand.name} logo`}
                  variant="rounded"
                  sx={{ width: 46, height: 46, bgcolor: "#f8fafc" }}
                />
                <Typography variant="caption" fontWeight={700} sx={{ color: "primary.dark" }}>
                  {brand.name || "Loading"}
                </Typography>
                <Chip
                  label="Shop now"
                  size="small"
                  sx={{
                    bgcolor: "#1e3c72",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    fontSize: "0.68rem",
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