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
import HomepageSectionForm from "./HomepageSectionForm";

export default function HomepageSectionsList() {
  const [sections, setSections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editSection, setEditSection] = useState(null);

  const fetchSections = async () => {
    const res = await Api.get("/homepage-sections");
    setSections(res.data || []);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleDelete = async (id) => {
    const ok = typeof window === "undefined" ? true : window.confirm("Delete this section?");
    if (!ok) return;
    await Api.delete(`/homepage-sections/${id}`);
    fetchSections();
  };

  const handleSave = async (form) => {
    if (editSection?._id) {
      await Api.put(`/homepage-sections/${editSection._id}`, form);
    } else {
      await Api.post("/homepage-sections", form);
    }
    setShowForm(false);
    setEditSection(null);
    fetchSections();
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
    </Box>
  );
}