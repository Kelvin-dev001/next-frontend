import Head from "next/head";
import Link from "next/link";
import {
  Container, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { SITE_URL, DELIVERY_ZONES, waLink } from "@/constants/business";

const PATH = "/shipping";
const TITLE = "Shipping & Delivery in Kenya | Snaap Connections";
const DESCRIPTION =
  "Delivery rates and times from Snaap Connections: KSh 300 same-day across Mombasa, Kilifi and Kwale; KSh 500–1,500 within 24 hours to Nairobi and Machakos.";

export default function ShippingPage() {
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
          Shipping &amp; Delivery
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          We deliver to five counties. The rates and times below are fixed — the price you see is
          the price you pay. There is no free-delivery threshold and no hidden courier fee.
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
          <Table aria-label="Delivery rates and times by county">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Counties</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Delivery cost</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Delivery time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DELIVERY_ZONES.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.counties.join(", ")}</TableCell>
                  <TableCell>{zone.priceDisplay}</TableCell>
                  <TableCell>{zone.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" color="text.secondary" mb={4}>
          These five counties are the complete list of areas we currently deliver to. Orders are
          placed and confirmed on WhatsApp, where we agree the delivery details with you before
          dispatch.
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<WhatsApp />}
          href={waLink("Hi Snaap Connections, I'd like to ask about delivery to my area.")}
          target="_blank"
          rel="noopener"
          sx={{ mb: 4, textTransform: "none", fontWeight: 700 }}
        >
          Ask about delivery on WhatsApp
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
