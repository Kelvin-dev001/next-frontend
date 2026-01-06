"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar,
  useTheme, useMediaQuery, Slide, Drawer,
  List, ListItem, ListItemIcon, ListItemText, Divider, Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloseIcon from "@mui/icons-material/Close";
import { SiBrandfolder } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AutoCompleteSearch from "@/components/AutoCompleteSearch";
import { Api } from "@/lib/api";

const menuSections = [
  { label: "All Products", icon: <StorefrontIcon />, link: "/products" },
  { label: "Deals", icon: <LocalOfferIcon />, link: "/products?dealType=deal" },
  { label: "New Arrivals", icon: <StarIcon />, link: "/products?sort=newest" },
  { label: "Best Sellers", icon: <StarIcon />, link: "/products?sort=popular" },
  { label: "Pocket Friendly", icon: <LocalOfferIcon />, link: "/products?sort=price-low&maxPrice=15000" },
];

export default function MainNavbar({ brands: brandsProp = [], categories: categoriesProp = [], onMenuClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brands, setBrands] = useState(brandsProp);
  const [categories, setCategories] = useState(categoriesProp);

  const shouldFetchBrands = brandsProp.length === 0;
  const shouldFetchCategories = categoriesProp.length === 0;

  useEffect(() => {
    if (!shouldFetchBrands) return;
    Api.get("/brands")
      .then((res) => setBrands(res.data?.brands || res.data || []))
      .catch(() => setBrands([]));
  }, [shouldFetchBrands]);

  useEffect(() => {
    if (!shouldFetchCategories) return;
    Api.get("/categories")
      .then((res) => setCategories(res.data?.categories || res.data || []))
      .catch(() => setCategories([]));
  }, [shouldFetchCategories]);

  const handleMenuClick = () => {
    setDrawerOpen(true);
    onMenuClick?.();
  };
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleMenuLinkClick = (link) => {
    setDrawerOpen(false);
    router.push(link);
  };
  const handleSearchSelect = (productId) => {
    setDrawerOpen(false);
    router.push(`/products/${productId}`);
  };
  const getCategoryLink = (cat) => `/products?category=${encodeURIComponent(cat.name)}`;
  const getBrandLink = (brand) => `/products?brand=${encodeURIComponent(brand.name)}`;

  return (
    <Slide appear={false} direction="down" in>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "0 2px 24px 0 rgba(0,0,0,0.06), 0 0.5px 1.5px 0 rgba(0,0,0,0.03)"
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 1 }}>
              <MenuIcon fontSize="large" />
            </IconButton>
          )}
          <Avatar
            src="/snaap-logo.jpeg"
            sx={{ width: 40, height: 40, mr: 2 }}
            alt="Snaap Connections Logo"
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: "1.5px"
            }}
            component={Link}
            href="/"
          >
            Snaap Connections
          </Typography>
          {!isMobile && (
            <Fade in>
              <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
                <Button href="/" variant="text" color="inherit">Home</Button>
                <Button href="/products" variant="text" color="inherit">Shop</Button>
                <Button href="/about" variant="text" color="inherit">About</Button>
                <Button href="/contact" variant="text" color="inherit">Contact</Button>
                <Box sx={{ ml: 2, minWidth: 220 }}>
                  <AutoCompleteSearch
                    onSelect={handleSearchSelect}
                    placeholder="Search products, brands, categories..."
                  />
                </Box>
              </Box>
            </Fade>
          )}
          {isMobile && (
            <IconButton color="primary" size="large" onClick={handleMenuClick}>
              <SearchIcon />
            </IconButton>
          )}
        </Toolbar>
        {/* Hamburger Drawer */}
        <Drawer
          anchor={isMobile ? "right" : "top"}
          open={drawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: isMobile ? "92vw" : "100vw",
              maxWidth: 400,
              bgcolor: "background.default",
              borderRadius: isMobile ? "24px 0 0 24px" : "0 0 24px 24px",
              boxShadow: "0 8px 32px #1e3c7222"
            }
          }}
        >
          <Box sx={{ p: 3, pt: isMobile ? 4 : 3 }}>
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 1,
              mt: isMobile ? 2.5 : 0,
              position: isMobile ? "relative" : "static",
              zIndex: 10
            }}>
              <IconButton
                onClick={handleDrawerClose}
                aria-label="Close menu"
                size="large"
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  borderRadius: 2,
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Menu
            </Typography>
            <AutoCompleteSearch
              onSelect={handleSearchSelect}
              placeholder="Quick search..."
              sx={{ mb: 3 }}
            />
            <Divider sx={{ my: 2 }} />
            <List>
              {menuSections.map(section => (
                <ListItem
                  button
                  key={section.label}
                  onClick={() => handleMenuLinkClick(section.link)}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Categories</Typography>
            <List>
              {(categories.length ? categories : [{ name: "Coming Soon" }]).map(cat => (
                <ListItem
                  button
                  key={cat._id || cat.name}
                  onClick={() => cat.name && handleMenuLinkClick(getCategoryLink(cat))}
                  disabled={!cat.name}
                >
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={cat.name || "Loading"} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Brands</Typography>
            <List>
              {(brands.length ? brands : [{ name: "Coming Soon" }]).map(brand => (
                <ListItem
                  button
                  key={brand._id || brand.name}
                  onClick={() => brand.name && handleMenuLinkClick(getBrandLink(brand))}
                  disabled={!brand.name}
                >
                  <ListItemIcon>
                    <SiBrandfolder />
                  </ListItemIcon>
                  <ListItemText primary={brand.name || "Loading"} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  );
}