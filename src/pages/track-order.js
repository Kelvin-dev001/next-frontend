import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import OrderView from "@/components/checkout/OrderView";
import { Api } from "@/lib/api";

const FIELD = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

/**
 * P10-3. Anyone with an order number AND the phone it was placed with can see
 * that order's status and send an M-Pesa code. The API shows no street
 * address, and repeated wrong guesses lock the order number for a while.
 */
export default function TrackOrderPage() {
  const router = useRouter();
  const fromQuery = typeof router.query.order === "string" ? router.query.order : "";
  const [form, setForm] = useState({ orderNumber: null, phone: "" });
  const [state, setState] = useState({ busy: false, error: "", order: null, phone: "" });
  // Prefilled from ?order= until the customer types their own.
  const orderNumber = form.orderNumber ?? fromQuery;

  const submit = async (e) => {
    e.preventDefault();
    setState((s) => ({ ...s, busy: true, error: "" }));
    try {
      const res = await Api.trackOrder({ orderNumber, phone: form.phone });
      setState({ busy: false, error: "", order: res.data.order, phone: form.phone });
    } catch (err) {
      setState({
        busy: false,
        order: null,
        phone: "",
        error: err?.response?.data?.message || "We couldn't reach our server. Check your connection and try again.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Track your order | Snaap Connections</title>
        <meta name="description" content="Check the status of your Snaap Connections order and send your M-Pesa code." />
        <meta name="robots" content="noindex,follow" />
      </Head>

      <div className="mx-auto max-w-[760px] px-3 py-6 md:px-6 md:py-10">
        <h1 className="mb-1 text-[1.4rem] font-bold text-brand-700 md:text-[2rem]">Track your order</h1>
        <p className="mb-5 text-sm text-gray-700">Enter your order number and the phone number you ordered with.</p>

        <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="tr-order" className="mb-1 block text-sm font-semibold">Order number</label>
            <input id="tr-order" className={`${FIELD} uppercase`} value={orderNumber} required maxLength={12} placeholder="SC-10001"
              onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value.toUpperCase() }))} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="tr-phone" className="mb-1 block text-sm font-semibold">Phone number</label>
            <input id="tr-phone" type="tel" inputMode="tel" className={FIELD} value={form.phone} required maxLength={20} placeholder="0712 345 678"
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" />
          </div>
          <button type="submit" disabled={state.busy} className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {state.busy ? "Checking…" : "Track"}
          </button>
        </form>

        <div aria-live="polite">
          {state.error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
        </div>
        {state.order && (
          <OrderView order={state.order} phone={state.phone} onUpdated={(order) => setState((s) => ({ ...s, order }))} />
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
