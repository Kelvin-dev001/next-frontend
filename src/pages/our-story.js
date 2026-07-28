import Head from "next/head";
import Link from "next/link";
import { Container, Typography, Button, Alert, Stack } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, BUSINESS_NAME, waLink } from "@/constants/business";

const PATH = "/our-story";
const TITLE = "Our Story | Snaap Connections";
const DESCRIPTION = "The story behind Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner supplies an approved brand story. Do NOT publish a founding year,
// customer counts or sponsorships until confirmed — the dead CRA copy invented "founded 2018"
// and "thousands of customers". Registered in the repo-root CONTENT-VERIFY.md.

export default function OurStoryPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href={`${SITE_URL}${PATH}`} />
      </Head>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH -->" }} />

        <Alert severity="warning" sx={{ mb: 3 }}>
          Placeholder content — not approved for publication. This page is <strong>noindex</strong>{" "}
          until an approved brand story is supplied.
        </Alert>

        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={2}>
          Our Story
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          The full {BUSINESS_NAME} story is coming soon. The short version, and everything we can
          state for certain today: we&apos;re a smartphone and accessories shop based in Mombasa,
          serving customers across Kenya, with WhatsApp as our checkout.
        </Typography>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Button
            component={Link}
            href="/about"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            About Snaap Connections
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsApp />}
            href={waLink("Hi Snaap Connections, I'd like to know more about you.")}
            target="_blank"
            rel="noopener"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Talk to us on WhatsApp
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          <Link href="/products" style={{ fontWeight: 600 }}>Browse all products</Link>
          {"  ·  "}
          <Link href="/contact" style={{ fontWeight: 600 }}>Contact us</Link>
        </Typography>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
