import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import useCart from "@/hooks/useCart";
import { Api } from "@/lib/api";
import { formatKES, MAX_QTY_PER_PRODUCT } from "@/constants/business";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";

const TITLE = "Your Cart | Snaap Connections";

/**
 * P10-3. The cart is on this device; prices are not. Every render of this page
 * asks the API to price the cart from the catalogue, so a price change, a
 * sold-out phone or a retired product shows here — before checkout, not after
 * the customer has paid.
 */
export default function CartPage() {
  const cart = useCart();
  const { lines, refreshSnapshots } = cart;
  const itemsKey = lines.map((l) => `${l.id}:${l.qty}`).join(",");
  const [quote, setQuote] = useState({ key: null, data: null, failed: false });

  useEffect(() => {
    if (!itemsKey) return undefined;
    let cancelled = false;
    const t = setTimeout(() => {
      const items = itemsKey.split(",").map((s) => {
        const [productId, qty] = s.split(":");
        return { productId, quantity: Number(qty) };
      });
      Api.quoteOrder({ items })
        .then((res) => {
          if (cancelled) return;
          setQuote({ key: itemsKey, data: res.data, failed: false });
          refreshSnapshots(res.data?.lines);
        })
        .catch(() => { if (!cancelled) setQuote({ key: itemsKey, data: null, failed: true }); });
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [itemsKey, refreshSnapshots]);

  const current = quote.key === itemsKey ? quote.data : null;
  const problems = useMemo(
    () => new Map((current?.lineErrors || []).map((e) => [e.productId, e.message])),
    [current]
  );
  const checking = Boolean(itemsKey) && quote.key !== itemsKey && !quote.failed;
  const subtotal = current?.totals?.subtotal ?? lines.reduce((s, l) => s + l.price * l.qty, 0);
  const canCheckout = lines.length > 0 && current && problems.size === 0 && !(current.errors || []).length;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content="Review the products in your cart before checkout." />
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="mx-auto max-w-[1000px] px-3 py-6 md:px-6 md:py-10">
        <h1 className="mb-4 text-[1.4rem] font-bold text-brand-700 md:text-[2rem]">Your Cart</h1>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl bg-brand-50 px-4 py-12 text-center">
            <FaShoppingBag className="mb-3 text-4xl text-brand-700" aria-hidden="true" />
            <p className="mb-4 font-semibold">Your cart is empty.</p>
            <Link href="/products" className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white no-underline hover:bg-brand-700">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-[1fr_320px]">
            <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white" aria-label="Items in your cart">
              {lines.map((line) => {
                const problem = problems.get(line.id);
                const img = getOptimizedCloudinaryUrl(line.image, { width: 160 }) || "/fallback.png";
                return (
                  <li key={line.id} className="flex gap-3 p-3 md:p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-lg bg-brand-50 object-contain" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${line.id}`} prefetch={false} className="line-clamp-2 font-semibold text-gray-900 hover:underline">
                        {line.name || "Product"}
                      </Link>
                      <p className="text-sm text-gray-600">{formatKES(line.price)} each</p>
                      {problem && <p role="alert" className="mt-1 text-sm font-semibold text-red-700">{problem}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Qty</span>
                          <select
                            value={line.qty}
                            onChange={(e) => cart.setQty(line.id, e.target.value)}
                            className="rounded border border-gray-300 bg-white px-2 py-1"
                            aria-label={`Quantity of ${line.name}`}
                          >
                            {Array.from({ length: MAX_QTY_PER_PRODUCT }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          onClick={() => cart.remove(line.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                          aria-label={`Remove ${line.name} from cart`}
                        >
                          <FaTrashAlt aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 font-bold text-gray-900">{formatKES(line.price * line.qty)}</p>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 md:sticky md:top-24" aria-label="Order summary">
              <h2 className="mb-3 text-lg font-bold">Summary</h2>
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart.count} item{cart.count !== 1 ? "s" : ""})</span>
                <span className="font-semibold">{formatKES(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Delivery is worked out at checkout. Pickup from our shop has no delivery fee.</p>
              <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                {checking && <p className="mt-2 text-gray-600">Checking prices…</p>}
                {quote.failed && quote.key === itemsKey && (
                  <p className="mt-2 text-red-700">We couldn&apos;t check your cart. Check your connection and refresh.</p>
                )}
                {problems.size > 0 && (
                  <p className="mt-2 font-semibold text-red-700">Remove the items marked above to continue.</p>
                )}
              </div>
              {canCheckout ? (
                <Link
                  href="/checkout"
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-brand-600 py-3 font-semibold text-white no-underline hover:bg-brand-700"
                >
                  Checkout
                </Link>
              ) : (
                <span aria-disabled="true" className="mt-3 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-gray-300 py-3 font-semibold text-gray-700">
                  Checkout
                </span>
              )}
              <Link href="/products" className="mt-3 block text-center text-sm font-semibold text-brand-700 hover:underline">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
