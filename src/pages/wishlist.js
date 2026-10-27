import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import ProductGrid from "@/components/ProductGrid";
import useWishlist from "@/hooks/useWishlist";
import { Api } from "@/lib/api";

const TITLE = "Your Wishlist | Snaap Connections";
const DESCRIPTION = "Products you have saved on Snaap Connections.";

/**
 * P10-2. The list lives on this device (see hooks/useWishlist.js), so the page
 * is the same empty shell for everyone in the server HTML and fills in on the
 * phone. It is personal and therefore noindex.
 *
 * Only ids are stored; names, prices and stock come fresh from the API, so a
 * saved product can never show a stale price. Ids the API no longer returns
 * (retired products) are dropped from the list.
 */
export default function WishlistPage() {
  const { ids, remove } = useWishlist();
  const idsKey = ids.join(",");
  // `key` records which list the fetched products belong to, so a change to the
  // list shows the loading state without a synchronous setState in the effect.
  const [result, setResult] = useState({ key: null, products: [], failed: false });

  useEffect(() => {
    if (!idsKey) return;
    let cancelled = false;
    Api.getProducts({ ids: idsKey, limit: idsKey.split(",").length, sort: "newest" })
      .then((res) => {
        if (cancelled) return;
        const wanted = new Set(idsKey.split(","));
        const found = res.data?.products || [];
        // Prune only when the API visibly honoured ?ids= (everything it sent
        // back was asked for). An API that ignored the filter would send other
        // products, and "not found" would then wrongly erase the saved list.
        const honoured = found.every((p) => wanted.has(p._id));
        if (honoured) {
          const foundIds = new Set(found.map((p) => p._id));
          const gone = [...wanted].filter((id) => !foundIds.has(id));
          if (gone.length) remove(gone);
        }
        setResult({ key: idsKey, products: found.filter((p) => wanted.has(p._id)), failed: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ key: idsKey, products: [], failed: true });
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey, remove]);

  // Newest-saved first, matching the order the customer saved them in.
  const products = useMemo(() => {
    const order = new Map(ids.map((id, i) => [id, i]));
    return result.products
      .filter((p) => order.has(p._id))
      .sort((a, b) => order.get(a._id) - order.get(b._id));
  }, [ids, result.products]);

  const loading = Boolean(idsKey) && result.key !== idsKey && !result.failed;
  const count = ids.length;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="mx-auto max-w-screen-2xl px-2 py-6 md:px-6 md:py-10">
        <h1 className="mb-1 px-1.5 text-[1.4rem] font-bold text-brand-700 md:text-[2rem]">Your Wishlist</h1>
        <p className="mb-6 px-1.5 text-sm text-gray-600">
          {count
            ? `${count} saved item${count !== 1 ? "s" : ""}. Saved on this device — tap the heart on any product to add or remove it.`
            : "Saved on this device. Tap the heart on any product to save it here."}
        </p>

        {result.failed && result.key === idsKey ? (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            We couldn&apos;t load your saved products. Check your connection and refresh the page.
          </p>
        ) : count === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-brand-50 px-4 py-12 text-center">
            <FaRegHeart className="mb-3 text-4xl text-brand-700" aria-hidden="true" />
            <p className="mb-4 font-semibold">Your wishlist is empty.</p>
            <Link
              href="/products"
              className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white no-underline hover:bg-brand-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ProductGrid
            items={products}
            loading={loading}
            skeletonCount={Math.min(count, 8)}
            eagerCount={4}
            size="compact"
            showViewBtn
          />
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
