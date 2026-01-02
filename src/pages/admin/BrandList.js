"use client";
import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import {
  Box, Paper, Typography, Button, List, ListItem, ListItemText,
  IconButton, Stack
} from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BrandForm from "./BrandForm";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const fetchBrands = async () => {
    const res = await Api.get("/brands");
    setBrands(res.data?.brands || res.data || []);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    const ok = typeof window === "undefined" ? true : window.confirm("Delete this brand?");
    if (!ok) return;
    await Api.delete(`/brands/${id}`);
    fetchBrands();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Brands
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditBrand(null);
              setShowForm(true);
            }}
          >
            Add Brand
          </Button>
        </Stack>
        {showForm && (
          <BrandForm
            brand={editBrand}
            onSuccess={() => {
              fetchBrands();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        <List>
          {brands.map((brand) => (
            <ListItem
              key={brand._id || brand.name}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton edge="end" aria-label="edit" onClick={() => { setEditBrand(brand); setShowForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(brand._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
              sx={{ mb: 1, border: "1px solid #eee", borderRadius: 1, bgcolor: "#fafafa" }}
            >
              <ListItemText primary={brand.name} secondary={brand.description} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}