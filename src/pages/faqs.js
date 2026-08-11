import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp, FaChevronDown } from "react-icons/fa";
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

// P2-SEO3: FAQPage schema built from the same Q&As rendered below (Google requires them to match).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </Head>

      <div className="mx-auto max-w-[900px] px-4 py-10 md:py-16">
        <h1 className="mb-2 text-[2.125rem] font-extrabold leading-tight text-brand-700">
          Frequently Asked Questions
        </h1>
        <p className="mb-8 text-gray-500">
          Short, honest answers. If yours isn&apos;t here, ask us on WhatsApp.
        </p>

        {faqs.map((item, idx) => (
          <details key={idx} className="group mb-3 rounded-lg border border-gray-200">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 font-semibold marker:content-none">
              {item.q}
              <FaChevronDown className="flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-gray-500">{item.a}</div>
          </details>
        ))}

        <a
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          className="mb-3 mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-lg" /> Ask us on WhatsApp
        </a>

        <p className="text-sm text-gray-500">
          <Link href="/products" className="font-semibold">Browse all products</Link>
          {"  ·  "}
          <Link href="/shipping" className="font-semibold">Delivery information</Link>
          {"  ·  "}
          <Link href="/contact" className="font-semibold">Contact us</Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
