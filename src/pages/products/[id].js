import Layout from "@/components/Layout";
import { Api } from "@/lib/api";

export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <Layout>
        <div className="p-6">Not found</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg font-semibold text-primary">
          KES {product.discountPrice || product.price}
        </p>
        <p className="mt-4 text-gray-700">
          {product.shortDescription || "No description"}
        </p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await Api.get(`/products/${params.id}`);
    return { props: { product: res.data?.product || null } };
  } catch (e) {
    return { props: { product: null } };
  }
}