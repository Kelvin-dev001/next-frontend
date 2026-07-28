import Head from "next/head";
import Link from "next/link";
import { Container, Typography, Button, Alert, Stack } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, EMAIL, waLink } from "@/constants/business";

const PATH = "/careers";
const TITLE = "Careers | Snaap Connections";
const DESCRIPTION = "Working with Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner confirms whether they are hiring and for what.
// No real openings are listed. Registered in the repo-root CONTENT-VERIFY.md.

export default function CareersPage() {
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
          until openings are confirmed.
        </Alert>

        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={2}>
          Careers
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          We&apos;re not advertising specific roles right now. If you&apos;d like to be considered
          for a future opening, email{" "}
          <a href={`mailto:${EMAIL}?subject=Expression%20of%20interest`} style={{ fontWeight: 600, color: "inherit" }}>
            {EMAIL}
          </a>{" "}
          or send us a message on WhatsApp.
        </Typography>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsApp />}
            href={waLink("Hi Snaap Connections, I'm interested in working with you.")}
            target="_blank"
            rel="noopener"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Message us on WhatsApp
          </Button>
          <Button
            component="a"
            href={`mailto:${EMAIL}?subject=Expression%20of%20interest`}
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Email us
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
