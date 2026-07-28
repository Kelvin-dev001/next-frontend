import Head from "next/head";
import Link from "next/link";
import {
  Container, Typography, Stack, Button, Paper, Divider,
} from "@mui/material";
import {
  LocationOn, Email as EmailIcon, WhatsApp, AccessTime,
} from "@mui/icons-material";
import {
  SITE_URL, ADDRESS, EMAIL, PHONE_DISPLAY, HOURS_DISPLAY, waLink,
} from "@/constants/business";

const PATH = "/contact";
const TITLE = "Contact Snaap Connections | Mombasa Phone Shop";
const DESCRIPTION =
  "Reach Snaap Connections in Mombasa on WhatsApp, phone or email. Digo Rd, Opp Baroda Mall. Open 8:00 AM – 7:00 PM, every day.";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${SITE_URL}${PATH}`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}${PATH}`} />
      </Head>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={1}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Questions about a phone, a price or a delivery? Message us on WhatsApp — it&apos;s the
          fastest way to reach us, and it&apos;s how we take every order.
        </Typography>

        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<WhatsApp />}
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          sx={{ mb: 4, textTransform: "none", fontWeight: 700 }}
        >
          Chat with us on WhatsApp
        </Button>

        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <LocationOn color="primary" />
              <Typography>{ADDRESS.full}</Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <WhatsApp color="primary" />
              <Typography>
                <a href={waLink()} target="_blank" rel="noopener" style={{ color: "inherit", textDecoration: "none" }}>
                  {PHONE_DISPLAY}
                </a>{" "}
                — WhatsApp &amp; calls
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <EmailIcon color="primary" />
              <Typography>
                <a href={`mailto:${EMAIL}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {EMAIL}
                </a>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <AccessTime color="primary" />
              <Typography>{HOURS_DISPLAY}</Typography>
            </Stack>
          </Stack>
        </Paper>

        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Looking for something?{" "}
          <Link href="/products" style={{ fontWeight: 600 }}>Browse all products</Link>, or read our{" "}
          <Link href="/shipping" style={{ fontWeight: 600 }}>delivery information</Link> and{" "}
          <Link href="/faqs" style={{ fontWeight: 600 }}>FAQs</Link>.
        </Typography>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
