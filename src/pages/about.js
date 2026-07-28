import Head from "next/head";
import Link from "next/link";
import { Container, Typography, Button, Stack, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import {
  SITE_URL, BUSINESS_NAME, ADDRESS, HOURS_DISPLAY, DELIVERY_ZONES, waLink,
} from "@/constants/business";

const PATH = "/about";
const TITLE = "About Snaap Connections | Phone Shop in Mombasa";
const DESCRIPTION =
  "Snaap Connections is a smartphone and accessories shop on Digo Rd, Opp Baroda Mall, Mombasa, delivering to five counties across Kenya. Order on WhatsApp.";

export default function AboutPage() {
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
        <Typography variant="h4" component="h1" fontWeight={800} color="primary.main" mb={2}>
          About {BUSINESS_NAME}
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          {BUSINESS_NAME} is a smartphone and accessories retailer based in Mombasa, with a
          physical shop at {ADDRESS.full}. We sell the latest phones, tablets, laptops, earbuds,
          power banks and accessories, and deliver across five counties in Kenya.
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Ordering is simple: browse the catalogue, then send us the item on WhatsApp. We confirm
          availability, the price and the delivery details with you before anything is dispatched —
          WhatsApp is our checkout, and it&apos;s where you&apos;ll always reach a real person.
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3, color: "text.secondary", "& li": { mb: 1 } }}>
          <li>
            Delivery to {DELIVERY_ZONES.flatMap((z) => z.counties).join(", ")} — see{" "}
            <Link href="/shipping" style={{ fontWeight: 600 }}>shipping &amp; delivery</Link> for
            rates and times.
          </li>
          <li>Open {HOURS_DISPLAY}.</li>
          <li>Selected phones are available on Lipa Mdogo Mdogo — terms vary by phone and are shown on each product page.</li>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Browse all products
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsApp />}
            href={waLink("Hi Snaap Connections, I'd like to know more.")}
            target="_blank"
            rel="noopener"
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Talk to us on WhatsApp
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          <Link href="/contact" style={{ fontWeight: 600 }}>Contact us</Link>
          {"  ·  "}
          <Link href="/faqs" style={{ fontWeight: 600 }}>FAQs</Link>
        </Typography>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
