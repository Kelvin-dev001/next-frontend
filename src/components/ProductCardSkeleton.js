"use client";
import React from "react";
import { Card, Box, Skeleton, CardContent } from "@mui/material";

export default function ProductCardSkeleton({ size = "compact" }) {
  const isFull = size === "full";
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: isFull ? "22px" : "18px",
        boxShadow: "0 6px 24px rgba(30,60,114,0.08)",
        overflow: "hidden",
        bgcolor: "#fff",
        minHeight: isFull ? { xs: 420, md: 360 } : { xs: 360, md: 350 },
      }}
    >
      <Box sx={{ px: isFull ? 1.8 : 1.2, pt: isFull ? 1.6 : 1.2 }}>
        <Box
          sx={{
            width: "100%",
            aspectRatio: isFull ? "5 / 4" : "4 / 5",
            borderRadius: isFull ? "16px" : "14px",
            overflow: "hidden",
          }}
        >
          <Skeleton variant="rectangular" animation="wave" width="100%" height="100%" />
        </Box>
      </Box>
      <CardContent sx={{ px: isFull ? 2 : 1.2 }}>
        <Skeleton animation="wave" width="40%" height={16} sx={{ mb: 1 }} />
        <Skeleton animation="wave" width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton animation="wave" width="60%" height={16} sx={{ mb: 1 }} />
        <Skeleton animation="wave" width="50%" height={20} />
      </CardContent>
    </Card>
  );
}