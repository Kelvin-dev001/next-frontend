"use client";
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Inventory as ProductsIcon,
  Store as StoreIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  BrandingWatermark as BrandIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DRAWER_WIDTH = 240;

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const pathname = usePathname();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Orders", icon: <OrdersIcon />, path: "/admin/orders" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Brands", icon: <BrandIcon />, path: "/admin/brands" },
  ];

  const secondaryItems = [
    { text: "Storefront", icon: <StoreIcon />, path: "/" },
    { text: "Logout", icon: <LogoutIcon />, path: "/admin/login" },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: theme.palette.background.paper }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box
          component="span"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            mr: 1,
            fontWeight: 700,
          }}
        >
          Snaap
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Admin
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const selected = pathname === item.path;
          return (
            <ListItem
              key={item.text}
              component={Link}
              href={item.path}
              selected={selected}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  "&:hover": { backgroundColor: theme.palette.action.selected },
                },
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemIcon sx={{ color: selected ? theme.palette.primary.main : theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List>
        {secondaryItems.map((item) => {
          const selected = pathname === item.path;
          return (
            <ListItem
              key={item.text}
              component={Link}
              href={item.path}
              selected={selected}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  "&:hover": { backgroundColor: theme.palette.action.selected },
                },
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemIcon sx={{ color: selected ? theme.palette.primary.main : theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }} aria-label="admin sidebar">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, borderRight: "none" },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, borderRight: "none" },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}