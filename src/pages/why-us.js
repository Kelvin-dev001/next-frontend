import Head from "next/head";
import Link from "next/link";
import { Container, Typography, Button, Alert } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, waLink } from "@/constants/business";

const PATH = "/why-us";
const TITLE = "Why Choose Us | Snaap Connections";
const DESCRIPTION = "Why shop with Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner supplies approved differentiators (verifiable claims only).
// Registered in the repo-root CONTENT-VERIFY.md.

export default function WhyUsPage() {
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
          until approved copy is supplied.
        </Alert>

        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={2}>
          Why Choose Us
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Approved copy for this page is on the way. For the concrete facts about how we operate —
          where we are, what delivery costs and how long it takes — see{" "}
          <Link href="/about" style={{ fontWeight: 600 }}>About</Link> and{" "}
          <Link href="/shipping" style={{ fontWeight: 600 }}>Shipping &amp; Delivery</Link>.
        </Typography>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsApp />}
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          sx={{ mb: 4, textTransform: "none", fontWeight: 700 }}
        >
          Talk to us on WhatsApp
        </Button>

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
