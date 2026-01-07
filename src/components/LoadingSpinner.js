import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={32} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}