import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { Api } from '@/lib/api';

const ProductAdvisorBot = dynamic(() => import('@/components/ProductAdvisorBot'), { ssr: false });

// TODO: import your real sections:
import HeroBannerSlider from '@/components/HeroBannerSlider';
import ShopByBrandSection from '@/components/ShopByBrandSection';
import ShopByCategorySection from '@/components/ShopByCategorySection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import PocketFriendlySection from '@/components/PocketFriendlySection';
import DealsSection from '@/components/DealsSection';
import ReviewsSection from '@/components/ReviewsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import WhatsAppCTASection from '@/components/WhatsAppCTASection';

export default function Home({ featured, newArrivals, brands, categories, recentReviews }) {
  return (
    <Layout>
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
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const [featuredRes, allRes, categoriesRes, brandsRes, reviewsRes] = await Promise.all([
      Api.getFeaturedProducts(),
      Api.getProducts('?limit=120'),
      Api.getCategories(),
      Api.getBrands(),
      Api.getRecentReviews(),
    ]);

    // Shuffle helpers
    const shuffle = (arr) => arr ? [...arr].sort(() => 0.5 - Math.random()) : [];
    const featured = shuffle(featuredRes.products || []);
    const newArrivals = shuffle(allRes.products || []).slice(0, 48);

    return {
      props: {
        featured,
        newArrivals,
        categories: categoriesRes?.categories || categoriesRes || [],
        brands: brandsRes?.brands || brandsRes || [],
        recentReviews: reviewsRes?.reviews || [],
      },
      revalidate: 60, // ISR: rebuild every 60s
    };
  } catch (e) {
    console.error('Home data error', e);
    return { props: { featured: [], newArrivals: [], categories: [], brands: [], recentReviews: [] }, revalidate: 30 };
  }
}