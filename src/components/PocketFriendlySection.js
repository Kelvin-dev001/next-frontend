"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import { Api } from "@/lib/api";
import ProductCard from "./ProductCard";

const POCKET_FRIENDLY_LIMIT = 10;
const POCKET_FRIENDLY_MAX_PRICE = 20000;

export default function PocketFriendlySection() {
  const [products, setProducts] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    Api.get("/products", {
      params: { maxPrice: POCKET_FRIENDLY_MAX_PRICE, limit: POCKET_FRIENDLY_LIMIT, sort: "price_asc" },
    })
      .then((res) => setProducts(res.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  const sliderSettings = {
    dots: false,
    infinite: products.length > (isTablet ? 2 : 4),
    speed: 600,
    slidesToShow: isMobile ? 2 : isTablet ? 2 : 4,
    slidesToScroll: isMobile ? 2 : isTablet ? 2 : 4,
    arrows: !isMobile,
    autoplay: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.0, fontSize: { xs: "1.45rem", md: "1.8rem" } }}
      >
        Pocket Friendly Picks
      </Typography>

      {isMobile ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5, px: 1.5 }}>
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} badge={product.discountPrice ? "SALE" : undefined} />
          ))}
        </Box>
      ) : (
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <Box key={product._id} sx={{ px: 1.2, outline: "none" }}>
              <ProductCard product={product} badge={product.discountPrice ? "SALE" : undefined} />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
}