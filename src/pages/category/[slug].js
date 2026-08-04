import CatalogueLanding from "@/components/CatalogueLanding";
import { Api } from "@/lib/api";
import { CATEGORY_COPY, slugify } from "@/constants/catalogueCopy";

export default function CategoryLandingPage(props) {
  return <CatalogueLanding type="category" {...props} />;
}

export async function getStaticPaths() {
  // Generate on demand + cache via ISR; unknown slugs 404 in getStaticProps.
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = slugify(params.slug);
  try {
    const catRes = await Api.get("/categories");
    const categories = catRes.data?.categories || catRes.data || [];
    const match = categories.find((c) => slugify(typeof c === "string" ? c : c?.name) === slug);
    if (!match) return { notFound: true, revalidate: 300 };

    const name = typeof match === "string" ? match : match.name;
    const prodRes = await Api.get("/products", { params: { category: name, limit: 48 } });
    const products = prodRes.data?.products || [];
    const total = prodRes.data?.total ?? prodRes.data?.count ?? products.length;

    return {
      props: { name, slug, copy: CATEGORY_COPY[slug]?.intro ? CATEGORY_COPY[slug] : null, products, total },
      revalidate: 600,
    };
  } catch (e) {
    return { notFound: true, revalidate: 60 };
  }
}
