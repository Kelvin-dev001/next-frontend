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

  const visibleProducts = isMobile
    ? products.slice(0, 6)
    : isTablet
    ? products.slice(0, 12)
    : products;

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
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "primary.main",
          letterSpacing: 1.2,
          fontFamily: "'Montserrat', 'Roboto', sans-serif",
          fontSize: { xs: "1.45rem", md: "1.8rem" },
        }}
      >
        Featured Products
      </Typography>

      {isMobile ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5, px: 1.5 }}>
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} badge={product.isFeatured ? "FEATURED" : undefined} size="compact" />
          ))}
        </Box>
      ) : (
        <Slider {...sliderSettings}>
          {visibleProducts.map((product) => (
            <Box key={product._id} sx={{ px: 1.2, outline: "none" }}>
              <ProductCard
                product={product}
                badge={product.isFeatured ? "FEATURED" : undefined}
                size="compact"
                sx={{
                  minHeight: 380,
                  borderRadius: "20px",
                  boxShadow: "0 4px 22px 0 rgba(30,60,114,0.1)",
                  transition: "transform 0.25s cubic-bezier(.4,2,.4,1), box-shadow 0.25s",
                  bgcolor: "#fff",
                  "&:hover": {
                    boxShadow: "0 12px 40px 0 #1e3c72cc",
                    transform: "translateY(-8px) scale(1.02)",
                    zIndex: 3,
                  },
                }}
              />
            </Box>
          ))}
        </Slider>
      )}
    </Box>
  );
}