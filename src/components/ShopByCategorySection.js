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
    <Box component="section" aria-label="Shop by category" sx={{ py: { xs: 5, md: 8 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 800, mb: 3, color: "primary.main", letterSpacing: 0.4, fontSize: { xs: "1.45rem", md: "1.8rem" } }}
        >
          Shop by Category
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {list.map((cat, idx) => (
            <Card
              key={cat._id || idx}
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
                href={`/products?category=${encodeURIComponent(cat.name || "")}`}
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 1.5,
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
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                  />
                </Box>
                <Typography variant="caption" fontWeight={700} sx={{ color: "primary.dark" }}>
                  {cat.name || "Loading"}
                </Typography>
                <Chip
                  label="Explore"
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