"use client";
import React from "react";
import Slider from "react-slick";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import ProductCard from "./ProductCard";

export default function NewArrivalsSection({ products = [], title = "New Smartphones in Kenya" }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const visibleProducts = isMobile ? products.slice(0, 8) : products;

  const sliderSettings = {
    dots: false,
    infinite: visibleProducts.length > (isTablet ? 2 : 4),
    speed: 600,
    slidesToShow: isMobile ? 2 : isTablet ? 2 : 4,
    slidesToScroll: isMobile ? 2 : isTablet ? 2 : 4,
    arrows: !isMobile,
    autoplay: false,
    cssEase: "cubic-bezier(.4,2,.4,1)",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.0, fontFamily: "'Montserrat', 'Roboto', sans-serif", fontSize: { xs: "1.45rem", md: "1.8rem" } }}
      >
        {title}
      </Typography>

      {isMobile ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5, px: 1.5 }}>
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} badge={product.badge} size="compact" />
          ))}
        </Box>
      ) : (
        <Slider {...sliderSettings}>
          {visibleProducts.map((product) => (
            <Box key={product._id} sx={{ px: 1.2, outline: "none" }}>
              <ProductCard product={product} badge={product.badge} size="compact" />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
}