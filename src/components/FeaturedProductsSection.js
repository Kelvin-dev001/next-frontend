"use client";
import React from "react";
import Slider from "react-slick";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import ProductCard from "./ProductCard";

const demoProducts = [];

export default function FeaturedProductsSection({ products = demoProducts }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const sliderSettings = {
    dots: false,
    infinite: products.length > (isMobile ? 1 : isTablet ? 2 : 4),
    speed: 600,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 4,
    arrows: !isMobile,
    autoplay: true,
    autoplaySpeed: 5200,
    cssEase: "cubic-bezier(.4,2,.4,1)",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.2, fontFamily: "'Montserrat', 'Roboto', sans-serif" }}
      >
        Featured Products
      </Typography>
      <Slider {...sliderSettings}>
        {products.map((product) => (
          <Box key={product._id} sx={{ px: 2, outline: "none" }}>
            <ProductCard
              product={product}
              badge={product.isFeatured ? "FEATURED" : undefined}
              showWhatsApp
              showViewBtn
              sx={{
                minHeight: 420,
                borderRadius: "22px",
                boxShadow: "0 4px 24px 0 rgba(30,60,114,0.12)",
                transition: "transform 0.28s cubic-bezier(.4,2,.4,1), box-shadow 0.28s",
                bgcolor: "#fff",
                "&:hover": {
                  boxShadow: "0 12px 46px 0 #1e3c72cc",
                  transform: "translateY(-9px) scale(1.03)",
                  zIndex: 3
                }
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}