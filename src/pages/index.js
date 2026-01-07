import dynamic from "next/dynamic";
import { Api } from "@/lib/api";

const ProductAdvisorBot = dynamic(() => import("@/components/ProductAdvisorBot"), { ssr: false });

import HeroBannerSlider from "@/components/HeroBannerSlider";
import ShopByBrandSection from "@/components/ShopByBrandSection";
import ShopByCategorySection from "@/components/ShopByCategorySection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import PocketFriendlySection from "@/components/PocketFriendlySection";
import DealsSection from "@/components/DealsSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import WhatsAppCTASection from "@/components/WhatsAppCTASection";

export default function Home({ featured, newArrivals, brands, categories, recentReviews }) {
  return (
    <>
      <HeroBannerSlider />
      <ShopByBrandSection brands={brands} />
      <ShopByCategorySection categories={categories} />
      <FeaturedProductsSection products={featured} />
      <PocketFriendlySection />
      <DealsSection />
      <NewArrivalsSection products={newArrivals} title="Hot Selling Smartphones in Kenya" />
      <ReviewsSection reviews={recentReviews} isHomepage />
      <WhyChooseUsSection />
      <WhatsAppCTASection />
      <ProductAdvisorBot />
    </>
  );
}

export async function getStaticProps() {
  try {
    const [featuredRes, allRes, categoriesRes, brandsRes, reviewsRes] = await Promise.all([
      Api.get("/products", { params: { featured: true, limit: 16 } }), // limit for faster first paint
      Api.get("/products", { params: { limit: 120 } }),
      Api.get("/categories"),
      Api.get("/brands"),
      Api.get("/reviews/recent"),
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
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Home data error", e);
    return {
      props: { featured: [], newArrivals: [], categories: [], brands: [], recentReviews: [] },
      revalidate: 30,
    };
  }
}