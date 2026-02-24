"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_900/sample.jpg";

const promoCards = [
  {
    id: "valentine-announcement",
    type: "announcement",
    badge: "LIMITED TIME",
    title: "Ramadhan's Upgrade Offer",
    subtitle:
      "Save big on select phones + free accessories this ramadhan. Fast the smart way as the offer moves fast!!.",
    cta: "Shop Ramadhan Deals",
    href: "/products?tag=valentine",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1771914267/WHY_OPPO_RENO_15_4.jpg_zeipio.jpg",
    alt: "Ramadhan limited time phone offer announcement",
    tone: "soft",
  },
  {
    id: "offer-1",
    type: "phone",
    badge: "NEW IN STOCK",
    title: "Redmi Note 15",
    subtitle: "Up to 10% off + Amazing gifts",
    cta: "View Redmi Deals",
    href: "/products?brand=Infinix",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954598/Redmi_Note_15_ti0s4t.png",
    alt: "Redmi Note 15 promo phone",
    tone: "light",
  },
  {
    id: "offer-2",
    type: "phone",
    badge: "FRESH DEAL",
    title: "Camon 50 Series",
    subtitle: "Limited drop with launch pricing",
    cta: "Shop Camon 50",
    href: "/products?brand=Tecno",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954814/camon50_q889gg.png",
    alt: "Camon 40 Series promo phone",
    tone: "cool",
  },
  {
    id: "offer-3",
    type: "phone",
    badge: "ONE MORE DEAL",
    title: "Redmi Note 15",
    subtitle: "Premium upgrades. Up to 10% off.",
    cta: "Explore Redmi Deals",
    href: "/products?brand=Apple",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954598/Redmi_Note_15_ti0s4t.png",
    alt: "Redmi Note 15 Series promo phone",
    tone: "dark",
  },
  {
    id: "offer-4",
    type: "phone",
    badge: "MAKE THE UPGRADE",
    title: "Galaxy S26 Series",
    subtitle: "2‑year warranty + fast delivery",
    cta: "Shop Galaxy S26",
    href: "/products?brand=Samsung",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954625/s26ultra_yizrni.png",
    alt: "Galaxy S26 Series promo phone",
    tone: "midnight",
  },
];

const toneStyles = {
  soft: {
    background: "linear-gradient(180deg, #fff5f7 0%, #ffeef1 100%)",
    text: "#3a1b2b",
    chip: "#b4235f",
  },
  light: {
    background: "linear-gradient(180deg, #f7f7f7 0%, #f1f1f1 100%)",
    text: "#1c1c1c",
    chip: "#b42318",
  },
  cool: {
    background: "linear-gradient(180deg, #e9f3ff 0%, #dcecff 100%)",
    text: "#123252",
    chip: "#2e7d32",
  },
  dark: {
    background: "linear-gradient(180deg, #0b0b0b 0%, #151515 100%)",
    text: "#ffffff",
    chip: "#ef4444",
  },
  midnight: {
    background: "linear-gradient(180deg, #0b1533 0%, #101b3c 100%)",
    text: "#ffffff",
    chip: "#3b82f6",
  },
};

function PromoCard({ card, priority = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const styles = toneStyles[card.tone] || toneStyles.light;

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: styles.background,
        color: styles.text,
        boxShadow: "0 12px 36px rgba(17, 24, 39, 0.12)",
        border: "1px solid rgba(255,255,255,0.7)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
        alignItems: "center",
        minHeight: { xs: 320, md: 320 },
      }}
    >
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1.3}>
          <Chip
            label={card.badge}
            sx={{
              bgcolor: styles.chip,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 0.6,
              width: "fit-content",
            }}
            size="small"
          />
          <Typography
            variant={card.type === "announcement" ? "h1" : "h2"}
            component={card.type === "announcement" ? "h1" : "h2"}
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: card.type === "announcement" ? "1.8rem" : "1.6rem",
                md: card.type === "announcement" ? "2.4rem" : "2rem",
              },
              lineHeight: 1.15,
            }}
          >
            {card.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.9, fontSize: { xs: "0.98rem", md: "1.05rem" } }}
          >
            {card.subtitle}
          </Typography>
          <Button
            component={Link}
            href={card.href}
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{
              width: "fit-content",
              borderRadius: "999px",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              bgcolor: "#111827",
              "&:hover": { bgcolor: "#0f172a" },
            }}
            aria-label={card.cta}
          >
            {card.cta}
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 220, md: 280 },
        }}
      >
        <Image
          src={card.image}
          alt={card.alt}
          fill
          priority={priority}
          sizes="(max-width: 600px) 90vw, (max-width: 1200px) 40vw, 420px"
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
}

export default function PromoCardsSection() {
  const announcement = promoCards.find((c) => c.type === "announcement");
  const offers = promoCards.filter((c) => c.type !== "announcement");

  return (
    <Box component="section" aria-label="Promotions" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
        {announcement && (
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <PromoCard card={announcement} priority />
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gap: { xs: 2.5, md: 3 },
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {offers.map((card) => (
            <PromoCard key={card.id} card={card} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}