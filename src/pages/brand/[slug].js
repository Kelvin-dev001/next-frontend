import CatalogueLanding from "@/components/CatalogueLanding";
import { Api } from "@/lib/api";
import { BRAND_COPY, slugify } from "@/constants/catalogueCopy";

export default function BrandLandingPage(props) {
  return <CatalogueLanding type="brand" {...props} />;
}

export async function getStaticPaths() {
  // Generate on demand + cache via ISR; unknown slugs 404 in getStaticProps.
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = slugify(params.slug);
  try {
    const brandRes = await Api.get("/brands");
    const brands = brandRes.data?.brands || brandRes.data || [];
    const match = brands.find((b) => slugify(typeof b === "string" ? b : b?.name) === slug);
    if (!match) return { notFound: true, revalidate: 300 };

    const name = typeof match === "string" ? match : match.name;
    const prodRes = await Api.get("/products", { params: { brand: name, limit: 48 } });
    const products = prodRes.data?.products || [];
    const total = prodRes.data?.total ?? prodRes.data?.count ?? products.length;

    return {
      props: { name, slug, copy: BRAND_COPY[slug]?.intro ? BRAND_COPY[slug] : null, products, total },
      revalidate: 600,
    };
  } catch (e) {
    return { notFound: true, revalidate: 60 };
  }
}
