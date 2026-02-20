"use client";
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, IconButton, Divider,
  FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const iconOptions = [
  { label: "Default", value: "default" },
  { label: "IoT", value: "iot" },
  { label: "M-Pesa", value: "mpesa" },
  { label: "Paybill", value: "paybill" },
  { label: "Fixed Voice", value: "voice" },
  { label: "Bulk SMS", value: "sms" },
];

export default function HomepageSectionForm({ section, onSave, onCancel }) {
  const [form, setForm] = useState(
    section || {
      sectionKey: "",
      title: "",
      subtitle: "",
      enabled: true,
      order: 0,
      items: [],
    }
  );

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = (idx, key, value) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [key]: value };
    updateField("items", items);
  };

  const addItem = () => {
    updateField("items", [
      ...form.items,
      {
        title: "",
        subtitle: "",
        iconKey: "default",
        category: "",
        search: "",
        ctaLabel: "View Service",
        ctaLink: "",
        image: "",
      },
    ]);
  };

  const removeItem = (idx) => {
    const items = form.items.filter((_, i) => i !== idx);
    updateField("items", items);
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{section ? "Edit Section" : "Add Section"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Section Key" value={form.sectionKey} onChange={(e) => updateField("sectionKey", e.target.value)} fullWidth required />
          <TextField label="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} fullWidth required />
          <TextField label="Subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} fullWidth />
          <TextField label="Order" type="number" value={form.order} onChange={(e) => updateField("order", Number(e.target.value))} fullWidth />
          <FormControlLabel
            control={<Checkbox checked={form.enabled} onChange={(e) => updateField("enabled", e.target.checked)} />}
            label="Enabled"
          />

          <Divider />

          {form.items.map((item, idx) => (
            <Stack key={idx} spacing={1} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <strong>Card #{idx + 1}</strong>
                <IconButton color="error" onClick={() => removeItem(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <TextField label="Title" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} fullWidth required />
              <TextField label="Subtitle" value={item.subtitle} onChange={(e) => updateItem(idx, "subtitle", e.target.value)} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Icon</InputLabel>
                <Select value={item.iconKey} label="Icon" onChange={(e) => updateItem(idx, "iconKey", e.target.value)}>
                  {iconOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Category" value={item.category} onChange={(e) => updateItem(idx, "category", e.target.value)} fullWidth />
              <TextField label="Search Query" value={item.search} onChange={(e) => updateItem(idx, "search", e.target.value)} fullWidth />
              <TextField label="CTA Label" value={item.ctaLabel} onChange={(e) => updateItem(idx, "ctaLabel", e.target.value)} fullWidth />
              <TextField label="CTA Link (optional)" value={item.ctaLink} onChange={(e) => updateItem(idx, "ctaLink", e.target.value)} fullWidth />
              <TextField label="Image URL (optional)" value={item.image} onChange={(e) => updateItem(idx, "image", e.target.value)} fullWidth />
            </Stack>
          ))}

          <Button variant="outlined" onClick={addItem}>Add Card</Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">Cancel</Button>
        <Button onClick={() => onSave(form)} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}