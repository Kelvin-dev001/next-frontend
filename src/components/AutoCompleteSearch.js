"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Api } from "@/lib/api";
import {
  Box,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function AutoCompleteSearch({
  onSelect,
  placeholder = "Search products, brands, categories...",
  sx = {},
}) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    Api.get("/products", { params: { limit: 200 } })
      .then((res) => setProducts(res.data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  const results = useMemo(() => {
    if (search.trim().length < 2) return [];
    const term = search.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      )
      .slice(0, 12);
  }, [products, search]);

  const handleSelect = (productId) => {
    setSearch("");
    setAnchorEl(null);
    onSelect?.(productId);
  };

  return (
    <Box sx={{ position: "relative", ...sx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#f4f6fa",
          px: 2,
          py: 1,
          borderRadius: "40px",
          boxShadow: "0 1px 8px #6dd5ed22",
        }}
      >
        <SearchIcon color="primary" />
        <InputBase
          placeholder={placeholder}
          sx={{ ml: 2, flex: 1, fontSize: "1.07rem" }}
          inputProps={{ "aria-label": "search" }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setAnchorEl(e.currentTarget);
          }}
          onFocus={(e) => setAnchorEl(e.currentTarget)}
          onBlur={() => setTimeout(() => setAnchorEl(null), 150)}
        />
      </Box>
      <Popper
        open={Boolean(anchorEl) && results.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <Paper sx={{ mt: 1, maxHeight: 320, overflowY: "auto", width: 350 }}>
          <List>
            {results.map((p) => (
              <ListItem button key={p._id || p.id} onMouseDown={() => handleSelect(p._id || p.id)}>
                <ListItemText primary={p.name} secondary={`${p.brand} | ${p.category}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
}