import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import {
  Box, Typography, Button, Container, Pagination, Select, MenuItem,
  IconButton, useTheme, useMediaQuery, Slider, Divider
} from "@mui/material";
import { Tune, Close } from "@mui/icons-material";
import { useRouter } from "next/router";
import { Api } from "@/lib/api";
import AutoCompleteSearch from "@/components/AutoCompleteSearch";
import ProductGrid from "@/components/ProductGrid";

const PRODUCTS_PER_PAGE_OPTIONS = [12, 24, 48, 96, 200, 500, 1000];
const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";
const PAGE_TITLE = "Shop Phones in Mombasa & Kenya | Snaap Connections";
const PAGE_DESCRIPTION =
  "Browse smartphones, accessories, and top deals in Mombasa with nationwide delivery across Kenya.";

export default function ProductListingPage({
  initialProducts = [],
  initialTotal = 0,
  initialFilters = {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const skipFirstFetch = useRef(true);

  const brandFromQuery = useMemo(() => (router.query.brand ? String(router.query.brand) : ""), [router.query.brand]);
  const categoryFromQuery = useMemo(() => (router.query.category ? String(router.query.category) : ""), [router.query.category]);
  const sortFromQuery = useMemo(() => (router.query.sort ? String(router.query.sort) : ""), [router.query.sort]);
  const dealTypeFromQuery = useMemo(() => (router.query.dealType ? String(router.query.dealType) : ""), [router.query.dealType]);
  const minPriceFromQuery = useMemo(
    () => (router.query.minPrice ? Number(router.query.minPrice) : 0),
    [router.query.minPrice]
  );
  const maxPriceFromQuery = useMemo(
    () => (router.query.maxPrice ? Number(router.query.maxPrice) : 500000),
    [router.query.maxPrice]
  );

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 12,
    category: initialFilters.category || "",
    brand: initialFilters.brand || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 500000,
    sort: initialFilters.sort || "random",
    search: initialFilters.search || "",
    dealType: initialFilters.dealType || "",
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
      sort: sortFromQuery || prev.sort,
      minPrice: Number.isFinite(minPriceFromQuery) ? minPriceFromQuery : 0,
      maxPrice: Number.isFinite(maxPriceFromQuery) ? maxPriceFromQuery : 500000,
      dealType: dealTypeFromQuery,
      page: 1,
    }));
  }, [
    router.isReady,
    categoryFromQuery,
    brandFromQuery,
    sortFromQuery,
    minPriceFromQuery,
    maxPriceFromQuery,
    dealTypeFromQuery,
  ]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          Api.get("/categories"),
          Api.get("/brands"),
        ]);
        setCategories(categoriesRes.data?.categories || categoriesRes.data || []);
        setBrands(brandsRes.data?.brands || brandsRes.data || []);
      } catch {
        setCategories([]);
        setBrands([]);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (skipFirstFetch.current) {
          skipFirstFetch.current = false;
          return;
        }
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
            dealType: filters.dealType,
          },
        });
        setProducts(response.data?.products || []);
        setTotalProducts(response.data?.total || response.data?.count || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handlePriceChange = (_event, newValue) => {
    setFilters((prev) => ({ ...prev, minPrice: newValue[0], maxPrice: newValue[1], page: 1 }));
  };
  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };
  const handleProductsPerPageChange = (e) => {
    setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }));
  };
  const handlePageChange = (_e, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };
  const clearFilters = () => {
    setFilters({ page: 1, limit: 12, category: "", brand: "", minPrice: 0, maxPrice: 500000, sort: "random", search: "", dealType: "" });
    router.replace("/products", undefined, { shallow: true });
  };
  const toggleWishlist = (productId) => {
    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };
  const handleSearchSelect = (productId) => { router.push(`/products/${productId}`); };

  const sliderValue = [
    Number.isFinite(filters.minPrice) ? filters.minPrice : 0,
    Number.isFinite(filters.maxPrice) ? filters.maxPrice : 500000,
  ];

  if (error) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button variant="contained" onClick={() => setError(null)}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      </Head>

      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, md: 3 }, py: { xs: 1, md: 3 } }}>
        {/* Mobile: top bar with title + controls */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: { xs: 1.5, md: 0 },
            gap: 1,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, fontSize: { xs: "1.1rem", md: "1.5rem" } }}>
            {filters.category || filters.brand || "All Products"}
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
              ({totalProducts} products)
            </Typography>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Select value={filters.limit} onChange={handleProductsPerPageChange} size="small" sx={{ minWidth: { xs: 80, md: 120 }, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
              {PRODUCTS_PER_PAGE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option} / page</MenuItem>
              ))}
            </Select>
            <Select value={filters.sort} onChange={handleSortChange} size="small" sx={{ minWidth: { xs: 90, md: 180 }, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
              <MenuItem value="random">Random</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low → High</MenuItem>
              <MenuItem value="price-high">Price: High → Low</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </Select>
            {isMobile && (
              <IconButton onClick={() => setShowFilters(true)} size="small">
                <Tune />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* SIDEBAR: desktop only (static) OR mobile (overlay) */}
          {!isMobile && (
            <Box sx={{ width: "260px", flexShrink: 0 }}>
              <SidebarFilters
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                brands={brands}
                sliderValue={sliderValue}
                handlePriceChange={handlePriceChange}
                handleSearchSelect={handleSearchSelect}
                clearFilters={clearFilters}
              />
            </Box>
          )}

          {/* Mobile filter overlay */}
          {isMobile && showFilters && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "background.paper",
                zIndex: 1300,
                p: 2,
                overflowY: "auto",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={() => setShowFilters(false)}><Close /></IconButton>
              </Box>
              <SidebarFilters
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                brands={brands}
                sliderValue={sliderValue}
                handlePriceChange={handlePriceChange}
                handleSearchSelect={handleSearchSelect}
                clearFilters={clearFilters}
              />
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setShowFilters(false)}>
                Show Results
              </Button>
            </Box>
          )}

          {/* PRODUCT GRID: takes full remaining width */}
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <ProductGrid
              items={products}
              loading={loading}
              skeletonCount={filters.limit > 12 ? 12 : filters.limit}
              eagerCount={6}
              size="compact"
              showWhatsApp
              showViewBtn
              onWishlistToggle={toggleWishlist}
              isWishlisted={(p) => wishlist.includes(p._id)}
            />

            {Math.ceil(totalProducts / filters.limit) > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
                <Pagination
                  count={Math.ceil(totalProducts / filters.limit)}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function SidebarFilters({ filters, setFilters, categories, brands, sliderValue, handlePriceChange, handleSearchSelect, clearFilters }) {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Search</Typography>
        <AutoCompleteSearch onSelect={handleSearchSelect} placeholder="Search products..." sx={{ mb: 2 }} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Price Range (KES)</Typography>
        <Box sx={{ px: 2 }}>
          <Slider value={sliderValue} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={500000} step={1000} valueLabelFormat={(val) => `KES ${val.toLocaleString()}`} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography variant="body2">{sliderValue[0].toLocaleString()}</Typography>
          <Typography variant="body2">{sliderValue[1].toLocaleString()}</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Categories</Typography>
        <Select name="category" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))} fullWidth displayEmpty size="small" sx={{ mb: 2 }}>
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (<MenuItem key={cat._id || cat.name} value={cat.name}>{cat.name}</MenuItem>))}
        </Select>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Brands</Typography>
        <Select name="brand" value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value, page: 1 }))} fullWidth displayEmpty size="small" sx={{ mb: 2 }}>
          <MenuItem value="">All Brands</MenuItem>
          {brands.map((brand) => (<MenuItem key={brand._id || brand.name} value={brand.name}>{brand.name}</MenuItem>))}
        </Select>
      </Box>
      <Button variant="outlined" fullWidth onClick={clearFilters} sx={{ mb: 2 }}>Clear All Filters</Button>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const {
    page = 1, limit = 12, category = "", brand = "",
    minPrice = 0, maxPrice = 500000, sort = "random",
    search = "", dealType = "",
  } = query;

  try {
    const response = await Api.get("/products", {
      params: { page, limit, category, brand, minPrice, maxPrice, sort, search, dealType },
    });
    return {
      props: {
        initialProducts: response.data?.products || [],
        initialTotal: response.data?.total || response.data?.count || 0,
        initialFilters: {
          page: Number(page), limit: Number(limit), category, brand,
          minPrice: Number(minPrice), maxPrice: Number(maxPrice), sort, search, dealType,
        },
      },
    };
  } catch {
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
        initialFilters: {
          page: Number(page), limit: Number(limit), category, brand,
          minPrice: Number(minPrice), maxPrice: Number(maxPrice), sort, search, dealType,
        },
      },
    };
  }
}