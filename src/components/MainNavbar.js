"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { Api } from "@/lib/api";

export default function MainNavbar() {
  const [hasData, setHasData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // simple ping to verify API works; ignore errors
    Api.get("/health").then(() => setHasData(true)).catch(() => setHasData(false));
  }, []);

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Snaap Connections
          </Link>
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button color="inherit" component={Link} href="/products">Shop</Button>
          <Button color="inherit" component={Link} href="/contact">Contact</Button>
          <IconButton color="primary" onClick={() => router.push("/products")}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}