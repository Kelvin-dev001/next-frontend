import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useSyncExternalStore } from "react";
import { FaCheckCircle } from "react-icons/fa";
import OrderView from "@/components/checkout/OrderView";
import { readLastOrder } from "@/lib/lastOrder";

const noopSubscribe = () => () => {};

/**
 * P10-3. Shown once, straight after checkout. The order comes from this tab's
 * sessionStorage (lib/lastOrder.js); opened anywhere else, the page points to
 * order tracking instead of showing anything.
 */
export default function ThankYouPage() {
  const router = useRouter();
  const orderNumber = typeof router.query.order === "string" ? router.query.order : "";
  // Read after hydration only: the server has no sessionStorage.
  const saved = useSyncExternalStore(
    noopSubscribe,
    () => (orderNumber ? JSON.stringify(readLastOrder(orderNumber)) : "null"),
    () => "null"
  );
  const initial = JSON.parse(saved);
  const [updated, setUpdated] = useState(null);
  const order = updated && updated.orderNumber === orderNumber ? updated : initial?.order;

  return (
    <>
      <Head>
        <title>Order received | Snaap Connections</title>
        <meta name="description" content="Your order has been received." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="mx-auto max-w-[760px] px-3 py-6 md:px-6 md:py-10">
        {order ? (
          <>
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-green-900">
              <FaCheckCircle className="mt-1 shrink-0 text-2xl" aria-hidden="true" />
              <div>
                <h1 className="text-xl font-bold md:text-2xl">Thank you, we&apos;ve received your order</h1>
                <p className="text-sm">
                  Keep your order number. You can check it any time on{" "}
                  <Link href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`} className="font-semibold underline">Track your order</Link>.
                </p>
              </div>
            </div>
            <OrderView order={order} phone={initial?.phone} onUpdated={setUpdated} />
          </>
        ) : (
          <div className="rounded-2xl bg-brand-50 p-6 text-center">
            <h1 className="mb-2 text-xl font-bold text-brand-700">Your order</h1>
            <p className="mb-4">
              {orderNumber ? <>To see order <strong>{orderNumber}</strong>, track it with the phone number you ordered with.</> : "Track an order with its number and your phone number."}
            </p>
            <Link
              href={orderNumber ? `/track-order?order=${encodeURIComponent(orderNumber)}` : "/track-order"}
              className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white no-underline hover:bg-brand-700"
            >
              Track your order
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
