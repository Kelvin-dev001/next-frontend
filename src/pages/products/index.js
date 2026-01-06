import { Api } from "@/lib/api";

export default function Products({ products }) {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id || p.id} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="text-sm font-semibold">{p.name}</div>
            <div className="text-primary font-bold">KES {p.price}</div>
          </div>
        ))}
      </div>
    </div>
  ); 
}

export async function getServerSideProps() {
  try {
    const res = await Api.get("/products", { params: { limit: 60 } });
    return { props: { products: res.data?.products || [] } };
  } catch (e) {
    return { props: { products: [] } };
  }
}