"use client";
import React, { Suspense } from "react";
import { Box } from "@mui/material";
import Header from "@/components/Header";
const Footer = React.lazy(() => import("@/components/Footer"));

const AppLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header />
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        {children}
      </Box>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </Box>
  );
};

export default AppLayout;