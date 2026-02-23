import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box, Typography, Button, Card, CardContent, CardMedia,
  Chip, Container, Divider, Tabs, Tab, List, ListItem,
  ListItemText, IconButton, Rating, useTheme,
  useMediaQuery, Breadcrumbs
} from "@mui/material";
import {
  Favorite, FavoriteBorder, Star,
  WhatsApp, Share, LocalShipping,
  AssignmentReturn, VerifiedUser
} from "@mui/icons-material";
import { Api } from "@/lib/api";
import ErrorAlert from "@/components/ErrorAlert";
import ReviewSection from "@/components/ReviewsSection";
import ProductGrid from "@/components/ProductGrid";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";

const FALLBACK_IMAGE = "/fallback.png";
const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";

export default function ProductDetailPage({ product, related = [] }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  if (product === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert error="Product not found" onClose={() => router.push("/products")} />
      </Container>
    );
  }

  useEffect(() => {
    setError(null);
  }, [product?._id]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= (product?.inStock ? 10 : 0)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.inStock ? 10 : 0)) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleTabChange = (_event, newValue) => setTabValue(newValue);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(price);

  const handleWhatsAppBuy = () => {
    if (!product) return;
    const message = `I'm interested in: ${product.name}\nPrice: ${formatPrice(
      product.discountPrice || product.price
    )}\nQuantity: ${quantity}\nLink: ${window.location.href}`;
    window.open(`https://wa.me/254711111602?text=${encodeURIComponent(message)}`, "_blank");
  };

  const images =
    product?.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];

  const mainImage =
    getOptimizedCloudinaryUrl(images[selectedImage], { width: isMobile ? 350 : 600 }) ||
    FALLBACK_IMAGE;

  const seoTitle = `${product?.name} | Buy in Mombasa, Kenya | ${SITE_NAME}`;
  const seoDescription =
    product?.shortDescription ||
    `Buy ${product?.name} in Mombasa with fast nationwide delivery across Kenya.`;
  const seoImage = getOptimizedCloudinaryUrl(images[0], { width: 900 }) || FALLBACK_IMAGE;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name,
    image: [seoImage],
    description: product?.shortDescription || product?.fullDescription || seoDescription,
    brand: { "@type": "Brand", name: product?.brand || SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product?.discountPrice || product?.price || undefined,
      availability: product?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product?._id}`,
    },
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, md: 3 } }}>
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="robots" content="index,follow" />
          <link rel="canonical" href={`${SITE_URL}/products/${product?._id}`} />

          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:type" content="product" />
          <meta property="og:url" content={`${SITE_URL}/products/${product?._id}`} />
          <meta property="og:locale" content="en_KE" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:image" content={seoImage} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImage} />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
        </Head>

        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
          <Link href="/" style={{ color: "inherit" }}>Home</Link>
          <Link
            href={`/products?category=${encodeURIComponent(product.category || "")}`}
            style={{ color: "inherit" }}
          >
            {product.category}
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "inherit" }}>{product.name}</Typography>
        </Breadcrumbs>

        {/* Product detail: image + info */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, md: 4 },
          }}
        >
          {/* LEFT: Images */}
          <Box sx={{ position: { md: "sticky" }, top: 16 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#fafafa",
              }}
            >
              <CardMedia
                component="img"
                src={mainImage}
                alt={`${product.name} - main`}
                loading="eager"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1.5,
                overflowX: "auto",
                py: 0.5,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: { xs: 56, md: 70 },
                    height: { xs: 56, md: 70 },
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImage === index
                        ? `2px solid ${theme.palette.primary.main}`
                        : "1px solid #eee",
                    opacity: selectedImage === index ? 1 : 0.7,
                    transition: "all 0.3s",
                    flexShrink: 0,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <img
                    src={getOptimizedCloudinaryUrl(image, { width: 100 }) || FALLBACK_IMAGE}
                    alt={`Thumbnail ${index + 1}`}
                    width={70}
                    height={70}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT: Product info */}
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.4rem", md: "2rem" } }}
            >
              {product.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={4.5} precision={0.1} readOnly size={isMobile ? "small" : "medium"} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                4.5 (24 reviews)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: 700, fontSize: { xs: "1.3rem", md: "1.8rem" } }}
              >
                {formatPrice(product.discountPrice || product.price)}
              </Typography>
              {product.discountPrice && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through", fontSize: { xs: "0.85rem", md: "1rem" } }}
                >
                  {formatPrice(product.price)}
                </Typography>
              )}
              {product.discountPrice && (
                <Chip
                  label={`Save ${formatPrice(product.price - product.discountPrice)}`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>

            <Typography variant="body1" paragraph sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
              {product.shortDescription}
            </Typography>

            <List dense sx={{ mb: 1 }}>
              {[
                { label: "Brand", value: product.brand },
                { label: "Category", value: product.category },
                { label: "Warranty", value: product.warrantyPeriod || "1 year" },
                {
                  label: "Availability",
                  value: product.inStock ? "In stock" : "Out of stock",
                  color: product.inStock ? "success.main" : "error.main",
                },
              ].map((item) => (
                <ListItem key={item.label} disablePadding sx={{ py: 0.3 }}>
                  <ListItemText
                    primary={item.label}
                    secondary={item.value}
                    primaryTypographyProps={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}
                    secondaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: { xs: "0.8rem", md: "0.875rem" },
                      color: item.color || "text.primary",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Quantity + Buy */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: "0.9rem", md: "1rem" } }}>
              Quantity
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Button
                  variant="text"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  sx={{ minWidth: "36px", px: 0.5 }}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={product.inStock ? 10 : 0}
                  onChange={handleQuantityChange}
                  style={{
                    width: 44,
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    fontSize: "0.95rem",
                  }}
                />
                <Button
                  variant="text"
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.inStock ? 10 : 0)}
                  sx={{ minWidth: "36px", px: 0.5 }}
                >
                  +
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.inStock ? "In stock" : "Out of stock"}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsApp />}
              fullWidth
              sx={{
                borderRadius: "50px",
                py: { xs: 1.2, md: 1.5 },
                fontWeight: 600,
                fontSize: { xs: "0.95rem", md: "1.1rem" },
              }}
              disabled={!product.inStock}
              onClick={handleWhatsAppBuy}
            >
              Buy on WhatsApp
            </Button>

            <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
              <IconButton
                aria-label="add to wishlist"
                onClick={() => toggleWishlist(product._id)}
                sx={{ border: "1px solid #ddd", borderRadius: "50%" }}
              >
                {wishlist.includes(product._id) ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <IconButton
                aria-label="share"
                sx={{ border: "1px solid #ddd", borderRadius: "50%" }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Product link copied!");
                }}
              >
                <Share />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Trust badges */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
                mb: 2,
              }}
            >
              {[
                { icon: <LocalShipping color="primary" />, title: "Free Delivery", sub: "Orders above KES 10,000" },
                { icon: <AssignmentReturn color="primary" />, title: "7-Day Returns", sub: "No questions asked" },
                { icon: <VerifiedUser color="primary" />, title: "Warranty", sub: `${product.warrantyPeriod || "1 year"} warranty` },
              ].map((badge) => (
                <Box key={badge.title} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {badge.icon}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: "0.78rem", md: "0.875rem" } }}>
                      {badge.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.68rem", md: "0.75rem" } }}>
                      {badge.sub}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Tabs: Description / Specs / Reviews */}
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 2,
              "& .MuiTabs-indicator": { height: 3 },
              "& .MuiTab-root": { fontSize: { xs: "0.78rem", md: "0.875rem" } },
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>

          <Box sx={{ p: { xs: 1.5, md: 3 }, bgcolor: "background.paper", borderRadius: 2 }}>
            {tabValue === 0 && (
              <Typography variant="body1" whiteSpace="pre-line" sx={{ fontSize: { xs: "0.88rem", md: "1rem" } }}>
                {product.fullDescription || "No description available"}
              </Typography>
            )}
            {tabValue === 1 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1,
                }}
              >
                {product.specs &&
                  Object.entries(product.specs)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 1.2,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {key.replace(/^[a-z]/, (char) => char.toUpperCase())}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: "1rem", md: "1.25rem" } }}>
                  Customer Reviews
                </Typography>
                <ReviewSection productId={product._id} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Related products — uses ProductGrid for consistent 2‑col mobile */}
        {related.length > 0 && (
          <Box sx={{ mt: { xs: 4, md: 8 } }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 2, fontSize: { xs: "1.1rem", md: "1.5rem" } }}
            >
              You may also like
            </Typography>
            <ProductGrid
              items={related}
              eagerCount={4}
              size="compact"
              showWhatsApp
              showViewBtn
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await Api.get(`/products/${params.id}`);
    const product = res.data?.product || null;

    let related = [];
    if (product?.category) {
      try {
        const relRes = await Api.get("/products", {
          params: { category: product.category, limit: 4 },
        });
        related = (relRes.data?.products || []).filter((p) => p._id !== params.id);
      } catch {
        related = [];
      }
    }

    return { props: { product, related } };
  } catch (e) {
    return { props: { product: null, related: [] } };
  }
}