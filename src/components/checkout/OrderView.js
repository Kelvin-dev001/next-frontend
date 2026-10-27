import Link from "next/link";
import { useState } from "react";
import { FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { Api } from "@/lib/api";
import { formatKES, ADDRESS, HOURS_DISPLAY, deliveryForCounty } from "@/constants/business";
import MpesaSteps from "@/components/checkout/MpesaSteps";

const STATUS_TEXT = {
  pending: "Received — we'll contact you to confirm",
  confirmed: "Confirmed",
  paid: "Paid",
  dispatched: { delivery: "On its way", pickup: "Ready for pickup" },
  delivered: { delivery: "Delivered", pickup: "Collected" },
  cancelled: "Cancelled",
};
const statusText = (status, method) => {
  const s = STATUS_TEXT[status];
  return typeof s === "object" ? s[method] || s.delivery : s || status;
};

const PART_LABEL = { full: "Your order", items: "Your items", delivery: "Delivery fee" };

function CodeForm({ orderNumber, phone, kind, onUpdated, label }) {
  const [code, setCode] = useState("");
  const [state, setState] = useState({ busy: false, error: "", ok: "" });
  const id = `mpesa-code-${kind}`;

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", ok: "" });
    try {
      const res = await Api.submitPayment({ orderNumber, phone, mpesaCode: code, kind });
      setCode("");
      setState({ busy: false, error: "", ok: res.data?.message || "Thanks — we'll check your payment." });
      onUpdated(res.data.order);
    } catch (err) {
      setState({ busy: false, error: err?.response?.data?.message || "We couldn't save your code. Check your connection and try again.", ok: "" });
    }
  };

  return (
    <form onSubmit={submit} className="mt-2">
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={14}
          placeholder="e.g. SJ12AB3CDE"
          className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 uppercase tracking-wider"
          aria-describedby={state.error ? `${id}-error` : undefined}
          aria-invalid={Boolean(state.error)}
        />
        <button type="submit" disabled={state.busy || code.trim().length < 8} className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          {state.busy ? "Saving…" : "Send"}
        </button>
      </div>
      <div aria-live="polite">
        {state.error && <p id={`${id}-error`} className="mt-1 text-sm text-red-700">{state.error}</p>}
        {state.ok && <p className="mt-1 text-sm text-green-800">{state.ok}</p>}
      </div>
    </form>
  );
}

function PaymentPart({ kind, part, order, phone, onUpdated }) {
  const label = PART_LABEL[kind];
  if (part.state === "none") return null;
  if (part.state === "awaiting-fee") {
    const range = deliveryForCounty(order.fulfilment?.county)?.priceDisplay;
    return (
      <div className="rounded-xl border border-gray-200 p-3">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-700">
          <FaPhoneAlt className="mr-1 inline" aria-hidden="true" />
          We&apos;ll call you to confirm the delivery fee{range ? ` (${range})` : ""}. You pay it separately, once confirmed.
        </p>
      </div>
    );
  }
  if (part.state === "verified") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-3">
        <p className="flex items-center gap-2 font-semibold text-green-800">
          <FaCheckCircle aria-hidden="true" /> {label}: {formatKES(part.amount)} — paid
        </p>
      </div>
    );
  }
  const latest = (order.payments || []).filter((p) => p.kind === kind && p.status !== "rejected").pop();
  const rejected = (order.payments || []).filter((p) => p.kind === kind).pop()?.status === "rejected";
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-3">
      <p className="font-semibold">
        {label}: {formatKES(part.amount)} {part.state === "submitted" ? "— code received, we're checking it" : "— to pay"}
      </p>
      {rejected && part.state === "due" && (
        <p className="mt-1 text-sm font-semibold text-red-700">
          We couldn&apos;t match your last M-Pesa code to a payment. Please check it and send it again.
        </p>
      )}
      {part.state === "submitted" ? (
        <>
          <p className="mt-1 text-sm text-gray-700">Code {latest?.code}. Made a typo? Send the right one:</p>
          {phone && <CodeForm orderNumber={order.orderNumber} phone={phone} kind={kind} onUpdated={onUpdated} label="Corrected M-Pesa code" />}
        </>
      ) : (
        <>
          <div className="mt-2"><MpesaSteps amount={part.amount} /></div>
          {phone && <CodeForm orderNumber={order.orderNumber} phone={phone} kind={kind} onUpdated={onUpdated} label="M-Pesa code" />}
        </>
      )}
    </div>
  );
}

/**
 * One order as the customer sees it (thank-you page and order tracking).
 * `phone` is the number the order was placed with — needed to send a code.
 */
export default function OrderView({ order, phone, onUpdated }) {
  const method = order.fulfilment?.method;
  const t = order.totals || {};
  const parts = Object.entries(order.payment || {});
  const cancelled = order.status === "cancelled";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Order number</p>
        <p className="text-2xl font-extrabold tracking-wide text-brand-700">{order.orderNumber}</p>
        <p className="mt-1 text-sm text-gray-600">
          Placed {new Date(order.createdAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" })}
        </p>
        <p className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
          {statusText(order.status, method)}
        </p>
      </div>

      {!cancelled && parts.length > 0 && (
        <section aria-labelledby="pay-heading" className="space-y-3">
          <h2 id="pay-heading" className="text-lg font-bold">Payment — M-Pesa</h2>
          {parts.map(([kind, part]) => (
            <PaymentPart key={kind} kind={kind} part={part} order={order} phone={phone} onUpdated={onUpdated} />
          ))}
        </section>
      )}

      <section aria-labelledby="items-heading" className="rounded-2xl border border-gray-200 bg-white p-4">
        <h2 id="items-heading" className="mb-2 text-lg font-bold">Items</h2>
        <ul className="divide-y divide-gray-100">
          {(order.items || []).map((item, i) => (
            <li key={`${item.product}-${i}`} className="flex justify-between gap-3 py-2 text-sm">
              <span>
                {item.product ? <Link href={`/products/${item.product}`} prefetch={false} className="hover:underline">{item.name}</Link> : item.name}
                <span className="text-gray-600"> × {item.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatKES(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatKES(t.subtotal)}</dd></div>
          {t.itemsDiscount > 0 && (
            <div className="flex justify-between text-green-800"><dt>Coupon {order.coupon?.code}</dt><dd>−{formatKES(t.itemsDiscount)}</dd></div>
          )}
          <div className="flex justify-between">
            <dt>{method === "pickup" ? "Pickup" : `Delivery${order.fulfilment?.county ? ` to ${order.fulfilment.county}` : ""}`}</dt>
            <dd>{method === "pickup" ? "No delivery fee" : t.deliveryFee == null ? "To be confirmed" : formatKES(t.deliveryFee)}</dd>
          </div>
          {t.deliveryDiscount > 0 && (
            <div className="flex justify-between text-green-800"><dt>Coupon on delivery</dt><dd>−{formatKES(t.deliveryDiscount)}</dd></div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{t.total == null ? `${formatKES(t.subtotal - (t.itemsDiscount || 0))} + delivery` : formatKES(t.total)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="where-heading" className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
        <h2 id="where-heading" className="mb-1 text-lg font-bold">{method === "pickup" ? "Pickup" : "Delivery"}</h2>
        {method === "pickup" ? (
          <p>From our shop: {ADDRESS.full}. Open {HOURS_DISPLAY}. We&apos;ll contact you when it&apos;s ready.</p>
        ) : (
          <p>To {[order.fulfilment?.town, order.fulfilment?.county].filter(Boolean).join(", ")}. We&apos;ll contact you to arrange delivery.</p>
        )}
      </section>
    </div>
  );
}
