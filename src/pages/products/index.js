import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  Box, Typography, Button, Grid, Container, Pagination, Select, MenuItem,
  IconButton, useTheme, useMediaQuery, Slider, Divider
} from "@mui/material";
import { Tune, Close } from "@mui/icons-material";
import { useRouter } from "next/router";
import { Api } from "@/lib/api";
import AutoCompleteSearch from "@/components/AutoCompleteSearch";
import ProductCard from "@/components/ProductCard";

const PRODUCTS_PER_PAGE_OPTIONS = [12, 24, 48, 96, 200, 500, 1000];
const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";
const PAGE_TITLE = "Shop Phones in Mombasa & Kenya | Snaap Connections";
const PAGE_DESCRIPTION =
  "Browse smartphones, accessories, and top deals in Mombasa with nationwide delivery across Kenya.";

export default function ProductListingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const brandFromQuery = useMemo(() => (router.query.brand ? String(router.query.brand) : ""), [router.query.brand]);
  const categoryFromQuery = useMemo(() => (router.query.category ? String(router.query.category) : ""), [router.query.category]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 500000,
    sort: "random",
    search: "",
  });

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/products`,
    inLanguage: "en-KE",
    about: "Phones and electronics in Mombasa and Kenya",
  };

  useEffect(() => {
    if (!router.isReady) return;
    setFilters((prev) => ({
      ...prev,
      category: categoryFromQuery,
      brand: brandFromQuery,
      page: 1,
    }));
  }, [router.isReady, categoryFromQuery, brandFromQuery]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          Api.get("/categories"),
          Api.get("/brands"),
        ]);
        setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
        setBrands(brandsRes.data?.brands || brandsRes.data || []);
      } catch (err) {
        setCategories([]);
        setBrands([]);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Api.get("/products", {
          params: {
            page: filters.page,
            limit: filters.limit,
            category: filters.category,
            brand: filters.brand,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            search: filters.search,
            sort: filters.sort,
          },
        });
        setProducts(response.data?.products || []);
        setTotalProducts(response.data?.count || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handlePriceChange = (_event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1],
      page: 1,
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }));
  };

  const handleProductsPerPageChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      limit: Number(e.target.value),
      page: 1,
    }));
  };

  const handlePageChange = (_e, value) => {
    setFilters((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: 500000,
      sort: "random",
      search: "",
    });
    router.replace("/products", undefined, { shallow: true });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSearchSelect = (productId) => {
    router.push(`/products/${productId}`);
  };

  const sliderValue = [
    Number.isFinite(filters.minPrice) ? filters.minPrice : 0,
    Number.isFinite(filters.maxPrice) ? filters.maxPrice : 500000,
  ];

  if (loading && filters.page === 1) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => setError(null)}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${SITE_URL}/products`} />

        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/products`} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
        />
      </Head>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 4,
        }}
      >
        {(!isMobile || showFilters) && (
          <Box
            sx={{
              width: isMobile ? "100%" : "280px",
              flexShrink: 0,
              position: isMobile ? "fixed" : "static",
              top: 0,
              left: 0,
              height: isMobile ? "100vh" : "auto",
              bgcolor: isMobile ? "background.paper" : "transparent",
              zIndex: isMobile ? 1200 : "auto",
              p: isMobile ? 2 : 0,
              overflowY: isMobile ? "auto" : "visible",
            }}
          >
            {isMobile && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setShowFilters(false)}>
                  <Close />
                </IconButton>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Search
              </Typography>
              <AutoCompleteSearch
                onSelect={handleSearchSelect}
                placeholder="Search products..."
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Price Range (KES)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={sliderValue}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500000}
                  step={1000}
                  valueLabelFormat={(val) => `KES ${val.toLocaleString()}`}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
                <Typography variant="body2">{sliderValue[0].toLocaleString()}</Typography>
                <Typography variant="body2">{sliderValue[1].toLocaleString()}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              <Select
                name="category"
                value={filters.category}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    category: e.target.value,
                    page: 1,
                  }))
                }
                fullWidth
                displayEmpty
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Brands
              </Typography>
              <Select
                name="brand"
                value={filters.brand}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    brand: e.target.value,
                    page: 1,
                  }))
                }
                fullWidth
                displayEmpty
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand._id || brand.name} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Button variant="outlined" fullWidth onClick={clearFilters} sx={{ mb: 2 }}>
              Clear All Filters
            </Button>

            {isMobile && (
              <Button variant="contained" fullWidth onClick={() => setShowFilters(false)}>
                Show Results
              </Button>
            )}
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              {filters.category
                ? filters.category
                : filters.brand
                ? filters.brand
                : "All Products"}
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
                sx={{ ml: 1 }}
              >
                ({totalProducts} products)
              </Typography>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Select
                value={filters.limit}
                onChange={handleProductsPerPageChange}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {PRODUCTS_PER_PAGE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option} / page
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={filters.sort}
                onChange={handleSortChange}
                size="small"
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="random">Random</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
              {isMobile && (
                <IconButton onClick={() => setShowFilters(true)}>
                  <Tune />
                </IconButton>
              )}
            </Box>
          </Box>

          {products.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "50vh",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No products found matching your filters
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {products.map((product) => (
                  <Grid item key={product._id || product.id} xs={6} sm={6} md={4} lg={3}>
                    <ProductCard
                      product={product}
                      isWishlisted={wishlist.includes(product._id)}
                      onWishlistToggle={toggleWishlist}
                      showWhatsApp={true}
                      showViewBtn={true}
                    />
                  </Grid>
                ))}
              </Grid>
              {Math.ceil(totalProducts / filters.limit) > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(totalProducts / filters.limit)}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}