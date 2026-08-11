import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp, FaTruck, FaClock, FaMapMarkerAlt, FaChevronDown, FaStore } from "react-icons/fa";
import { Api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import { LOCATIONS, LOCATION_SLUGS } from "@/constants/locations";
import {
  BUSINESS_NAME, SITE_URL, ADDRESS, HOURS_DISPLAY, PHONE_E164, EMAIL,
  OPENING_HOURS_SPEC, SAME_AS, deliveryForCounty, waLink,
} from "@/constants/business";

const OG_IMAGE = `${SITE_URL}/snaap-logo.jpeg`;

export default function LocationPage({ loc, zone, products = [] }) {
  if (!loc) return null;

  const path = `/locations/${loc.slug}`;
  const url = `${SITE_URL}${path}`;

  // Delivery cost + time come from business.js (single source), never hardcoded here.
  const deliveryFaqs = zone
    ? [
        {
          q: `How much is delivery to ${loc.county}?`,
          a: `Delivery to ${loc.county} is ${zone.priceDisplay}. There is no free-delivery threshold — the price you see is the price you pay.`,
        },
        {
          q: `How long does delivery to ${loc.county} take?`,
          a: `${zone.time}. We confirm the timing with you on WhatsApp when you order.`,
        },
      ]
    : [];
  const faqs = [...deliveryFaqs, ...(loc.localFaqs || [])];

  const waMessage = loc.isShop
    ? `Hi Snaap Connections, I'd like to ask about a phone at your Mombasa shop.`
    : `Hi Snaap Connections, I'd like to order a phone for delivery to ${loc.county}.`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: loc.county, item: url },
    ],
  };

  // Only the Mombasa page describes a real physical location. Delivery counties
  // must NOT claim a shop they don't have.
  const storeJsonLd = loc.isShop
    ? {
        "@context": "https://schema.org",
        "@type": "MobilePhoneStore",
        "@id": `${SITE_URL}/#store`,
        name: BUSINESS_NAME,
        url,
        image: OG_IMAGE,
        telephone: PHONE_E164,
        email: EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: ADDRESS.street,
          addressLocality: ADDRESS.locality,
          addressRegion: ADDRESS.region,
          addressCountry: ADDRESS.country,
        },
        areaServed: loc.county,
        openingHoursSpecification: OPENING_HOURS_SPEC,
        sameAs: SAME_AS,
      }
    : null;

  return (
    <>
      <Head>
        <title>{loc.titleSeo}</title>
        <meta name="description" content={loc.metaDescription} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={loc.titleSeo} />
        <meta property="og:description" content={loc.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={BUSINESS_NAME} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={loc.titleSeo} />
        <meta name="twitter:description" content={loc.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {storeJsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
        )}
      </Head>

      <div className="mx-auto max-w-[1000px] px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-[0.8rem] text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-900">{loc.county}</span>
        </nav>

        <h1 className="mb-3 text-[1.9rem] font-extrabold leading-tight text-brand-700 md:text-[2.4rem]">
          {loc.h1}
        </h1>
        {loc.introParas.map((p, i) => (
          <p key={i} className="mb-3 max-w-[760px] text-gray-600">{p}</p>
        ))}

        {/* Delivery / shop fact box */}
        <div className="my-6 grid gap-3 sm:grid-cols-2">
          {zone && (
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="flex items-center gap-2 font-bold text-brand-700">
                <FaTruck aria-hidden="true" /> Delivery to {loc.county}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">{zone.priceDisplay}</span> · {zone.time}
              </p>
              <p className="mt-1 text-[0.82rem] text-gray-500">No free-delivery threshold — the price you see is the price you pay.</p>
            </div>
          )}
          {loc.isShop ? (
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="flex items-center gap-2 font-bold text-brand-700">
                <FaStore aria-hidden="true" /> Visit the shop
              </p>
              <p className="mt-1 flex items-start gap-2 text-gray-700">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-brand-300" aria-hidden="true" /> {ADDRESS.full}
              </p>
              <p className="mt-1 flex items-center gap-2 text-gray-700">
                <FaClock className="flex-shrink-0 text-brand-300" aria-hidden="true" /> {HOURS_DISPLAY}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="flex items-center gap-2 font-bold text-brand-700">
                <FaWhatsapp aria-hidden="true" /> How to order
              </p>
              <p className="mt-1 text-gray-700">
                Browse a phone, tap WhatsApp, and we confirm price and delivery with you before dispatch.
              </p>
              {loc.towns?.length > 0 && (
                <p className="mt-1 text-[0.82rem] text-gray-500">Covering {loc.towns.slice(0, 4).join(", ")} and more.</p>
              )}
            </div>
          )}
        </div>

        <a
          href={waLink(waMessage)}
          target="_blank"
          rel="noopener"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-lg" /> {loc.isShop ? "Message the Mombasa shop" : `Order on WhatsApp for ${loc.county}`}
        </a>

        {/* Areas covered */}
        {loc.towns?.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-2 text-[1.15rem] font-bold text-brand-700">
              {loc.isShop ? `Areas in ${loc.county}` : `Areas we deliver to in ${loc.county}`}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {loc.towns.map((t) => (
                <li key={t} className="rounded-full bg-brand-50 px-3 py-1 text-[0.85rem] text-brand-700">{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Relevant stock */}
        {products.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-[1.15rem] font-bold text-brand-700">Popular phones we deliver to {loc.county}</h2>
            <ProductGrid items={products} eagerCount={4} size="compact" showWhatsApp showViewBtn />
          </div>
        )}

        {/* Local FAQ */}
        {faqs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-[1.15rem] font-bold text-brand-700">
              {loc.county} delivery — questions
            </h2>
            {faqs.map((item, idx) => (
              <details key={idx} className="group mb-2 rounded-lg border border-gray-200">
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 font-semibold marker:content-none">
                  {item.q}
                  <FaChevronDown className="flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="px-4 pb-4 text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
        )}

        {/* Internal links */}
        <p className="text-sm text-gray-500">
          <Link href="/products" className="font-semibold">Browse all products</Link>
          {"  ·  "}
          <Link href="/shipping" className="font-semibold">Full delivery matrix</Link>
          {"  ·  "}
          <Link href="/faqs" className="font-semibold">FAQs</Link>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Other areas:{" "}
          {LOCATION_SLUGS.filter((s) => s !== loc.slug).map((s, i, arr) => (
            <span key={s}>
              <Link href={`/locations/${s}`} className="font-semibold capitalize">{LOCATIONS[s].county}</Link>
              {i < arr.length - 1 ? "  ·  " : ""}
            </span>
          ))}
        </p>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: LOCATION_SLUGS.map((county) => ({ params: { county } })),
    fallback: false, // five counties only — never a sixth
  };
}

export async function getStaticProps({ params }) {
  const loc = LOCATIONS[params.county] || null;
  if (!loc) return { notFound: true };

  const zone = deliveryForCounty(loc.county);

  let products = [];
  try {
    const res = await Api.get("/products", { params: { featured: true, limit: 8 } });
    products = res.data?.products || [];
  } catch {
    products = [];
  }

  return { props: { loc, zone: zone || null, products }, revalidate: 600 };
}
