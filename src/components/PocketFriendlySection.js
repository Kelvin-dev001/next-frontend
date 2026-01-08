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
    slidesToShow: isTablet ? 2 : 4,
    slidesToScroll: isTablet ? 2 : 4,
    arrows: true,
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
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.2 }}
      >
        Pocket Friendly Picks
      </Typography>

      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            overflowX: "auto",
            px: 1.5,
            py: 1,
            scrollSnapType: "x mandatory",
            "& > *": { scrollSnapAlign: "start" },
          }}
        >
          {products.slice(0, 8).map((product) => (
            <Box key={product._id} sx={{ minWidth: 240 }}>
              <ProductCard product={product} badge={product.discountPrice ? "SALE" : undefined} />
            </Box>
          ))}
        </Box>
      ) : (
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <Box key={product._id} sx={{ px: 1.5, outline: "none" }}>
              <ProductCard product={product} badge={product.discountPrice ? "SALE" : undefined} />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
}