"use client";
import React from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  Chip,
  Stack,
} from "@mui/material";
import CellTowerIcon from "@mui/icons-material/CellTower";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CallIcon from "@mui/icons-material/Call";
import SmsIcon from "@mui/icons-material/Sms";
import WidgetsIcon from "@mui/icons-material/Widgets";

const iconMap = {
  iot: <CellTowerIcon fontSize="large" />,
  mpesa: <PaymentsIcon fontSize="large" />,
  paybill: <ReceiptLongIcon fontSize="large" />,
  voice: <CallIcon fontSize="large" />,
  sms: <SmsIcon fontSize="large" />,
  default: <WidgetsIcon fontSize="large" />,
};

export default function SafaricomCorner({ sections = [] }) {
  const section = sections.find((s) => s.sectionKey === "safaricom_corner" && s.enabled);
  if (!section) return null;

  return (
    <Box component="section" aria-label="Safaricom Corner" sx={{ py: { xs: 6, md: 9 }, bgcolor: "background.default" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 3,
            color: "primary.main",
            letterSpacing: 0.4,
            fontSize: { xs: "1.45rem", md: "1.8rem" },
          }}
        >
          {section.title}
        </Typography>

        {section.subtitle && (
          <Typography align="center" sx={{ mb: 4, color: "text.secondary", maxWidth: 720, mx: "auto" }}>
            {section.subtitle}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 1.6, md: 2.4 },
          }}
        >
          {section.items.map((item, idx) => {
            const link = item.ctaLink
              ? item.ctaLink
              : `/products?category=${encodeURIComponent(item.category || "")}&search=${encodeURIComponent(item.search || "")}`;

            return (
              <Card
                key={`${item.title}-${idx}`}
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  overflow: "hidden",
                  bgcolor: "#fff",
                  boxShadow: "0 5px 18px rgba(30, 60, 114, 0.08)",
                  border: "1px solid rgba(15, 23, 42, 0.05)",
                }}
              >
                <CardActionArea
                  component={Link}
                  href={link}
                  sx={{
                    position: "relative",
                    minHeight: 170,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "center",
                    p: 2,
                    color: "#fff",
                    backgroundImage: item.image ? `url(${item.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: item.image ? "rgba(0,0,0,0.55)" : "transparent",
                    }}
                  />

                  {/* Fallback icon if no image */}
                  {!item.image && (
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "#f5f8ff",
                        color: "primary.main",
                        mx: "auto",
                        mb: 1.5,
                        zIndex: 1,
                      }}
                    >
                      {iconMap[item.iconKey] || iconMap.default}
                    </Stack>
                  )}

                  {/* Text */}
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#fff" }}>
                      {item.title}
                    </Typography>

                    {item.subtitle && (
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        {item.subtitle}
                      </Typography>
                    )}

                    <Chip
                      label={item.ctaLabel || "View Service"}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: "#1e3c72",
                        color: "#fff",
                        fontWeight: 700,
                        letterSpacing: 0.3,
                        fontSize: "0.68rem",
                      }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}