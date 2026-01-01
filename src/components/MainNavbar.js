"use client";
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainNavbar() {
  const router = useRouter();
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