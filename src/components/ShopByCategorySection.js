"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Card, CardActionArea, Container, Chip } from "@mui/material";
import Link from "next/link";
import { Api } from "@/lib/api";

export default function ShopByCategorySection({ categories: categoriesProp = [] }) {
  const [categories, setCategories] = useState(categoriesProp);
  const shouldFetch = categoriesProp.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let active = true;
    Api.get("/categories")
      .then((res) => {
        if (!active) return;
        const arr = res.data?.categories || res.data || [];
        setCategories(arr);
      })
      .catch(() => setCategories([]));
    return () => {
      active = false;
    };
  }, [shouldFetch]);

  const list = useMemo(
    () => (categories && categories.length > 0 ? categories : [{ name: "Coming Soon", icon: "/category-placeholder.png" }]),
    [categories]
  );

  return (
    <Box component="section" aria-label="Shop by category" sx={{ py: { xs: 6, md: 9 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          align="center"
          sx={{ fontWeight: 800, mb: 4, color: "primary.main", letterSpacing: 0.6 }}
        >
          Shop by Category
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
          {list.map((cat, idx) => (
            <Card
              key={cat._id || idx}
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
                href={`/products?category=${encodeURIComponent(cat.name || "")}`}
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                  }}
                >
                  <img
                    src={cat.icon || "/category-placeholder.png"}
                    alt={`${cat.name} category`}
                    width={56}
                    height={56}
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                  />
                </Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: "primary.dark" }}>
                  {cat.name || "Loading"}
                </Typography>
                <Chip
                  label="Explore"
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