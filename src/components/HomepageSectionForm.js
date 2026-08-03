"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, IconButton, Divider,
  FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Avatar,
  Autocomplete, Alert, AlertTitle, Box, Typography, CircularProgress, Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Api } from "@/lib/api";

const iconOptions = [
  { label: "Default", value: "default" },
  { label: "IoT", value: "iot" },
  { label: "M-Pesa", value: "mpesa" },
  { label: "Paybill", value: "paybill" },
  { label: "Fixed Voice", value: "voice" },
  { label: "Bulk SMS", value: "sms" },
];

const typeOptions = [
  { label: "Service tile (Safaricom-style)", value: "service" },
  { label: "Announcement (owns the homepage H1)", value: "announcement" },
  { label: "Offer (promo card)", value: "offer" },
];

const ctaTypeOptions = [
  { label: "None (service tile)", value: "" },
  { label: "Product — deep link to one product", value: "product" },
  { label: "Browse — a filtered listing", value: "browse" },
  { label: "WhatsApp — enquiry / sell-to-order", value: "whatsapp" },
];

const toneOptions = ["", "soft", "light", "cool", "dark", "midnight"];

// Africa/Nairobi is UTC+3 with no DST. The admin types wall-clock Nairobi time in
// a naive datetime-local input; anchor it to +03:00 so the stored instant is right
// regardless of the (UTC) server's timezone.
const NAIROBI_OFFSET = "+03:00";
function nairobiInputToISO(v) {
  if (!v) return null;
  const withSeconds = v.length === 16 ? `${v}:00` : v;
  const d = new Date(`${withSeconds}${NAIROBI_OFFSET}`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
function isoToNairobiInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const nairobi = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return nairobi.toISOString().slice(0, 16);
}
function isPast(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !isNaN(t) && t <= Date.now();
}

function emptyItem() {
  return {
    title: "", subtitle: "", iconKey: "default",
    category: "", search: "", ctaLabel: "View Service", ctaLink: "", image: "",
    type: "service", ctaType: "", productId: null, productName: "",
    badge: "", badgeTone: "", tone: "", alt: "", priority: 0,
    startsAt: null, endsAt: null,
    _file: null, _preview: "",
  };
}

// Async product search for ctaType "product". Selecting a product auto-fills the
// deep link (/products/<id>) — deep links are the whole point of P1.
function ProductPicker({ item, onPick }) {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!input || input.trim().length < 2) return undefined;
    let active = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await Api.get("/products", { params: { search: input.trim(), limit: 20 } });
        if (active) setOptions(res.data?.products || []);
      } catch {
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(t); };
  }, [input]);

  const current = item.productId ? { _id: item.productId, name: item.productName || "(selected product)" } : null;

  return (
    <Autocomplete
      options={options}
      value={current}
      filterOptions={(x) => x}
      getOptionLabel={(o) => (o?.name ? `${o.name}${o.price ? ` — KSh ${Number(o.price).toLocaleString()}` : ""}` : "")}
      isOptionEqualToValue={(o, v) => String(o?._id) === String(v?._id)}
      onInputChange={(_e, v) => setInput(v)}
      onChange={(_e, v) => onPick(v)}
      loading={loading}
      noOptionsText={input.length < 2 ? "Type to search products" : "No products"}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Linked product"
          required
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default function HomepageSectionForm({ section, onSave, onCancel }) {
  const [form, setForm] = useState(
    section
      ? { ...section, startsAt: section.startsAt || null, endsAt: section.endsAt || null,
          items: (section.items || []).map((it) => ({ ...emptyItem(), ...it })) }
      : { sectionKey: "", title: "", subtitle: "", enabled: true, order: 0, startsAt: null, endsAt: null, items: [] }
  );
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateItem = (idx, key, value) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [key]: value };
    updateField("items", items);
  };

  const pickProduct = (idx, product) => {
    const items = [...form.items];
    if (product) {
      items[idx] = { ...items[idx], productId: product._id, productName: product.name, ctaLink: `/products/${product._id}` };
    } else {
      items[idx] = { ...items[idx], productId: null, productName: "", ctaLink: "" };
    }
    updateField("items", items);
  };

  const handleImageChange = (idx, file) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], _file: file, _preview: file ? URL.createObjectURL(file) : "" };
    updateField("items", items);
  };

  const moveItem = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= form.items.length) return;
    const items = [...form.items];
    [items[idx], items[j]] = [items[j], items[idx]];
    updateField("items", items);
  };

  const addItem = () => updateField("items", [...form.items, emptyItem()]);
  const removeItem = (idx) => updateField("items", form.items.filter((_, i) => i !== idx));

  // Item shape the API validates / persists (drops client-only _file/_preview).
  const itemsForApi = () =>
    form.items.map((item) => ({
      title: item.title, subtitle: item.subtitle, iconKey: item.iconKey,
      category: item.category, search: item.search,
      ctaLabel: item.ctaLabel, ctaLink: item.ctaLink, image: item.image || "",
      type: item.type || "service", ctaType: item.ctaType || "",
      productId: item.productId || null,
      badge: item.badge || "", badgeTone: item.badgeTone || "", tone: item.tone || "",
      alt: item.alt || "", priority: Number(item.priority) || 0,
      startsAt: item.startsAt || null, endsAt: item.endsAt || null,
    }));

  const runValidate = async () => {
    setValidating(true);
    try {
      const res = await Api.post("/homepage-sections/validate", {
        enabled: form.enabled, startsAt: form.startsAt, endsAt: form.endsAt, items: itemsForApi(),
      });
      setValidation(res.data);
    } catch (err) {
      setValidation({ ok: false, sectionErrors: [err?.response?.data?.message || "Validation request failed"], items: [] });
    } finally {
      setValidating(false);
    }
  };

  const itemResult = (idx) => (validation?.items || []).find((r) => r.index === idx);

  return (
    <Dialog open onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{section ? "Edit Section" : "Add Section"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField label="Section Key" value={form.sectionKey} onChange={(e) => updateField("sectionKey", e.target.value)} fullWidth required helperText="e.g. promo_cards, safaricom_corner" />
          <TextField label="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} fullWidth required />
          <TextField label="Subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} fullWidth />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Order" type="number" value={form.order} onChange={(e) => updateField("order", Number(e.target.value))} fullWidth />
            <TextField label="Starts at (Nairobi time)" type="datetime-local" value={isoToNairobiInput(form.startsAt)} onChange={(e) => updateField("startsAt", nairobiInputToISO(e.target.value))} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Ends at (Nairobi time)" type="datetime-local" value={isoToNairobiInput(form.endsAt)} onChange={(e) => updateField("endsAt", nairobiInputToISO(e.target.value))} fullWidth InputLabelProps={{ shrink: true }} />
          </Stack>
          <FormControlLabel
            control={<Checkbox checked={form.enabled} onChange={(e) => updateField("enabled", e.target.checked)} />}
            label="Enabled (published)"
          />

          <Divider>Cards</Divider>

          {form.items.map((item, idx) => {
            const preview = item._preview || item.image || "";
            const res = itemResult(idx);
            const isPromo = item.type !== "service" || item.ctaType;
            return (
              <Stack key={idx} spacing={1} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <strong>Card #{idx + 1}</strong>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {res && typeof res.resolvedCount === "number" && (
                      <Chip size="small" color={res.ok ? "success" : "error"} label={`${res.resolvedCount} in stock`} />
                    )}
                    {isPast(item.endsAt) && <Chip size="small" color="warning" label="expired" />}
                    <IconButton size="small" onClick={() => moveItem(idx, -1)} disabled={idx === 0} aria-label="move up"><ArrowUpwardIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => moveItem(idx, 1)} disabled={idx === form.items.length - 1} aria-label="move down"><ArrowDownwardIcon fontSize="small" /></IconButton>
                    <IconButton color="error" onClick={() => removeItem(idx)} aria-label="delete card"><DeleteIcon /></IconButton>
                  </Stack>
                </Stack>

                {res && (res.errors?.length > 0 || res.warnings?.length > 0) && (
                  <Alert severity={res.errors?.length ? "error" : "warning"} sx={{ py: 0.5 }}>
                    {[...(res.errors || []), ...(res.warnings || [])].map((m, i) => <div key={i}>{m}</div>)}
                  </Alert>
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={item.type || "service"} label="Type" onChange={(e) => updateItem(idx, "type", e.target.value)}>
                      {typeOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>CTA type</InputLabel>
                    <Select value={item.ctaType || ""} label="CTA type" onChange={(e) => updateItem(idx, "ctaType", e.target.value)}>
                      {ctaTypeOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>

                <TextField label="Title" value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} fullWidth required />
                <TextField label="Subtitle" value={item.subtitle} onChange={(e) => updateItem(idx, "subtitle", e.target.value)} fullWidth />

                {item.ctaType === "product" ? (
                  <ProductPicker item={item} onPick={(p) => pickProduct(idx, p)} />
                ) : item.ctaType === "" ? (
                  <FormControl fullWidth>
                    <InputLabel>Icon</InputLabel>
                    <Select value={item.iconKey} label="Icon" onChange={(e) => updateItem(idx, "iconKey", e.target.value)}>
                      {iconOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                ) : null}

                {(item.ctaType === "browse" || item.ctaType === "") && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Category" value={item.category} onChange={(e) => updateItem(idx, "category", e.target.value)} fullWidth />
                    <TextField label="Search query" value={item.search} onChange={(e) => updateItem(idx, "search", e.target.value)} fullWidth />
                  </Stack>
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="CTA label" value={item.ctaLabel} onChange={(e) => updateItem(idx, "ctaLabel", e.target.value)} fullWidth />
                  <TextField
                    label="CTA link"
                    value={item.ctaLink}
                    onChange={(e) => updateItem(idx, "ctaLink", e.target.value)}
                    fullWidth
                    disabled={item.ctaType === "product"}
                    helperText={item.ctaType === "product" ? "Set automatically from the linked product" : "e.g. /products?brand=Redmi"}
                  />
                </Stack>

                {isPromo && (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Badge" value={item.badge} onChange={(e) => updateItem(idx, "badge", e.target.value)} fullWidth helperText={item.ctaType === "whatsapp" ? "Use PRE-ORDER / ORDER ON REQUEST" : "e.g. NEW IN STOCK"} />
                    <FormControl fullWidth>
                      <InputLabel>Tone</InputLabel>
                      <Select value={item.tone || ""} label="Tone" onChange={(e) => updateItem(idx, "tone", e.target.value)}>
                        {toneOptions.map((t) => <MenuItem key={t || "default"} value={t}>{t || "default"}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField label="Priority" type="number" value={item.priority} onChange={(e) => updateItem(idx, "priority", Number(e.target.value))} sx={{ minWidth: 110 }} />
                  </Stack>
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Card starts at (Nairobi)" type="datetime-local" value={isoToNairobiInput(item.startsAt)} onChange={(e) => updateItem(idx, "startsAt", nairobiInputToISO(e.target.value))} fullWidth InputLabelProps={{ shrink: true }} />
                  <TextField label="Card ends at (Nairobi)" type="datetime-local" value={isoToNairobiInput(item.endsAt)} onChange={(e) => updateItem(idx, "endsAt", nairobiInputToISO(e.target.value))} fullWidth InputLabelProps={{ shrink: true }} />
                </Stack>

                <TextField label="Image alt text" value={item.alt} onChange={(e) => updateItem(idx, "alt", e.target.value)} fullWidth />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="outlined" component="label">
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)} />
                  </Button>
                  {preview && <Avatar src={preview} sx={{ width: 56, height: 56 }} variant="rounded" />}
                </Stack>
              </Stack>
            );
          })}

          <Button variant="outlined" onClick={addItem}>Add Card</Button>

          {validation && (
            <Alert severity={validation.ok ? "success" : "error"}>
              <AlertTitle>{validation.ok ? "All cards resolve to real stock" : "Fix these before publishing"}</AlertTitle>
              {(validation.sectionErrors || []).map((m, i) => <div key={i}>{m}</div>)}
              {validation.ok && <Typography variant="body2">Safe to enable &amp; save.</Typography>}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">Cancel</Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={runValidate} disabled={validating} startIcon={validating ? <CircularProgress size={16} /> : null}>
          Check stock &amp; schedule
        </Button>
        <Button onClick={() => onSave(form)} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
