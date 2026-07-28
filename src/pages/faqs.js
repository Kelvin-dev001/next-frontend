import Head from "next/head";
import Link from "next/link";
import {
  Container, Typography, Button,
  Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, ADDRESS, HOURS_DISPLAY, DELIVERY_ZONES, waLink } from "@/constants/business";

const PATH = "/faqs";
const TITLE = "FAQs | Snaap Connections — Ordering, Delivery & Payment";
const DESCRIPTION =
  "How to order on WhatsApp, delivery cost and time by county, opening hours, payment options and how Lipa Mdogo Mdogo works at Snaap Connections.";

const coast = DELIVERY_ZONES.find((z) => z.id === "coast");
const upcountry = DELIVERY_ZONES.find((z) => z.id === "upcountry");

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse the products you want, then tap the WhatsApp button to send us your order. WhatsApp is our checkout — we confirm availability, price and delivery with you before anything is dispatched.",
  },
  {
    q: "How much is delivery and how long does it take?",
    a: `${coast.counties.join(", ")}: ${coast.priceDisplay}, ${coast.time.toLowerCase()}. ${upcountry.counties.join(", ")}: ${upcountry.priceDisplay}, ${upcountry.time.toLowerCase()}. There is no free-delivery threshold.`,
  },
  {
    q: "Which areas do you deliver to?",
    a: `Those five counties — ${[...coast.counties, ...upcountry.counties].join(", ")}. We do not currently deliver outside them.`,
  },
  {
    q: "What are your opening hours?",
    a: `${HOURS_DISPLAY}. You can message us on WhatsApp any time and we'll reply during opening hours.`,
  },
  {
    q: "Where are you located?",
    a: `${ADDRESS.full}. You're welcome to visit the shop.`,
  },
  {
    q: "How can I pay?",
    a: "You place the order on WhatsApp and pay directly — M-Pesa (Lipa Na Mpesa) is supported. We agree the payment method with you when you order.",
  },
  {
    q: "Do your products come with a warranty?",
    a: "Warranty varies by product and is shown on that product's own page. Check the product details, or ask us on WhatsApp before you buy.",
  },
  {
    q: "What is Lipa Mdogo Mdogo and can I use it?",
    a: "Lipa Mdogo Mdogo (pay in small amounts) is available on selected phones. The terms are different for each phone and are listed in that product's description — there is no single deposit or instalment figure. Message us on WhatsApp about the specific phone you want and we'll walk you through its terms.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Return terms vary by product and are shown on the product page. To start a return, message us on WhatsApp.",
  },
];

export default function FaqsPage() {
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
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Short, honest answers. If yours isn&apos;t here, ask us on WhatsApp.
        </Typography>

        {faqs.map((item, idx) => (
          <Accordion key={idx} disableGutters sx={{ mb: 1.5, borderRadius: 2, "&:before": { display: "none" } }} variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsApp />}
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          sx={{ mt: 4, mb: 3, textTransform: "none", fontWeight: 700 }}
        >
          Ask us on WhatsApp
        </Button>

        <Typography variant="body2" color="text.secondary">
          <Link href="/products" style={{ fontWeight: 600 }}>Browse all products</Link>
          {"  ·  "}
          <Link href="/shipping" style={{ fontWeight: 600 }}>Delivery information</Link>
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
