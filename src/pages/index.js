import dynamic from "next/dynamic";
import Head from "next/head";
import { Api } from "@/lib/api";

const ProductAdvisorBot = dynamic(() => import("@/components/ProductAdvisorBot"), { ssr: false });

import PromoCardsSection from "@/components/PromoCardsSection";
import SafaricomCorner from "@/components/SafaricomCorner";
import ShopByBrandSection from "@/components/ShopByBrandSection";
import ShopByCategorySection from "@/components/ShopByCategorySection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import PocketFriendlySection from "@/components/PocketFriendlySection";
import DealsSection from "@/components/DealsSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhatsAppCTASection from "@/components/WhatsAppCTASection";

const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";
const PAGE_TITLE = "Buy Phones in Mombasa & Kenya | Snaap Connections";
const PAGE_DESCRIPTION =
  "Shop the latest smartphones, accessories, and deals in Mombasa with fast nationwide delivery across Kenya.";

export default function Home({ featured, newArrivals, brands, categories, recentReviews, sections }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "mobilephoneStore",
    name: SITE_NAME,
    url: SITE_URL,
    description: PAGE_DESCRIPTION,
    areaServed: ["Mombasa", "Kenya"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mombasa",
      addressCountry: "KE",
    },
    telephone: "+254117000900",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </Head>

      {/* 1. Promo Cards */}
      <PromoCardsSection />

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

      {/* 8. Pocket Friendly Picks */}
      <PocketFriendlySection />

      {/* 9. Reviews */}
      <ReviewsSection reviews={recentReviews} isHomepage />

      {/* 10. WhatsApp CTA */}
      <WhatsAppCTASection />

      {/* 11. AI Bot */}
      <ProductAdvisorBot />
    </>
  );
}

export async function getStaticProps() {
  try {
    const [featuredRes, allRes, categoriesRes, brandsRes, reviewsRes, sectionsRes] = await Promise.all([
      Api.get("/products", { params: { featured: true, limit: 16 } }),
      Api.get("/products", { params: { limit: 120 } }),
      Api.get("/categories"),
      Api.get("/brands"),
      Api.get("/reviews/recent"),
      Api.get("/homepage-sections"),
    ]);

    const shuffle = (arr = []) => [...arr].sort(() => 0.5 - Math.random());
    const featured = shuffle(featuredRes.data?.products || []);
    const newArrivals = shuffle(allRes.data?.products || []).slice(0, 48);

    return {
      props: {
        featured,
        newArrivals,
        categories: categoriesRes.data?.categories || categoriesRes.data || [],
        brands: brandsRes.data?.brands || brandsRes.data || [],
        recentReviews: reviewsRes.data?.reviews || [],
        sections: sectionsRes.data || [],
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Home data error", e);
    return {
      props: { featured: [], newArrivals: [], categories: [], brands: [], recentReviews: [], sections: [] },
      revalidate: 30,
    };
  }
}