"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import { Api } from "@/lib/api";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Inventory as ProductsIcon,
  Store as StoreIcon,
  Logout as LogoutIcon,
  Category as CategoryIcon,
  BrandingWatermark as BrandIcon,
  LocalOffer as CouponIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import SlideshowIcon from "@mui/icons-material/Slideshow";

const DRAWER_WIDTH = 240;
const POLL_MS = 60 * 1000;

// P10-3: the owner chose the admin portal as the ONLY new-order alert (no email
// or SMS), so the sidebar keeps a live count. Polls once a minute while the tab
// is visible, and immediately when the admin comes back to it.
function useOrderCounts() {
  const [counts, setCounts] = useState({ pending: 0, paymentsToCheck: 0 });
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (document.visibilityState !== "visible") return;
      Api.get("/orders/pending-count")
        .then((res) => { if (!cancelled) setCounts({ pending: res.data?.pending || 0, paymentsToCheck: res.data?.paymentsToCheck || 0 }); })
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => { cancelled = true; clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, []);
  return counts;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const pathname = usePathname();
  const orderCounts = useOrderCounts();

  // The tab title shows waiting orders even when the admin is on another tab.
  useEffect(() => {
    const base = document.title.replace(/^\(\d+\) /, "");
    document.title = orderCounts.pending ? `(${orderCounts.pending}) ${base || "Snaap Admin"}` : base;
  }, [orderCounts.pending, pathname]);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Products", icon: <ProductsIcon />, path: "/admin/products" },
    { text: "Orders", icon: <OrdersIcon />, path: "/admin/orders" },
    { text: "Customers", icon: <CustomersIcon />, path: "/admin/customers" },
    { text: "Coupons", icon: <CouponIcon />, path: "/admin/coupons" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Brands", icon: <BrandIcon />, path: "/admin/brands" },
    { text: "Banners & Pop-ups", icon: <SlideshowIcon />, path: "/admin/hero-slides" },
    { text: "Homepage Sections", icon: <ViewCarouselIcon />, path: "/admin/homepage-sections" },
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
          const isOrders = item.path === "/admin/orders";
          return (
            // ListItem renders the <li>; the link goes inside it (a bare <a> in a
            // <ul> is invalid list markup — axe "list").
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={selected}
                aria-label={isOrders && orderCounts.pending ? `Orders, ${orderCounts.pending} new` : undefined}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.action.selected,
                    "&:hover": { backgroundColor: theme.palette.action.selected },
                  },
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <ListItemIcon sx={{ color: selected ? theme.palette.primary.main : theme.palette.text.secondary }}>
                  {isOrders ? (
                    <Badge badgeContent={orderCounts.pending} color="error" max={99}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  secondary={isOrders && orderCounts.paymentsToCheck ? `${orderCounts.paymentsToCheck} M-Pesa code${orderCounts.paymentsToCheck !== 1 ? "s" : ""} to check` : undefined}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List>
        {secondaryItems.map((item) => {
          const selected = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
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
              </ListItemButton>
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