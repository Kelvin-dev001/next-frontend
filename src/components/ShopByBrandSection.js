"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Card, CardActionArea, Avatar } from "@mui/material";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Api } from "@/lib/api";

const CARD_HEIGHT = 180;
const CARD_WIDTH = 140;
const CARD_ASPECT_RATIO = "7/9";

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

  // Only show placeholder if we truly have no data
  const list = useMemo(
    () => (brands && brands.length > 0 ? brands : [{ name: "Coming Soon", logo: "/brand-placeholder.png" }]),
    [brands]
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <style>{`
        .flip-card { perspective: 900px; min-width: ${CARD_WIDTH}px; max-width: ${CARD_WIDTH}px; flex: 0 0 auto; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.7s cubic-bezier(.4,2,.4,1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner, .flip-card:focus .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 18px; }
        .flip-card-front { background: #fff; color: #222; }
        .flip-card-back { background: #f5f7fa; color: #1e3c72; transform: rotateY(180deg); }
      `}</style>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.2 }}>
        Shop Top Brands
      </Typography>
      <Marquee gradient={false} speed={40} pauseOnHover style={{ paddingBottom: 16 }}>
        <Box sx={{ display: "flex", gap: "18px", px: { xs: 1, md: 3 } }}>
          {list.map((brand, idx) => (
            <Link href={`/products?brand=${encodeURIComponent(brand.name || "")}`} key={brand._id || idx} style={{ textDecoration: "none" }}>
              <Card
                className="flip-card"
                elevation={0}
                sx={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  aspectRatio: CARD_ASPECT_RATIO,
                  borderRadius: "20px",
                  background: "#fff",
                  color: "primary.main",
                  boxShadow: "0 4px 24px 0 rgba(30,60,114,0.08)",
                  transition: "transform 0.35s cubic-bezier(.4,2,.4,1), box-shadow 0.25s",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "visible",
                  border: "none",
                  "&:hover": { boxShadow: "0 10px 32px 0 rgba(30,60,114,0.14)", zIndex: 2 },
                }}
                tabIndex={0}
              >
                <CardActionArea
                  sx={{
                    borderRadius: "20px",
                    minHeight: CARD_HEIGHT,
                    height: CARD_HEIGHT,
                    width: CARD_WIDTH,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                    bgcolor: "transparent",
                    "&:focus-visible": { outline: "none" },
                  }}
                >
                  <Box className="flip-card-inner" sx={{ width: "100%", height: "100%", minHeight: CARD_HEIGHT }}>
                    <Box className="flip-card-front">
                      <Avatar
                        src={brand.logo || "/brand-placeholder.png"}
                        alt={brand.name}
                        variant="square"
                        sx={{ width: 54, height: 54, mb: 1.5, bgcolor: "#fff", objectFit: "contain" }}
                      >
                        {brand.name?.charAt(0) || "?"}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: "primary.dark", letterSpacing: 0.8, fontSize: "1rem", textAlign: "center" }}>
                        {brand.name || "Loading"}
                      </Typography>
                    </Box>
                    <Box className="flip-card-back">
                      <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: "1.10rem", letterSpacing: ".4px", textAlign: "center" }}>
                        {brand.name ? `Shop ${brand.name}` : "Stay tuned"}
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Box>
      </Marquee>
    </Box>
  );
}