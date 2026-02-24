"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Chip, useTheme, useMediaQuery,
  CircularProgress, FormControlLabel, Checkbox, Tooltip, TablePagination, Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Add, Edit, Delete, Search, Clear, Visibility, Category, Inventory } from "@mui/icons-material";
import { Api } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";

const MAX_IMAGES = 10;
const emptyProduct = {
  name: "",
  price: 0,
  discountPrice: "",
  currency: "KES",
  isOnSale: false,
  brand: "",
  model: "",
  category: "",
  stockQuantity: 0,
  inStock: true,
  sku: "",
  dealType: "",
  dealExpiry: "",
  specs: {
    storage: "",
    ram: "",
    screenSize: "",
    camera: "",
    battery: "",
    processor: "",
    os: "",
    material: "",
    wattage: "",
    connectivity: "",
  },
  accessoryType: "",
  compatibleWith: [],
  images: [],
  thumbnail: "",
  videoUrl: "",
  shortDescription: "",
  fullDescription: "",
  keyFeatures: [],
  tags: [],
  relatedProducts: [],
  isFeatured: false,
  isNewRelease: false,
  releaseDate: "",
  warrantyPeriod: "",
  returnPolicyDays: 30,
  isActive: true,
};

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [initialPreviews, setInitialPreviews] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSuccessClose = () => setSuccessMsg("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          Api.get("/products", { params: { page: page + 1, limit: rowsPerPage, search: searchTerm || undefined } }),
          Api.get("/categories"),
          Api.get("/brands"),
        ]);
        setProducts(productsRes.data?.products || productsRes.data || []);
        setTotalProducts(productsRes.data?.count || productsRes.data?.length || 0);
        setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
        setBrands(brandsRes.data?.brands || brandsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const handleOpenDialog = (product = null) => {
    setCurrentProduct(
      product
        ? {
            ...emptyProduct,
            ...product,
            specs: { ...emptyProduct.specs, ...(product.specs || {}) },
            keyFeatures: product.keyFeatures || [],
            tags: product.tags || [],
            compatibleWith: product.compatibleWith || [],
            relatedProducts: product.relatedProducts || [],
            dealExpiry: product.dealExpiry ? product.dealExpiry.slice(0, 16) : "",
          }
        : { ...emptyProduct }
    );
    setSelectedImages([]);
    setImagePreviews([]);
    setInitialPreviews(product?.images?.length ? product.images : []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setInitialPreviews([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      specs: { ...prev.specs, [name]: value },
    }));
  };

  const handleArrayFieldChange = (name, value) => {
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()).filter(Boolean),
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + initialPreviews.length + files.length > MAX_IMAGES) {
      alert(`You can upload up to ${MAX_IMAGES} images per product.`);
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleRemoveImage = (idx) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveInitialImage = (idx) => {
    setInitialPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const collectFormData = () => {
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("price", currentProduct.price);
    if (currentProduct.discountPrice) formData.append("discountPrice", currentProduct.discountPrice);
    formData.append("currency", currentProduct.currency || "KES");
    formData.append("isOnSale", currentProduct.isOnSale);
    formData.append("brand", currentProduct.brand);
    formData.append("model", currentProduct.model || "");
    formData.append("category", currentProduct.category);
    formData.append("sku", currentProduct.sku || "");
    formData.append("stockQuantity", currentProduct.stockQuantity || 0);
    formData.append("inStock", currentProduct.inStock);
    formData.append("accessoryType", currentProduct.accessoryType || "");
    formData.append("thumbnail", currentProduct.thumbnail || "");
    formData.append("videoUrl", currentProduct.videoUrl || "");
    formData.append("shortDescription", currentProduct.shortDescription || "");
    formData.append("fullDescription", currentProduct.fullDescription || "");
    formData.append("isFeatured", currentProduct.isFeatured);
    formData.append("isNewRelease", currentProduct.isNewRelease);
    if (currentProduct.releaseDate) formData.append("releaseDate", currentProduct.releaseDate);
    if (currentProduct.warrantyPeriod) formData.append("warrantyPeriod", currentProduct.warrantyPeriod);
    if (currentProduct.returnPolicyDays) formData.append("returnPolicyDays", currentProduct.returnPolicyDays);
    formData.append("dealType", currentProduct.dealType || "");
    formData.append("dealExpiry", currentProduct.dealExpiry || "");

    ["keyFeatures", "tags", "compatibleWith", "relatedProducts"].forEach((field) => {
      if (currentProduct[field]?.length) currentProduct[field].forEach((val) => formData.append(`${field}[]`, val));
    });

    if (currentProduct.specs) {
      Object.entries(currentProduct.specs).forEach(([key, val]) => {
        if (val) formData.append(`specs[${key}]`, val);
      });
    }

    if (currentProduct._id && initialPreviews.length > 0) {
      initialPreviews.forEach((imgUrl) => formData.append("existingImages[]", imgUrl));
    }

    selectedImages.forEach((img) => formData.append("images", img));

    return formData;
  };

  const handleSaveProduct = async () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.brand || !currentProduct.category) {
      setError("Please fill in all required fields (name, price, brand, category).");
      return;
    }
    try {
      setLoading(true);
      const formData = collectFormData();
      if (currentProduct._id) {
        await Api.put(`/products/${currentProduct._id}`, formData);
        setSuccessMsg("Product updated successfully!");
      } else {
        await Api.post("/products", formData);
        setSuccessMsg("Product created successfully!");
      }
      const res = await Api.get("/products", { params: { page: page + 1, limit: rowsPerPage } });
      setProducts(res.data?.products || res.data || []);
      setTotalProducts(res.data?.count || res.data?.length || 0);
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    const ok = typeof window === "undefined" ? true : window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    try {
      setLoading(true);
      await Api.delete(`/products/${id}`);
      const res = await Api.get("/products", { params: { page: page + 1, limit: rowsPerPage } });
      setProducts(res.data?.products || res.data || []);
      setTotalProducts(res.data?.count || res.data?.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <ErrorAlert error={error} onClose={() => setError(null)} />;

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={handleSuccessClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <MuiAlert onClose={handleSuccessClose} severity="success" sx={{ width: "100%" }}>{successMsg}</MuiAlert>
      </Snackbar>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>Products Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: "50px" }}>Add Product</Button>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth variant="outlined" placeholder="Search products..." value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
                endAdornment: searchTerm && (<IconButton onClick={() => { setSearchTerm(""); setPage(0); }}><Clear fontSize="small" /></IconButton>),
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100], "& th": { fontWeight: 600 } }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Deal</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: "hidden", mr: 2, bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {product.images?.[0] ? (<img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<Inventory color="disabled" fontSize="small" />)}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={product.category} size="small" icon={<Category fontSize="small" />} /></TableCell>
                    <TableCell><Typography variant="body2">{product.brand}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{product.currency || "KES"} {Number(product.price || 0).toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Inventory fontSize="small" color="action" />
                        <Typography variant="body2">{product.stockQuantity}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {product.dealType ? (
                        <Chip
                          label={product.dealType === "dealOfTheDay" ? "Deal of Day" : product.dealType === "flashSale" ? "Flash Sale" : "Limited"}
                          size="small"
                          color={product.dealType === "dealOfTheDay" ? "error" : product.dealType === "flashSale" ? "warning" : "info"}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell><Chip label={product.inStock ? "In Stock" : "Out of Stock"} color={product.inStock ? "success" : "error"} size="small" /></TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View"><IconButton size="small" color="info"><Visibility fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => handleOpenDialog(product)}><Edit fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteProduct(product._id)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100, 250, 1000]} component="div" count={totalProducts}
            rowsPerPage={rowsPerPage} page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </CardContent>
      </Card>

      {/* PRODUCT FORM DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{currentProduct?._id ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Product Name" name="name" value={currentProduct?.name || ""} onChange={handleInputChange} margin="normal" required />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Brand</InputLabel>
                <Select label="Brand" name="brand" value={currentProduct?.brand || ""} onChange={handleInputChange}>
                  {brands.length > 0 ? brands.map((b) => <MenuItem key={b._id || b.name} value={b.name}>{b.name}</MenuItem>) : <MenuItem disabled value="">No brands found</MenuItem>}
                </Select>
              </FormControl>
              <TextField fullWidth label="Model" name="model" value={currentProduct?.model || ""} onChange={handleInputChange} margin="normal" />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select label="Category" name="category" value={currentProduct?.category || ""} onChange={handleInputChange}>
                  {categories.length > 0 ? categories.map((c) => <MenuItem key={c._id || c.name} value={c.name}>{c.name}</MenuItem>) : <MenuItem disabled value="">No categories found</MenuItem>}
                </Select>
              </FormControl>
              <TextField fullWidth label="Price (KES)" name="price" type="number" value={currentProduct?.price || 0} onChange={handleInputChange} margin="normal" required />
              <TextField fullWidth label="Discount Price" name="discountPrice" type="number" value={currentProduct?.discountPrice || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Currency" name="currency" value={currentProduct?.currency || "KES"} onChange={handleInputChange} margin="normal" />
              <FormControlLabel control={<Checkbox name="isOnSale" checked={currentProduct?.isOnSale || false} onChange={handleInputChange} />} label="On Sale" sx={{ mt: 1 }} />

              {/* DEAL TYPE + EXPIRY */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Deal Type</InputLabel>
                <Select label="Deal Type" name="dealType" value={currentProduct?.dealType || ""} onChange={handleInputChange}>
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="dealOfTheDay">Deal of the Day</MenuItem>
                  <MenuItem value="flashSale">Flash Sale</MenuItem>
                  <MenuItem value="limitedOffer">Limited Offer</MenuItem>
                </Select>
              </FormControl>
              {currentProduct?.dealType && (
                <TextField
                  fullWidth
                  label="Deal Expiry Date & Time"
                  name="dealExpiry"
                  type="datetime-local"
                  value={currentProduct?.dealExpiry || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for no expiry. Products auto-hide after this time."
                />
              )}

              <TextField fullWidth label="SKU" name="sku" value={currentProduct?.sku || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Stock Quantity" name="stockQuantity" type="number" value={currentProduct?.stockQuantity || 0} onChange={handleInputChange} margin="normal" />
              <FormControlLabel control={<Checkbox name="inStock" checked={currentProduct?.inStock || false} onChange={handleInputChange} />} label="In Stock" sx={{ mt: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Short Description" name="shortDescription" value={currentProduct?.shortDescription || ""} onChange={handleInputChange} margin="normal" multiline rows={2} />
              <TextField fullWidth label="Full Description" name="fullDescription" value={currentProduct?.fullDescription || ""} onChange={handleInputChange} margin="normal" multiline rows={4} />
              <TextField fullWidth label="Key Features (comma separated)" name="keyFeatures" value={currentProduct?.keyFeatures?.join(", ") || ""} onChange={(e) => handleArrayFieldChange("keyFeatures", e.target.value)} margin="normal" />
              <TextField fullWidth label="Tags (comma separated)" name="tags" value={currentProduct?.tags?.join(", ") || ""} onChange={(e) => handleArrayFieldChange("tags", e.target.value)} margin="normal" />
              <TextField fullWidth label="Accessory Type" name="accessoryType" value={currentProduct?.accessoryType || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Compatible With (comma separated)" name="compatibleWith" value={currentProduct?.compatibleWith?.join(", ") || ""} onChange={(e) => handleArrayFieldChange("compatibleWith", e.target.value)} margin="normal" />
              <TextField fullWidth label="Thumbnail URL" name="thumbnail" value={currentProduct?.thumbnail || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Video URL" name="videoUrl" value={currentProduct?.videoUrl || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Warranty Period" name="warrantyPeriod" value={currentProduct?.warrantyPeriod || ""} onChange={handleInputChange} margin="normal" />
              <TextField fullWidth label="Return Policy Days" name="returnPolicyDays" type="number" value={currentProduct?.returnPolicyDays || 30} onChange={handleInputChange} margin="normal" />
              <FormControlLabel control={<Checkbox name="isFeatured" checked={currentProduct?.isFeatured || false} onChange={handleInputChange} />} label="Featured" sx={{ mt: 1 }} />
              <FormControlLabel control={<Checkbox name="isNewRelease" checked={currentProduct?.isNewRelease || false} onChange={handleInputChange} />} label="New Release" sx={{ mt: 1 }} />
              <TextField fullWidth label="Release Date" name="releaseDate" type="date" value={currentProduct?.releaseDate ? currentProduct.releaseDate.slice(0, 10) : ""} onChange={handleInputChange} margin="normal" InputLabelProps={{ shrink: true }} />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" component="label" sx={{ mt: 1 }} disabled={selectedImages.length + initialPreviews.length >= MAX_IMAGES}>
                  Upload Product Images (max {MAX_IMAGES})
                  <input type="file" accept="image/*" hidden multiple onChange={handleImagesChange} />
                </Button>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  {initialPreviews.map((img, idx) => (<ImageThumb key={img + idx} src={img} onRemove={() => handleRemoveInitialImage(idx)} />))}
                  {imagePreviews.map((img, idx) => (<ImageThumb key={img + idx} src={img} onRemove={() => handleRemoveImage(idx)} />))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Specifications</Typography>
              <Grid container spacing={2}>
                {["storage", "ram", "screenSize", "camera", "battery", "processor", "os", "material", "wattage", "connectivity"].map((spec) => (
                  <Grid item xs={12} sm={6} md={4} key={spec}>
                    <TextField fullWidth label={spec.replace(/^[a-z]/, (c) => c.toUpperCase())} name={spec} value={currentProduct?.specs?.[spec] || ""} onChange={handleSpecChange} margin="normal" />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: "50px" }}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" disabled={loading} sx={{ borderRadius: "50px" }}>
            {loading ? <CircularProgress size={24} /> : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ImageThumb({ src, onRemove }) {
  return (
    <Box sx={{ position: "relative", width: 80, height: 80, borderRadius: 2, overflow: "hidden", border: "1px solid #eee", mr: 1, mb: 1 }}>
      <img src={src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <IconButton size="small" color="error" onClick={onRemove} sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(255,255,255,0.7)" }}>
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
}