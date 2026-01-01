"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, useTheme, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import { Api } from "@/lib/api";
import ProductCard from "./ProductCard";

const DEALS_LIMIT = 8;
const dealTypes = [
  { key: "dealOfTheDay", label: "Deal of the Day" },
  { key: "flashSale", label: "Flash Sale" },
  { key: "limitedOffer", label: "Limited Offer" },
];

export default function DealsSection() {
  const [deals, setDeals] = useState({ dealOfTheDay: [], flashSale: [], limitedOffer: [] });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    Api.get("/products", { params: { isOnSale: true, limit: 30 } })
      .then((res) => {
        const allDeals = res.data?.products || [];
        setDeals({
          dealOfTheDay: allDeals.filter((p) => p.tags?.includes("deal-of-the-day") || p.dealType === "dealOfTheDay"),
          flashSale: allDeals.filter((p) => p.tags?.includes("flash-sale") || p.dealType === "flashSale"),
          limitedOffer: allDeals.filter((p) => p.tags?.includes("limited-offer") || p.dealType === "limitedOffer"),
        });
      })
      .catch(() => setDeals({ dealOfTheDay: [], flashSale: [], limitedOffer: [] }));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 4,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 4,
    arrows: !isMobile,
    autoplay: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      {dealTypes.map(({ key, label }) =>
        deals[key]?.length ? (
          <Box key={key} sx={{ mb: { xs: 6, md: 8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, px: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.dark", letterSpacing: 1 }}>
                {label}
              </Typography>
            </Stack>
            <Slider {...sliderSettings}>
              {deals[key].slice(0, DEALS_LIMIT).map((product) => (
                <Box key={product._id} sx={{ px: 2, outline: "none" }}>
                  <ProductCard product={product} badge="SALE" />
                </Box>
              ))}
            </Slider>
          </Box>
        ) : null
      )}
    </Box>
  );
}