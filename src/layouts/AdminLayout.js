"use client";
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { DRAWER_WIDTH } from "@/constants/layout";

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminHeader onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "64px", // match header height
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;