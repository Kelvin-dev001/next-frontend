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

const BADGE_COLOR = { HOT: "error", NEW: "success", TRENDING: "info", SALE: "warning" };
const WHATSAPP_NUMBER = "254711111602";

export default function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted,
  showWhatsApp = true,
  showViewBtn = true,
  badge,
  sx = {},
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
  const imgUrl = getOptimizedCloudinaryUrl(cloudUrl, { width: 520 }) || "/fallback.png";

  const message = `Hello, am interested in buying (${product?.name}${product?.model ? ", " + product.model : ""}, KES ${product?.discountPrice || product?.price})`;

  return (
    <Card
      sx={{
        borderRadius: "18px",
        background: "#fff",
        color: "primary.main",
        boxShadow: "0 4px 20px 0 rgba(30,60,114,0.08)",
        transition: "transform 0.25s cubic-bezier(.4,2,.4,1), box-shadow 0.25s",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        border: "none",
        minHeight: { xs: 320, md: 350 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...sx,
      }}
      elevation={0}
      {...props}
      onClick={() => router.push(`/products/${product?._id || product?.id || ""}`)}
    >
      <Box sx={{ position: "relative", pt: 1.5, px: 1.5 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 4",
            borderRadius: "14px",
            overflow: "hidden",
            bgcolor: "#f4f6f8",
          }}
        >
          <Image
            src={imgUrl}
            alt={product?.name || "Product"}
            fill
            sizes="(max-width: 600px) 44vw, (max-width: 960px) 30vw, 22vw"
            style={{ objectFit: "contain" }}
            priority={false}
          />
        </Box>

        {badge && (
          <Chip
            label={badge}
            color={BADGE_COLOR[badge] || "info"}
            size="small"
            sx={{ position: "absolute", top: 10, left: 10, fontWeight: 700, zIndex: 2 }}
          />
        )}
        {discountPercent && (
          <Chip
            label={`-${discountPercent}%`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 10, right: 10, fontWeight: 700, zIndex: 2 }}
          />
        )}
        <IconButton
          aria-label="add to wishlist"
          size="small"
          sx={{
            position: "absolute",
            bottom: 6,
            right: 10,
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

      <CardContent sx={{ flexGrow: 1, px: 1.5, pt: 1.5, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.4, display: "block" }}>
          {product?.brand}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          gutterBottom
          sx={{
            color: "#1e3c72",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.2,
          }}
        >
          {product?.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mb: 0.8 }}>
          <Rating
            value={product?.rating || 4.5}
            precision={0.1}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" htmlColor="#6dd5ed" />}
            emptyIcon={<Star fontSize="inherit" htmlColor="#e0e0e0" />}
          />
          <Typography variant="caption">
            {(product?.rating?.toFixed?.(1)) || "4.5"}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Typography variant="subtitle1" color="primary" fontWeight={700}>
            {product?.discountPrice || product?.price ? formatPrice(product.discountPrice || product.price) : "—"}
          </Typography>
          {product?.discountPrice && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              {formatPrice(product.price)}
            </Typography>
          )}
        </Stack>
        {product?.specs?.storage || product?.specs?.ram ? (
          <Stack direction="row" spacing={0.6} sx={{ mt: 0.8 }}>
            {product.specs?.storage && <Chip label={`Storage: ${product.specs.storage}`} size="small" variant="outlined" />}
            {product.specs?.ram && <Chip label={`RAM: ${product.specs.ram}`} size="small" variant="outlined" />}
          </Stack>
        ) : null}
      </CardContent>

      <Box sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
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
              mb: 0.6,
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
              fontSize: "0.98rem",
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