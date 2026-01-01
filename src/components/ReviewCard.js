"use client";
import React from "react";
import { Card, CardContent, Typography, Rating, Stack, Box } from "@mui/material";

export default function ReviewCard({ review = {} }) {
  const { name, rating, comment, createdAt, image } = review;
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {name || "Customer"}
          </Typography>
          <Rating value={rating || 0} precision={0.5} readOnly size="small" />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {comment || "No comment provided."}
        </Typography>
        {image && (
          <Box
            component="img"
            src={image}
            alt="Review"
            sx={{
              mt: 1,
              borderRadius: 2,
              maxHeight: 190,
              width: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {createdAt && (
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1 }}>
            {new Date(createdAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}