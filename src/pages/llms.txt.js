import {
  BUSINESS_NAME, SITE_URL, ADDRESS, PHONE_DISPLAY, EMAIL, HOURS_DISPLAY, DELIVERY_ZONES, MPESA_TILL,
  deliveryIsToBeConfirmed,
} from "@/constants/business";

// /llms.txt — a plain-text brief for AI crawlers (P5). Built entirely from the
// business.js single source of truth so the facts can't drift from the site.
function buildLlmsTxt() {
  const delivery = DELIVERY_ZONES.map(
    (z) =>
      `- ${z.counties.join(", ")} (${z.label}): ${z.priceDisplay}, ${z.time.toLowerCase()}.` +
      (deliveryIsToBeConfirmed(z) ? " The exact fee is confirmed by phone and paid separately from the items." : "")
  ).join("\n");

  return `# ${BUSINESS_NAME}

Online smartphone and accessories retailer with a physical shop in Mombasa, Kenya.
Orders are placed on the website (cart and checkout) and paid with M-Pesa.
WhatsApp is for questions and support.

## Contact
- Address: ${ADDRESS.full}
- WhatsApp / phone: ${PHONE_DISPLAY}
- Email: ${EMAIL}
- Hours: ${HOURS_DISPLAY}
- Website: ${SITE_URL}

## What we sell
Smartphones, tablets, laptops, earbuds and earphones, power banks, chargers,
speakers and phone accessories. Brands include Samsung, Tecno, Infinix,
Redmi/Xiaomi, Oppo, Vivo, Realme, Itel, Nokia, Oraimo, HP, Dell and Lenovo.

## Delivery (these five counties only — no others)
${delivery}
There is no free-delivery threshold at any order value.
Pickup from the Mombasa shop is also available.

## Payment & financing
Payment is M-Pesa Buy Goods, Till ${MPESA_TILL}. Customers enter the M-Pesa
confirmation code at checkout or afterwards on ${SITE_URL}/track-order; the shop
checks each code before an order counts as paid. Lipa Mdogo Mdogo (Safaricom device financing) is
available on selected phones; the terms vary by device and are shown on each
product's page. There is no single deposit or instalment figure.

## Key pages
- Products: ${SITE_URL}/products
- Shipping & delivery: ${SITE_URL}/shipping
- FAQs: ${SITE_URL}/faqs
- Contact: ${SITE_URL}/contact
- Locations: ${SITE_URL}/locations/mombasa, /locations/kilifi, /locations/kwale, /locations/nairobi, /locations/machakos
`;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.write(buildLlmsTxt());
  res.end();
  return { props: {} };
}

export default function LlmsTxt() {
  return null;
}
