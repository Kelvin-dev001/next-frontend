import Image from "next/image";
import Link from "next/link";
import { Api } from "@/lib/api";

const FALLBACK_IMAGE = "/fallback.png";

export default function ProductDetail({ product }) {
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/products" className="text-blue-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[0] || product.thumbnail || FALLBACK_IMAGE;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {(product.images || [mainImage]).map((img, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-lg overflow-hidden border bg-white flex-shrink-0"
              >
                <Image
                  src={img || FALLBACK_IMAGE}
                  alt={`${product.name} ${idx + 1}`}
                  fill
                  sizes="80px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-4">Category: {product.category}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              KES {product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="line-through text-gray-500">
                KES {product.price}
              </span>
            )}
          </div>

          <p className="text-gray-800 leading-relaxed mb-6">
            {product.shortDescription || product.fullDescription || "No description available."}
          </p>

          <div className="flex gap-3 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
              Add to Cart
            </button>
            <Link
              href="/contact"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg"
            >
              Talk to Sales
            </Link>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div>Availability: {product.inStock ? "In stock" : "Out of stock"}</div>
            {product.warrantyPeriod && <div>Warranty: {product.warrantyPeriod}</div>}
            {product.sku && <div>SKU: {product.sku}</div>}
          </div>
        </div>
      </div>

      {product.fullDescription && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {product.fullDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await Api.get(`/products/${params.id}`);
    return {
      props: { product: res.data?.product || null },
    };
  } catch (e) {
    return { props: { product: null } };
  }
}