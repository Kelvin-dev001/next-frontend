"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Card, CardContent, Divider, FormControlLabel,
  IconButton, MenuItem, Paper, Snackbar, Stack, Switch, Tab, Tabs, TextField,
  Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SaveIcon from "@mui/icons-material/Save";
import { Api } from "@/lib/api";

/**
 * Hero slide manager for the two homepage banner carousels.
 *
 * These are stored as ordinary HomepageSections under fixed sectionKeys, so
 * they inherit the existing multipart upload path, the scheduling fields and
 * the server-side validator that already refuses a card pointing at a deleted
 * product or an empty filter. Nothing new was added to the API for this.
 *
 * The section is created on first save — the owner never has to know a
 * "sectionKey" exists.
 */
const MAX_SLIDES = 5;

const PLACEMENTS = [
  {
    sectionKey: "hero_slider_top",
    label: "Top of homepage",
    title: "Homepage Hero",
    hint: "Shows at the very top of the homepage, above everything else.",
  },
  {
    sectionKey: "hero_slider_mid",
    label: "Lower homepage",
    title: "Homepage Lower Banners",
    hint: "Shows near the bottom, in place of the old \"Chat with us on WhatsApp\" block. That block stays visible until you add at least one slide here.",
  },
];

const LINK_KINDS = [
  { value: "product", label: "A specific product" },
  { value: "category", label: "A category listing" },
  { value: "brand", label: "A brand listing" },
  { value: "custom", label: "A custom link" },
  { value: "whatsapp", label: "A WhatsApp enquiry" },
];

// The two artworks each slide carries. Phones are served `imageMobile` and
// desktops `image` — they are different pictures, not two sizes of one, so the
// shop designs both. See next-frontend/src/components/HeroSlider.js.
const ARTWORKS = [
  {
    key: "image",
    fileKey: "_file",
    previewKey: "_preview",
    label: "Wide banner (desktop & tablet)",
    spec: "2560 × 840 px",
    ratio: "64 / 21",
    field: "itemImage",
  },
  {
    key: "imageMobile",
    fileKey: "_fileMobile",
    previewKey: "_previewMobile",
    label: "Phone banner (portrait)",
    spec: "1280 × 960 px",
    ratio: "4 / 3",
    field: "itemImageMobile",
  },
];

const emptySlide = () => ({
  _key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  subtitle: "",
  ctaLabel: "Shop now",
  alt: "",
  image: "",
  imageMobile: "",
  linkKind: "category",
  productId: null,
  productLabel: "",
  categoryName: "",
  brandName: "",
  customLink: "",
  _file: null,
  _preview: "",
  _fileMobile: null,
  _previewMobile: "",
});

// Rebuild the editor's link fields from what the API stored. ctaType alone
// doesn't distinguish a category link from a brand link, so the query string
// is what tells them apart.
function slideFromApi(item, index) {
  const link = String(item.ctaLink || "");
  const params = new URLSearchParams(link.includes("?") ? link.slice(link.indexOf("?") + 1) : "");
  let linkKind = "custom";
  if (item.ctaType === "product") linkKind = "product";
  else if (item.ctaType === "whatsapp") linkKind = "whatsapp";
  else if (params.get("category")) linkKind = "category";
  else if (params.get("brand")) linkKind = "brand";

  return {
    _key: item._id || `existing-${index}`,
    title: item.title || "",
    subtitle: item.subtitle || "",
    ctaLabel: item.ctaLabel || "Shop now",
    alt: item.alt || "",
    image: item.image || "",
    imageMobile: item.imageMobile || "",
    linkKind,
    productId: item.productId ? String(item.productId) : null,
    productLabel: item.productId ? `Product ${String(item.productId).slice(-6)}` : "",
    categoryName: params.get("category") || "",
    brandName: params.get("brand") || "",
    customLink: linkKind === "custom" ? link : "",
    _file: null,
    _preview: "",
    _fileMobile: null,
    _previewMobile: "",
  };
}

// The editor's five link kinds collapse back onto the three ctaTypes the
// model and the validator understand.
function slideToApi(slide) {
  const base = {
    title: slide.title,
    subtitle: slide.subtitle,
    ctaLabel: slide.ctaLabel,
    alt: slide.alt || slide.title,
    image: slide.image || "",
    imageMobile: slide.imageMobile || "",
    type: "offer",
    iconKey: "default",
    category: "",
    search: "",
    badge: "",
    badgeTone: "",
    tone: "",
    priority: 0,
    startsAt: null,
    endsAt: null,
  };

  switch (slide.linkKind) {
    case "product":
      return { ...base, ctaType: "product", productId: slide.productId || null, ctaLink: "" };
    case "category":
      return {
        ...base,
        ctaType: "browse",
        productId: null,
        ctaLink: `/products?category=${encodeURIComponent(slide.categoryName || "")}`,
      };
    case "brand":
      return {
        ...base,
        ctaType: "browse",
        productId: null,
        ctaLink: `/products?brand=${encodeURIComponent(slide.brandName || "")}`,
      };
    case "whatsapp":
      return { ...base, ctaType: "whatsapp", productId: null, ctaLink: "" };
    default:
      return { ...base, ctaType: "browse", productId: null, ctaLink: slide.customLink || "" };
  }
}

export default function HeroSlidesManager() {
  const [tab, setTab] = useState(0);
  const [sections, setSections] = useState([]);
  const [slides, setSlides] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productQuery, setProductQuery] = useState("");

  const placement = PLACEMENTS[tab];
  const section = useMemo(
    () => sections.find((s) => s.sectionKey === placement.sectionKey) || null,
    [sections, placement.sectionKey]
  );

  const notify = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const loadSections = useCallback(async () => {
    try {
      const res = await Api.get("/homepage-sections");
      setSections(res.data || []);
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to load hero slides", "error");
    }
  }, []);

  useEffect(() => {
    loadSections();
    Api.get("/categories")
      .then((res) => setCategories(res.data?.categories || res.data || []))
      .catch(() => setCategories([]));
    Api.get("/brands")
      .then((res) => setBrands(res.data?.brands || res.data || []))
      .catch(() => setBrands([]));
  }, [loadSections]);

  // Re-seed the editor whenever the placement or the loaded data changes.
  useEffect(() => {
    setSlides((section?.items || []).map(slideFromApi));
    setEnabled(section ? section.enabled !== false : true);
  }, [section]);

  // Product picker search.
  useEffect(() => {
    if (!productQuery || productQuery.length < 2) return;
    const timer = setTimeout(() => {
      Api.get("/products", { params: { search: productQuery, limit: 15 } })
        .then((res) => setProductOptions(res.data?.products || []))
        .catch(() => setProductOptions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [productQuery]);

  const patchSlide = (index, patch) =>
    setSlides((current) => current.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));

  const moveSlide = (index, delta) =>
    setSlides((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleImage = (index, artwork, file) => {
    if (!file) return;
    patchSlide(index, {
      [artwork.fileKey]: file,
      [artwork.previewKey]: URL.createObjectURL(file),
    });
  };

  const validateLocally = () => {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const label = slide.title ? `"${slide.title}"` : `Slide ${i + 1}`;
      // Both artworks are required. Mobile is optional in the model so older
      // sections keep validating, but a hero slide without phone artwork means
      // the whole carousel silently falls back to a 16:9 crop of the wide
      // banner — which is the exact problem this field exists to remove.
      for (const artwork of ARTWORKS) {
        if (!slide[artwork.fileKey] && !slide[artwork.key]) {
          return `${label} needs a ${artwork.label.toLowerCase()} (${artwork.spec}).`;
        }
      }
      if (slide.linkKind === "product" && !slide.productId) return `${label}: pick a product to link to.`;
      if (slide.linkKind === "category" && !slide.categoryName) return `${label}: pick a category.`;
      if (slide.linkKind === "brand" && !slide.brandName) return `${label}: pick a brand.`;
      if (slide.linkKind === "custom") {
        const link = slide.customLink || "";
        if (!/^\/|^https?:\/\//i.test(link)) {
          return `${label}: the custom link must start with "/" or "https://".`;
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const problem = validateLocally();
    if (problem) return notify(problem, "error");

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("sectionKey", placement.sectionKey);
      payload.append("title", placement.title);
      payload.append("subtitle", "");
      payload.append("enabled", String(enabled));
      payload.append("order", "0");
      payload.append("startsAt", "");
      payload.append("endsAt", "");
      payload.append("items", JSON.stringify(slides.map(slideToApi)));
      slides.forEach((slide, index) => {
        ARTWORKS.forEach((artwork) => {
          const file = slide[artwork.fileKey];
          if (file) payload.append(`${artwork.field}_${index}`, file);
        });
      });

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (section?._id) {
        await Api.put(`/homepage-sections/${section._id}`, payload, config);
      } else {
        await Api.post("/homepage-sections", payload, config);
      }

      await loadSections();
      notify("Hero slides saved. The homepage refreshes within a minute.");
    } catch (err) {
      const v = err?.response?.data?.validation;
      let message = err?.response?.data?.message || "Failed to save hero slides";
      if (v) {
        const errors = [...(v.sectionErrors || []), ...(v.items || []).flatMap((it) => it.errors || [])];
        if (errors.length) message = errors.join(" ");
      }
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const atCapacity = slides.length >= MAX_SLIDES;

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Hero Slides
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Up to {MAX_SLIDES} sliding banners per placement. Each slide takes{" "}
          <strong>two artworks</strong>: a wide one for desktop
          (2560&nbsp;&times;&nbsp;840&nbsp;px) and a separate portrait one for phones
          (1280&nbsp;&times;&nbsp;960&nbsp;px). Neither is cropped — the phone is shown the
          phone artwork, so design each to its own shape.
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          If you fill in the headline, supporting line or button text below, they are drawn{" "}
          <strong>over the left of the picture</strong> with a dark fade behind them — so keep
          that side clear and put your subject on the right. Leave all three blank and the
          artwork shows on its own with nothing over it. Either way, never draw words into the
          picture itself: they can&apos;t be read by Google or by a screen reader.
        </Alert>

        <Tabs value={tab} onChange={(_, next) => setTab(next)} sx={{ mb: 1 }}>
          {PLACEMENTS.map((p) => (
            <Tab key={p.sectionKey} label={p.label} />
          ))}
        </Tabs>
        <Alert severity="info" sx={{ mb: 2 }}>
          {placement.hint}
        </Alert>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label={enabled ? "Showing on the site" : "Hidden from the site"}
          />
          <Stack direction="row" spacing={1}>
            <Tooltip title={atCapacity ? `Maximum ${MAX_SLIDES} slides` : ""}>
              <span>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={atCapacity}
                  onClick={() => setSlides((current) => [...current, emptySlide()])}
                >
                  Add slide
                </Button>
              </span>
            </Tooltip>
            <Button variant="contained" startIcon={<SaveIcon />} disabled={saving} onClick={handleSave}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </Stack>
        </Stack>

        {slides.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No slides yet. Add one to start the carousel.
          </Typography>
        )}

        <Stack spacing={2}>
          {slides.map((slide, index) => (
            <Card key={slide._key} variant="outlined">
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography fontWeight={700}>Slide {index + 1}</Typography>
                  <Stack direction="row">
                    <IconButton aria-label="Move up" disabled={index === 0} onClick={() => moveSlide(index, -1)}>
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Move down"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(index, 1)}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete slide"
                      color="error"
                      onClick={() => setSlides((current) => current.filter((_, i) => i !== index))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Stack spacing={2} sx={{ width: { xs: "100%", md: 260 }, flexShrink: 0 }}>
                    {ARTWORKS.map((artwork) => {
                      const preview = slide[artwork.previewKey] || slide[artwork.key];
                      return (
                        <Stack key={artwork.key} spacing={0.5}>
                          <Typography variant="caption" fontWeight={700}>
                            {artwork.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {artwork.spec}
                          </Typography>
                          {/* The preview box matches the real frame on the
                              storefront, so a badly cropped banner is obvious
                              here rather than after publishing. */}
                          <Box
                            sx={{
                              width: "100%",
                              aspectRatio: artwork.ratio,
                              borderRadius: 1,
                              border: "1px dashed",
                              borderColor: preview ? "divider" : "warning.main",
                              backgroundColor: "grey.100",
                              backgroundImage: preview ? `url(${preview})` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <Button variant="outlined" component="label" size="small">
                            {preview ? "Replace" : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => handleImage(index, artwork, e.target.files?.[0])}
                            />
                          </Button>
                        </Stack>
                      );
                    })}
                  </Stack>

                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField
                      label="Headline"
                      value={slide.title}
                      onChange={(e) => patchSlide(index, { title: e.target.value })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Supporting line"
                      value={slide.subtitle}
                      onChange={(e) => patchSlide(index, { subtitle: e.target.value })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Button text"
                      value={slide.ctaLabel}
                      onChange={(e) => patchSlide(index, { ctaLabel: e.target.value })}
                      fullWidth
                      size="small"
                    />

                    <Divider textAlign="left">
                      <Typography variant="caption" color="text.secondary">
                        Where it goes
                      </Typography>
                    </Divider>

                    <TextField
                      select
                      label="This slide links to"
                      value={slide.linkKind}
                      onChange={(e) => patchSlide(index, { linkKind: e.target.value })}
                      fullWidth
                      size="small"
                    >
                      {LINK_KINDS.map((kind) => (
                        <MenuItem key={kind.value} value={kind.value}>
                          {kind.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    {slide.linkKind === "product" && (
                      <Autocomplete
                        size="small"
                        options={productOptions}
                        getOptionLabel={(option) => option?.name || ""}
                        filterOptions={(x) => x}
                        onInputChange={(_, value) => setProductQuery(value)}
                        onChange={(_, value) =>
                          patchSlide(index, {
                            productId: value?._id || null,
                            productLabel: value?.name || "",
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search for the product"
                            helperText={
                              slide.productId ? `Linked to: ${slide.productLabel || slide.productId}` : "Type at least 2 letters"
                            }
                          />
                        )}
                      />
                    )}

                    {slide.linkKind === "category" && (
                      <TextField
                        select
                        label="Category"
                        value={slide.categoryName}
                        onChange={(e) => patchSlide(index, { categoryName: e.target.value })}
                        fullWidth
                        size="small"
                      >
                        {categories.map((c) => (
                          <MenuItem key={c._id || c.name} value={c.name}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}

                    {slide.linkKind === "brand" && (
                      <TextField
                        select
                        label="Brand"
                        value={slide.brandName}
                        onChange={(e) => patchSlide(index, { brandName: e.target.value })}
                        fullWidth
                        size="small"
                      >
                        {brands.map((b) => (
                          <MenuItem key={b._id || b.name} value={b.name}>
                            {b.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}

                    {slide.linkKind === "custom" && (
                      <TextField
                        label="Link"
                        value={slide.customLink}
                        onChange={(e) => patchSlide(index, { customLink: e.target.value })}
                        placeholder="/products?search=tablet"
                        helperText='Must start with "/" for a page on this site, or "https://"'
                        fullWidth
                        size="small"
                      />
                    )}

                    {slide.linkKind === "whatsapp" && (
                      <Alert severity="info">
                        Opens a WhatsApp chat pre-filled with the headline of this slide.
                      </Alert>
                    )}

                    <TextField
                      label="Image description (for screen readers)"
                      value={slide.alt}
                      onChange={(e) => patchSlide(index, { alt: e.target.value })}
                      helperText="Leave blank to reuse the headline"
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
