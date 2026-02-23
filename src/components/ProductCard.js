"use client";
import React from "react";
import {
  Card, CardContent, Typography, Box, Button, Stack, Chip, IconButton, Rating
} from "@mui/material";
import { Favorite, FavoriteBorder, WhatsApp, Star } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(price);

const BADGE_COLOR = { HOT: "error", NEW: "success", TRENDING: "info", SALE: "warning", FEATURED: "primary" };
const WHATSAPP_NUMBER = "254711111602";

export default function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted,
  showWhatsApp = true,
  showViewBtn = true,
  badge,
  size = "compact",
  sx = {},
  imagePriority = false,
  ...props
}) {
  const router = useRouter();

  const discountPercent =
    product?.discountPrice && product?.price
      ? Math.round(100 - (product.discountPrice / product.price) * 100)
      : null;

  const cloudUrl =
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]);
  const imgUrl = getOptimizedCloudinaryUrl(cloudUrl, { width: 720 }) || "/fallback.png";

  const message = `Hello, am interested in buying (${product?.name}${product?.model ? ", " + product.model : ""}, KES ${product?.discountPrice || product?.price})`;

  const isFull = size === "full";

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: 0,
        borderRadius: { xs: "14px", md: isFull ? "22px" : "18px" },
        background: "#fff",
        color: "primary.main",
        boxShadow: "0 6px 24px rgba(30,60,114,0.1)",
        transition: "transform 0.25s cubic-bezier(.4,2,.4,1), box-shadow 0.25s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        border: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...sx,
      }}
      elevation={0}
      {...props}
      onClick={() => router.push(`/products/${product?._id || product?.id || ""}`)}
    >
      <Box sx={{ position: "relative", pt: { xs: 0.8, md: isFull ? 1.6 : 1.2 }, px: { xs: 0.8, md: isFull ? 1.8 : 1.2 } }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 5",
            borderRadius: { xs: "10px", md: isFull ? "16px" : "14px" },
            overflow: "hidden",
            bgcolor: "#f4f6f8",
          }}
        >
          <Image
            src={imgUrl}
            alt={product?.name || "Product"}
            fill
            sizes="(max-width: 600px) 48vw, (max-width: 900px) 32vw, 25vw"
            style={{ objectFit: "contain" }}
            priority={imagePriority}
          />
        </Box>

        {badge && (
          <Chip
            label={badge}
            color={BADGE_COLOR[badge] || "info"}
            size="small"
            sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700, zIndex: 2, fontSize: { xs: "0.6rem", md: "0.75rem" } }}
          />
        )}
        {discountPercent && (
          <Chip
            label={`-${discountPercent}%`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, fontWeight: 700, zIndex: 2, fontSize: { xs: "0.6rem", md: "0.75rem" } }}
          />
        )}
        <IconButton
          aria-label="add to wishlist"
          size="small"
          sx={{
            position: "absolute",
            bottom: 4,
            right: 8,
            bgcolor: "#fff",
            borderRadius: "50%",
            zIndex: 2,
            boxShadow: "0 2px 8px #2221",
            "&:hover": { bgcolor: "primary.light" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onWishlistToggle) onWishlistToggle(product?._id || product?.id);
          }}
        >
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, px: { xs: 0.8, md: isFull ? 2 : 1.2 }, pt: 0.8, pb: 0.4 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.2, display: "block", fontSize: { xs: "0.65rem", md: "0.75rem" } }}>
          {product?.brand}
        </Typography>
        <Typography
          fontWeight={700}
          gutterBottom
          sx={{
            color: "#1e3c72",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.2,
            fontSize: { xs: "0.8rem", md: "0.95rem" },
          }}
        >
          {product?.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mb: 0.4 }}>
          <Rating
            value={product?.rating || 4.5}
            precision={0.1}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" htmlColor="#6dd5ed" />}
            emptyIcon={<Star fontSize="inherit" htmlColor="#e0e0e0" />}
            sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
          />
          <Typography variant="caption" sx={{ fontSize: { xs: "0.6rem", md: "0.75rem" } }}>
            {(product?.rating?.toFixed?.(1)) || "4.5"}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
          <Typography color="primary" fontWeight={700} sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}>
            {product?.discountPrice || product?.price ? formatPrice(product.discountPrice || product.price) : "—"}
          </Typography>
          {product?.discountPrice && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through", fontSize: { xs: "0.6rem", md: "0.75rem" } }}>
              {formatPrice(product.price)}
            </Typography>
          )}
        </Stack>

        {(product?.specs?.storage || product?.specs?.ram) && (
          <Stack direction="column" spacing={0.3} sx={{ mt: 0.5 }}>
            {product.specs?.storage && (
              <Chip
                label={`Storage: ${product.specs.storage}`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: { xs: "0.58rem", md: "0.68rem" } }}
              />
            )}
            {product.specs?.ram && (
              <Chip
                label={`RAM: ${product.specs.ram}`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: { xs: "0.58rem", md: "0.68rem" } }}
              />
            )}
          </Stack>
        )}
      </CardContent>

      <Box sx={{ px: { xs: 0.8, md: isFull ? 2 : 1.2 }, pb: { xs: 0.8, md: isFull ? 1.6 : 1.2 }, pt: 0.4 }}>
        {showWhatsApp && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<WhatsApp />}
            sx={{
              borderRadius: "50px",
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
              mb: 0.4,
              py: { xs: 0.6, md: 0.9 },
              fontSize: { xs: "0.72rem", md: "0.92rem" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
            }}
          >
            Buy on WhatsApp
          </Button>
        )}
        {showViewBtn && (
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "50px",
              fontWeight: 700,
              color: "primary.main",
              borderColor: "#6dd5ed",
              textTransform: "none",
              fontSize: { xs: "0.72rem", md: "0.95rem" },
              py: { xs: 0.5, md: 0.85 },
              transition: "all 0.19s cubic-bezier(.4,2,.4,1)",
              "&:hover": {
                background: "linear-gradient(96deg,#6dd5ed 10%,#1e3c72 90%)",
                color: "#fff",
                borderColor: "transparent",
                boxShadow: "0 2px 24px #1e3c72cc",
                transform: "scale(1.03)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product?._id || product?.id || ""}`);
            }}
          >
            View
          </Button>
        )}
      </Box>
    </Card>
  );
}