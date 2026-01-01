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
    Api.getProducts(`?maxPrice=${POCKET_FRIENDLY_MAX_PRICE}&limit=${POCKET_FRIENDLY_LIMIT}&sort=price_asc`)
      .then((res) => setProducts(res.products || []))
      .catch(() => setProducts([]));
  }, []);

  if (!products.length) return null;

  const sliderSettings = {
    dots: false,
    infinite: products.length > (isMobile ? 1 : isTablet ? 2 : 4),
    speed: 600,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 4,
    arrows: !isMobile,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4, color: "primary.main", letterSpacing: 1.2, fontFamily: "'Montserrat', 'Roboto', sans-serif" }}
      >
        Pocket Friendly Picks
      </Typography>
      <Slider {...sliderSettings}>
        {products.map((product) => (
          <Box key={product._id} sx={{ px: 2, outline: "none" }}>
            <ProductCard product={product} badge={product.discountPrice ? "SALE" : undefined} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}