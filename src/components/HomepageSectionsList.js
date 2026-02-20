"use client";
import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import {
  Box, Paper, Typography, Button, List, ListItem, ListItemText,
  IconButton, Stack, Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import HomepageSectionForm from "./HomepageSectionForm";

export default function HomepageSectionsList() {
  const [sections, setSections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchSections = async () => {
    try {
      const res = await Api.get("/homepage-sections");
      setSections(res.data || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to load homepage sections",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleDelete = async (id) => {
    const ok = typeof window === "undefined" ? true : window.confirm("Delete this section?");
    if (!ok) return;
    try {
      await Api.delete(`/homepage-sections/${id}`);
      fetchSections();
      setSnackbar({ open: true, message: "Section deleted", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to delete section",
        severity: "error",
      });
    }
  };

  const handleSave = async (form) => {
    try {
      for (let i = 0; i < form.items.length; i++) {
        const item = form.items[i];
        if (!item._file && !item.image) {
          setSnackbar({ open: true, message: `Card #${i + 1} requires an image.`, severity: "error" });
          return;
        }
      }

      const payload = new FormData();
      payload.append("sectionKey", form.sectionKey);
      payload.append("title", form.title);
      payload.append("subtitle", form.subtitle || "");
      payload.append("enabled", String(form.enabled));
      payload.append("order", String(form.order || 0));

      const items = form.items.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        iconKey: item.iconKey,
        category: item.category,
        search: item.search,
        ctaLabel: item.ctaLabel,
        ctaLink: item.ctaLink,
        image: item.image || "",
      }));

      payload.append("items", JSON.stringify(items));

      form.items.forEach((item, idx) => {
        if (item._file) {
          payload.append(`itemImage_${idx}`, item._file);
        }
      });

      if (editSection?._id) {
        await Api.put(`/homepage-sections/${editSection._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await Api.post("/homepage-sections", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      setEditSection(null);
      fetchSections();
      setSnackbar({ open: true, message: "Section saved!", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to save section",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            Homepage Sections
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditSection(null);
              setShowForm(true);
            }}
          >
            Add Section
          </Button>
        </Stack>

        {showForm && (
          <HomepageSectionForm
            section={editSection}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        <List>
          {sections.map((section) => (
            <ListItem
              key={section._id}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <IconButton edge="end" aria-label="edit" onClick={() => { setEditSection(section); setShowForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(section._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
              sx={{ mb: 1, border: "1px solid #eee", borderRadius: 1, bgcolor: "#fafafa" }}
            >
              <ListItemText
                primary={`${section.title} (${section.sectionKey})`}
                secondary={`Cards: ${section.items?.length || 0} | Enabled: ${section.enabled ? "Yes" : "No"}`}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}