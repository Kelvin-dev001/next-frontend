import Head from "next/head";
import { Api } from "@/lib/api";
import { filterActiveSections, hasActiveAnnouncement, getSection } from "@/utils/sections";
import { toCardProducts } from "@/utils/productCard";
import {
  BUSINESS_NAME as SITE_NAME,
  SITE_URL,
  PHONE_E164,
  EMAIL,
  ADDRESS,
  OPENING_HOURS_SPEC,
  SAME_AS,
  SERVED_COUNTIES,
} from "@/constants/business";

import HeroSlider from "@/components/HeroSlider";
import PromoCardsSection from "@/components/PromoCardsSection";
import SafaricomCorner from "@/components/SafaricomCorner";
import LipaMdogoMdogoSection from "@/components/LipaMdogoMdogoSection";
import ShopByBrandSection from "@/components/ShopByBrandSection";
import ShopByCategorySection from "@/components/ShopByCategorySection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import PocketFriendlySection, {
  POCKET_FRIENDLY_LIMIT,
  POCKET_FRIENDLY_MAX_PRICE,
} from "@/components/PocketFriendlySection";
import DealsSection from "@/components/DealsSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhatsAppCTASection from "@/components/WhatsAppCTASection";

const PAGE_TITLE = "Buy Phones in Mombasa & Kenya | Snaap Connections";
const PAGE_DESCRIPTION =
  "Shop the latest smartphones, accessories, and deals in Mombasa with fast nationwide delivery across Kenya.";

export default function Home({ featured, newArrivals, brands, categories, recentReviews, sections, lipaProducts = [], pocketFriendly = [] }) {
  // Exactly one homepage <h1>: an active announcement card owns it; otherwise the
  // evergreen heading below does. Never both, never neither (P3).
  const showAnnouncement = hasActiveAnnouncement(sections, "promo_cards");

  // The mid-page slider replaces the WhatsApp CTA block — but only once the
  // owner has actually uploaded banners. Until then the CTA stays, so shipping
  // this doesn't leave a hole on the live page while content is being entered.
  const hasMidSlides = (getSection(sections, "hero_slider_mid")?.items || []).some((s) => s?.image);

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/snaap-logo.jpeg`,
    logo: `${SITE_URL}/snaap-logo.jpeg`,
    description: PAGE_DESCRIPTION,
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    areaServed: [...SERVED_COUNTIES, "Kenya"],
    openingHoursSpecification: OPENING_HOURS_SPEC,
    currenciesAccepted: "KES",
    paymentAccepted: "M-Pesa",
    sameAs: SAME_AS,
    // No `geo`: the Google Business Profile pin is unverified and a wrong pin is
    // worse than none (constants/business.js GEO = null).
  };

  // P2-SEO3: WebSite schema + SearchAction (enables the sitelinks searchbox).
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </Head>

      {/* Admin-managed banner carousel, up to 5 slides. First in the page, so
          its first slide is the LCP element — hence priority. */}
      <HeroSlider sections={sections} sectionKey="hero_slider_top" priority />

      {/* Homepage heading. Exactly one <h1>: the evergreen heading here, UNLESS a
          scheduled announcement card is live — then that card owns the <h1> (P3).

          The trust bullets that used to sit here (same-day delivery / order on
          WhatsApp / opening hours) moved into TopInfoMarquee in P8, which shows
          the same three facts on every page. Repeating them here would have put
          the identical sentence twice on one screen. */}
      <section className="pt-2 md:pb-1 md:pt-3">
        <div className="mx-auto max-w-screen-2xl px-4">
          {!showAnnouncement && (
            <>
              <h1 className="font-extrabold leading-tight text-brand-700 text-[1.5rem] md:text-[2.1rem]">
                Buy Smartphones &amp; Accessories in Mombasa, Kenya
              </h1>
              <p className="mt-1 max-w-[720px] text-gray-500 text-[0.9rem] md:text-[1.05rem]">
                The latest phones, tablets, audio and accessories with fast delivery across our five
                served counties. Order on WhatsApp.
              </p>
            </>
          )}
        </div>
      </section>

      {/* 1. Promo Cards (admin-managed, server-filtered for scheduling) */}
      <PromoCardsSection sections={sections} renderAnnouncementHeading={showAnnouncement} />

      {/* 2. Deal of the Day / Flash Sale / Limited Offer */}
      <DealsSection />

      {/* 3. Hot Selling Smartphones in Kenya */}
      <NewArrivalsSection products={newArrivals} title="Hot Selling Gadgets in Kenya" />

      {/* 4. Featured Products */}
      <FeaturedProductsSection products={featured} />

      {/* 5. Shop by Brand */}
      <ShopByBrandSection brands={brands} />

      {/* 6. Shop by Category */}
      <ShopByCategorySection categories={categories} />

      {/* 7. Safaricom Corner */}
      <SafaricomCorner sections={sections} />

      {/* 7b. Lipa Mdogo Mdogo — admin-managed section + products flagged eligible */}
      <LipaMdogoMdogoSection sections={sections} products={lipaProducts} />

      {/* 8. Pocket Friendly Picks */}
      <PocketFriendlySection products={pocketFriendly} />

      {/* 9. Reviews */}
      <ReviewsSection reviews={recentReviews} isHomepage />

      {/* 10. Second banner carousel, or the WhatsApp CTA until slides exist */}
      {hasMidSlides ? (
        <HeroSlider sections={sections} sectionKey="hero_slider_mid" />
      ) : (
        <WhatsAppCTASection />
      )}
    </>
  );
}

export async function getStaticProps() {
  try {
    const [featuredRes, allRes, categoriesRes, brandsRes, reviewsRes, sectionsRes, lipaRes, pocketRes] =
      await Promise.all([
        // P8: 16 -> 32 so "See more" has a second page on a desktop grid.
        Api.get("/products", { params: { featured: true, limit: 32 } }),
        Api.get("/products", { params: { limit: 48 } }), // P2-P2: was 120 to show 48
        Api.get("/categories"),
        Api.get("/brands"),
        Api.get("/reviews/recent"),
        Api.get("/homepage-sections"),
        Api.get("/products", { params: { lipaMdogoMdogoEligible: true, limit: 12 } }),
        // P8: was fetched client-side in PocketFriendlySection, so none of these
        // products reached the served HTML.
        Api.get("/products", {
          params: {
            maxPrice: POCKET_FRIENDLY_MAX_PRICE,
            limit: POCKET_FRIENDLY_LIMIT,
            sort: "price_asc",
          },
        }),
      ]);

    const shuffle = (arr = []) => [...arr].sort(() => 0.5 - Math.random());

    // Every list is trimmed to the fields ProductCard reads. The homepage ships
    // its products twice (HTML + __NEXT_DATA__), and full documents carry
    // descriptions, image arrays and timestamps no card ever renders.
    return {
      props: {
        featured: toCardProducts(shuffle(featuredRes.data?.products || [])),
        newArrivals: toCardProducts(shuffle(allRes.data?.products || []).slice(0, 48)),
        categories: categoriesRes.data?.categories || categoriesRes.data || [],
        brands: brandsRes.data?.brands || brandsRes.data || [],
        recentReviews: reviewsRes.data?.reviews || [],
        sections: filterActiveSections(sectionsRes.data || []),
        lipaProducts: toCardProducts(lipaRes.data?.products || []),
        pocketFriendly: toCardProducts(pocketRes.data?.products || []),
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Home data error", e);
    return {
      props: { featured: [], newArrivals: [], categories: [], brands: [], recentReviews: [], sections: [], lipaProducts: [], pocketFriendly: [] },
      revalidate: 30,
    };
  }
}