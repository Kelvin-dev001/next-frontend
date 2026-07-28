import Head from "next/head";
import Link from "next/link";
import { Container, Typography, Button, Alert } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, waLink } from "@/constants/business";

const PATH = "/returns";
const TITLE = "Returns & Exchanges | Snaap Connections";
const DESCRIPTION = "How returns and exchanges work at Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// This page is served noindex until the owner supplies an approved returns policy.
// Registered in the repo-root CONTENT-VERIFY.md. A P6 CI gate must fail the build if this
// page becomes indexable while the PLACEHOLDER COPY marker is still present.

export default function ReturnsPage() {
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
          until a real returns policy is supplied.
        </Alert>

        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={2}>
          Returns &amp; Exchanges
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          Our full returns and exchange policy is being finalised and will appear here once
          approved.
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          In the meantime: return terms vary by product and are shown on each product&apos;s page.
          To ask about a return or exchange today, message us on WhatsApp and we&apos;ll help you
          directly.
        </Typography>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsApp />}
          href={waLink("Hi Snaap Connections, I'd like to ask about a return.")}
          target="_blank"
          rel="noopener"
          sx={{ mb: 4, textTransform: "none", fontWeight: 700 }}
        >
          Ask about a return on WhatsApp
        </Button>

        <Typography variant="body2" color="text.secondary">
          <Link href="/products" style={{ fontWeight: 600 }}>Browse all products</Link>
          {"  ·  "}
          <Link href="/faqs" style={{ fontWeight: 600 }}>FAQs</Link>
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
