import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaStore, FaTruck } from "react-icons/fa";
import useCart from "@/hooks/useCart";
import useCustomer, { loadCustomer, signedInAs } from "@/hooks/useCustomer";
import { Api } from "@/lib/api";
import { saveLastOrder } from "@/lib/lastOrder";
import {
  DELIVERY_ZONES, PICKUP, HOURS_DISPLAY, formatKES, deliveryForCounty, deliveryIsToBeConfirmed,
} from "@/constants/business";
import MpesaSteps from "@/components/checkout/MpesaSteps";

const TITLE = "Checkout | Snaap Connections";

// Mirrors the API's checks so mistakes show before the network round-trip.
// The API validates everything again and is the one that decides.
const phoneOk = (v) => /^(254|0)?[17]\d{8}$/.test(v.replace(/[\s\-().]/g, "").replace(/^\+/, ""));
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const codeOk = (v) => /^[A-Z0-9]{8,12}$/.test(v.replace(/\s+/g, "").toUpperCase());

const FIELD = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-800">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-600">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

// "+254712345678" -> "0712345678", the way people write their own number.
const localPhone = (e164) => (/^\+254\d{9}$/.test(e164 || "") ? `0${e164.slice(4)}` : e164 || "");

/**
 * P10-3 — guest checkout. Replaces "Buy on WhatsApp" (owner, 27 Oct 2026).
 * Payment is M-Pesa Buy Goods; the code is optional here because a customer
 * may pay after ordering. Nairobi/Machakos orders pay for the items now and the
 * delivery fee once the shop has called to confirm it.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", method: "delivery", county: "", town: "", address: "", notes: "", mpesaCode: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const [submit, setSubmit] = useState({ busy: false, placed: false, error: "", lineErrors: [], emailTaken: false });
  const [quote, setQuote] = useState({ key: null, data: null, failed: false });
  // P10-4: optional "Create an account" for guests.
  const [account, setAccount] = useState({ create: false, password: "" });
  // P10-5: the code being typed, and the one applied to the quote.
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const errorSummaryRef = useRef(null);
  const touched = useRef(false);
  const customer = useCustomer();
  const signedIn = customer.status === "signedIn" && customer.user;

  const set = (key) => (e) => {
    touched.current = true;
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  // A signed-in customer's details and saved address fill in, unless they have
  // already started typing.
  useEffect(() => {
    let cancelled = false;
    loadCustomer().then((user) => {
      if (cancelled || !user || touched.current) return;
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone ? localPhone(user.phone) : f.phone,
        ...(user.defaultAddress
          ? { method: "delivery", county: user.defaultAddress.county, town: user.defaultAddress.town, address: user.defaultAddress.address }
          : {}),
      }));
    });
    return () => { cancelled = true; };
  }, []);

  const itemsKey = cart.lines.map((l) => `${l.id}:${l.qty}`).join(",");
  const fulfilmentKey = form.method === "pickup" ? "pickup" : form.county ? `delivery:${form.county}` : "";
  const quoteKey = itemsKey ? `${itemsKey}|${fulfilmentKey}|${couponCode}` : "";

  // The API prices the cart for the chosen delivery and coupon; the browser
  // never does.
  useEffect(() => {
    if (!quoteKey) return undefined;
    let cancelled = false;
    const t = setTimeout(() => {
      const [itemsPart, fPart, cPart] = quoteKey.split("|");
      const items = itemsPart.split(",").map((s) => {
        const [productId, qty] = s.split(":");
        return { productId, quantity: Number(qty) };
      });
      const fulfilment = fPart === "pickup" ? { method: "pickup" } : fPart ? { method: "delivery", county: fPart.split(":")[1] } : undefined;
      Api.quoteOrder({ items, fulfilment, couponCode: cPart || undefined })
        .then((res) => { if (!cancelled) setQuote({ key: quoteKey, data: res.data, failed: false }); })
        .catch(() => { if (!cancelled) setQuote({ key: quoteKey, data: null, failed: true }); });
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [quoteKey]);

  const q = quote.key === quoteKey ? quote.data : null;
  const zone = form.method === "delivery" ? deliveryForCounty(form.county) : null;
  const tbc = Boolean(zone) && deliveryIsToBeConfirmed(zone);
  const deliveryChosen = form.method === "pickup" || Boolean(zone);
  const dueNow = q && deliveryChosen ? q.dueNow : null;
  const appliedCoupon = couponCode && q?.coupon ? q.coupon : null;
  const couponError = couponCode && q?.couponError ? q.couponError : "";
  const applyCoupon = () => setCouponCode(couponInput.trim().toUpperCase());
  const lineErrors = submit.lineErrors.length ? submit.lineErrors : q?.lineErrors || [];

  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!phoneOk(form.phone)) errors.phone = "Enter a Kenyan mobile number, e.g. 0712 345 678.";
  if (form.email.trim() && !emailOk(form.email.trim())) errors.email = "Enter a valid email address, or leave it blank.";
  if (form.method === "delivery") {
    if (!zone) errors.county = "Choose your county.";
    if (form.town.trim().length < 2) errors.town = "Enter your town or area.";
    if (form.address.trim().length < 3) errors.address = "Enter your street, building or a nearby landmark.";
  }
  if (form.mpesaCode.trim() && !codeOk(form.mpesaCode)) {
    errors.mpesaCode = "That doesn't look like an M-Pesa code. Leave it blank to pay later.";
  }
  const creatingAccount = !signedIn && account.create;
  if (creatingAccount) {
    if (!form.email.trim()) errors.email = "Enter your email address to create an account.";
    if (account.password.length < 8) errors.password = "Use a password of at least 8 characters.";
  }
  const shown = showErrors ? errors : {};

  const onSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (Object.keys(errors).length) {
      // Move focus to the summary so screen-reader and keyboard users hear what to fix.
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
      return;
    }
    setSubmit({ busy: true, placed: false, error: "", lineErrors: [], emailTaken: false });
    try {
      const res = await Api.placeOrder({
        customer: { name: form.name.trim(), phone: form.phone, email: form.email.trim() || undefined },
        fulfilment: form.method === "pickup"
          ? { method: "pickup", notes: form.notes.trim() }
          : { method: "delivery", county: form.county, town: form.town.trim(), address: form.address.trim(), notes: form.notes.trim() },
        items: cart.lines.map((l) => ({ productId: l.id, quantity: l.qty })),
        mpesaCode: form.mpesaCode.trim() || undefined,
        // Only a code the quote accepted — never one already shown as invalid.
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        ...(creatingAccount ? { createAccount: true, password: account.password } : {}),
      });
      const order = res.data.order;
      if (res.data.account) signedInAs(res.data.account);
      saveLastOrder({ order, phone: form.phone });
      setSubmit({ busy: true, placed: true, error: "", lineErrors: [], emailTaken: false });
      cart.clear();
      router.push(`/checkout/thank-you?order=${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      const data = err?.response?.data;
      // A refused coupon comes off, so the customer sees the real total before
      // placing the order again — never charged without the discount unawares.
      const couponRefused = data?.code === "COUPON_USED" || data?.code === "COUPON_INVALID";
      if (couponRefused) setCouponCode("");
      setSubmit({
        busy: false,
        placed: false,
        error: couponRefused
          ? `${data.message} We've removed it — check the new total, then place your order.`
          : data?.message || "We couldn't reach our server. Check your connection and try again — your cart is saved.",
        lineErrors: data?.lineErrors || [],
        emailTaken: data?.code === "EMAIL_TAKEN",
      });
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
    }
  };

  const head = (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content="Enter your delivery details and pay with M-Pesa." />
      <meta name="robots" content="noindex,follow" />
    </Head>
  );

  if (submit.placed) {
    return (
      <>
        {head}
        <p role="status" className="mx-auto max-w-[600px] px-4 py-16 text-center text-lg font-semibold text-brand-700">
          Order placed. Opening your order…
        </p>
      </>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <>
        {head}
        <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
          <h1 className="mb-3 text-2xl font-bold text-brand-700">Checkout</h1>
          <p className="mb-5">Your cart is empty.</p>
          <Link href="/products" className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white no-underline hover:bg-brand-700">Browse products</Link>
        </div>
      </>
    );
  }

  const errorList = Object.values(shown);

  return (
    <>
      {head}
      <form noValidate onSubmit={onSubmit} className="mx-auto max-w-[1100px] px-3 pb-32 pt-6 md:px-6 md:pb-12 md:pt-10">
        <h1 className="mb-4 text-[1.4rem] font-bold text-brand-700 md:text-[2rem]">Checkout</h1>

        {(errorList.length > 0 || submit.error || lineErrors.length > 0) && (
          <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none">
            <p className="font-semibold">{submit.error || (lineErrors.length ? "Some items in your cart have changed." : "Please fix the following:")}</p>
            {errorList.length > 0 && (
              <ul className="mt-1 list-disc pl-5">{errorList.map((m) => <li key={m}>{m}</li>)}</ul>
            )}
            {lineErrors.length > 0 && (
              <>
                <ul className="mt-1 list-disc pl-5">{lineErrors.map((l) => <li key={l.productId}>{l.message}</li>)}</ul>
                <Link href="/cart" className="mt-2 inline-block font-semibold underline">Review your cart</Link>
              </>
            )}
            {submit.emailTaken && (
              <Link href="/account/login?next=/checkout" className="mt-2 inline-block font-semibold underline">Sign in to your account</Link>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <fieldset className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
              <legend className="px-1 text-lg font-bold">1. Your details</legend>
              {signedIn ? (
                <p className="rounded-lg bg-brand-50 p-3 text-sm">
                  Signed in as <strong>{customer.user.name}</strong> ({customer.user.email}). This order will be saved to{" "}
                  <Link href="/account" className="font-semibold text-brand-700 underline">your account</Link>.
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Have an account?{" "}
                  <Link href="/account/login?next=/checkout" className="font-semibold text-brand-700 underline">Sign in</Link>
                  {" "}— or carry on as a guest.
                </p>
              )}
              <Field id="co-name" label="Full name" error={shown.name}>
                <input id="co-name" className={FIELD} value={form.name} onChange={set("name")} autoComplete="name" maxLength={80}
                  aria-invalid={Boolean(shown.name)} aria-describedby={describedBy("co-name", shown.name)} />
              </Field>
              <Field id="co-phone" label="Phone number (M-Pesa)" hint="We'll use this to contact you about your order." error={shown.phone}>
                <input id="co-phone" type="tel" inputMode="tel" className={FIELD} value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={20}
                  placeholder="0712 345 678" aria-invalid={Boolean(shown.phone)} aria-describedby={describedBy("co-phone", shown.phone, true)} />
              </Field>
              <Field id="co-email" label={creatingAccount ? "Email" : "Email (optional)"} hint={creatingAccount ? "You'll sign in with this." : "For your records."} error={shown.email}>
                <input id="co-email" type="email" inputMode="email" className={FIELD} value={form.email} onChange={set("email")} autoComplete="email" maxLength={120}
                  aria-invalid={Boolean(shown.email)} aria-describedby={describedBy("co-email", shown.email, true)} />
              </Field>
              {!signedIn && (
                <div className="rounded-lg border border-gray-200 p-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" className="mt-1" checked={account.create}
                      onChange={(e) => setAccount((a) => ({ ...a, create: e.target.checked }))} />
                    <span>
                      <span className="font-semibold">Create an account</span>
                      <span className="block text-sm text-gray-600">Optional. See your orders and check out faster next time.</span>
                    </span>
                  </label>
                  {account.create && (
                    <div className="mt-3">
                      <Field id="co-password" label="Choose a password" hint="At least 8 characters." error={shown.password}>
                        <input id="co-password" type="password" className={FIELD} value={account.password} autoComplete="new-password" minLength={8} maxLength={128}
                          onChange={(e) => setAccount((a) => ({ ...a, password: e.target.value }))}
                          aria-invalid={Boolean(shown.password)} aria-describedby={describedBy("co-password", shown.password, true)} />
                      </Field>
                    </div>
                  )}
                </div>
              )}
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
              <legend className="px-1 text-lg font-bold">2. Delivery or pickup</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { value: "delivery", icon: <FaTruck aria-hidden="true" />, title: "Deliver to me", sub: "Mombasa, Kilifi, Kwale, Nairobi, Machakos" },
                  { value: "pickup", icon: <FaStore aria-hidden="true" />, title: PICKUP.label, sub: "No delivery fee" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${form.method === opt.value ? "border-brand-600 bg-brand-50" : "border-gray-200"}`}
                  >
                    <input type="radio" name="method" value={opt.value} checked={form.method === opt.value} onChange={set("method")} className="mt-1" />
                    <span>
                      <span className="flex items-center gap-2 font-semibold">{opt.icon} {opt.title}</span>
                      <span className="block text-sm text-gray-600">{opt.sub}</span>
                    </span>
                  </label>
                ))}
              </div>

              {form.method === "delivery" ? (
                <>
                  <Field id="co-county" label="County" error={shown.county}>
                    <select id="co-county" className={FIELD} value={form.county} onChange={set("county")}
                      aria-invalid={Boolean(shown.county)} aria-describedby={describedBy("co-county", shown.county)}>
                      <option value="">Choose your county</option>
                      {DELIVERY_ZONES.flatMap((z) => z.counties.map((c) => (
                        <option key={c} value={c}>{c} — {z.priceDisplay}</option>
                      )))}
                    </select>
                  </Field>
                  {zone && !tbc && (
                    <p className="text-sm text-gray-700">Delivery to {form.county}: {zone.priceDisplay}, {zone.time.toLowerCase()}.</p>
                  )}
                  {tbc && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                      Delivery to {form.county} is {zone.priceDisplay}, {zone.time.toLowerCase()}. We&apos;ll call you to confirm the exact fee. You pay for your items now and the delivery fee separately, once it&apos;s confirmed.
                    </p>
                  )}
                  <Field id="co-town" label="Town or area" error={shown.town}>
                    <input id="co-town" className={FIELD} value={form.town} onChange={set("town")} autoComplete="address-level2" maxLength={80}
                      placeholder="e.g. Nyali" aria-invalid={Boolean(shown.town)} aria-describedby={describedBy("co-town", shown.town)} />
                  </Field>
                  <Field id="co-address" label="Street, building or landmark" error={shown.address}>
                    <input id="co-address" className={FIELD} value={form.address} onChange={set("address")} autoComplete="street-address" maxLength={200}
                      aria-invalid={Boolean(shown.address)} aria-describedby={describedBy("co-address", shown.address)} />
                  </Field>
                </>
              ) : (
                <p className="rounded-lg bg-brand-50 p-3 text-sm text-gray-800">
                  Collect from our shop: <strong>{PICKUP.address}</strong>. Open {HOURS_DISPLAY}. We&apos;ll contact you when your order is ready.
                </p>
              )}
              <Field id="co-notes" label="Notes (optional)" hint="Anything we should know, e.g. the best time to reach you.">
                <textarea id="co-notes" className={FIELD} rows={2} value={form.notes} onChange={set("notes")} maxLength={300} aria-describedby="co-notes-hint" />
              </Field>
            </fieldset>

            <fieldset className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
              <legend className="px-1 text-lg font-bold">3. Pay with M-Pesa</legend>
              {dueNow == null ? (
                <p className="text-sm text-gray-700">Choose delivery or pickup above to see how much to pay.</p>
              ) : (
                <>
                  <p className="text-[0.95rem]">
                    {tbc ? "Pay for your items now: " : "Amount to pay: "}
                    <strong className="text-lg">{formatKES(dueNow)}</strong>
                  </p>
                  <MpesaSteps amount={dueNow} />
                </>
              )}
              <Field
                id="co-mpesa"
                label="M-Pesa code (optional)"
                hint="Already paid? Enter the code. You can also place your order first and pay after."
                error={shown.mpesaCode}
              >
                <input id="co-mpesa" className={`${FIELD} uppercase tracking-wider`} value={form.mpesaCode}
                  onChange={(e) => setForm((f) => ({ ...f, mpesaCode: e.target.value.toUpperCase() }))}
                  autoComplete="off" autoCapitalize="characters" maxLength={14} placeholder="e.g. SJ12AB3CDE"
                  aria-invalid={Boolean(shown.mpesaCode)} aria-describedby={describedBy("co-mpesa", shown.mpesaCode, true)} />
              </Field>
            </fieldset>

            <p className="text-xs text-gray-600">
              By placing your order you agree to us using your details to process and deliver it, as described in our{" "}
              <Link href="/privacy-policy" className="font-semibold text-brand-700 underline">privacy policy</Link>.
            </p>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border border-gray-200 bg-white p-4 md:sticky md:top-24" aria-label="Order summary">
            <h2 className="text-lg font-bold">Your order</h2>
            <ul className="divide-y divide-gray-100 text-sm">
              {(q?.lines || cart.lines.map((l) => ({ product: l.id, name: l.name, quantity: l.qty, lineTotal: l.price * l.qty }))).map((l) => (
                <li key={l.product} className="flex justify-between gap-3 py-2">
                  <span>{l.name} <span className="text-gray-600">× {l.quantity}</span></span>
                  <span className="shrink-0 font-semibold">{formatKES(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 border-t border-gray-200 pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{q ? formatKES(q.totals.subtotal) : "…"}</dd></div>
              {appliedCoupon && q.totals.itemsDiscount > 0 && (
                <div className="flex justify-between text-green-800"><dt>Coupon {appliedCoupon.code}</dt><dd>−{formatKES(q.totals.itemsDiscount)}</dd></div>
              )}
              <div className="flex justify-between">
                <dt>{form.method === "pickup" ? "Pickup" : "Delivery"}</dt>
                <dd>
                  {form.method === "pickup" ? "No delivery fee" : !zone ? "Choose county" : tbc ? `${zone.priceDisplay} — confirmed by phone` : zone.priceDisplay}
                </dd>
              </div>
              {appliedCoupon && q.totals.deliveryDiscount > 0 && (
                <div className="flex justify-between text-green-800"><dt>Coupon on delivery</dt><dd>−{formatKES(q.totals.deliveryDiscount)}</dd></div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
                <dt>{tbc ? "Pay now (items)" : "Total"}</dt>
                <dd aria-live="polite">{dueNow == null ? "—" : formatKES(dueNow)}</dd>
              </div>
            </dl>
            {appliedCoupon && tbc && appliedCoupon.appliesTo !== "items" && (
              <p className="text-xs text-gray-700">
                Your coupon also takes {appliedCoupon.percentOff}% off the delivery fee once we&apos;ve confirmed it.
              </p>
            )}

            {/* P10-5. Not a nested <form> (invalid inside checkout's), so Enter
                in the box applies the code instead of placing the order. */}
            <div className="border-t border-gray-200 pt-3">
              {appliedCoupon ? (
                <p className="flex items-center justify-between gap-2 text-sm">
                  <span>
                    <strong>{appliedCoupon.code}</strong> applied — {appliedCoupon.description}
                  </span>
                  <button type="button" onClick={() => { setCouponCode(""); setCouponInput(""); }} className="shrink-0 font-semibold text-brand-700 underline">
                    Remove
                  </button>
                </p>
              ) : (
                <>
                  <label htmlFor="co-coupon" className="mb-1 block text-sm font-semibold">Coupon code</label>
                  <div className="flex gap-2">
                    <input
                      id="co-coupon"
                      className={`${FIELD} uppercase`}
                      value={couponInput}
                      maxLength={20}
                      autoComplete="off"
                      autoCapitalize="characters"
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                      aria-describedby={couponError ? "co-coupon-error" : undefined}
                      aria-invalid={Boolean(couponError)}
                    />
                    <button type="button" onClick={applyCoupon} disabled={couponInput.trim().length < 3}
                      className="shrink-0 rounded-lg border-2 border-brand-700 px-4 font-semibold text-brand-700 disabled:opacity-50">
                      Apply
                    </button>
                  </div>
                  <div aria-live="polite">
                    {couponError && <p id="co-coupon-error" className="mt-1 text-sm text-red-700">{couponError}</p>}
                  </div>
                </>
              )}
            </div>
            {quote.failed && quote.key === quoteKey && (
              <p className="text-sm text-red-700">We couldn&apos;t check prices. Check your connection.</p>
            )}
            <button type="submit" disabled={submit.busy} className="hidden w-full rounded-full bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 md:block">
              {submit.busy ? "Placing order…" : "Place order"}
            </button>
            <Link href="/cart" className="block text-center text-sm font-semibold text-brand-700 hover:underline">Edit cart</Link>
          </aside>
        </div>

        {/* Phones: the total and the button stay in reach. */}
        <div className="fixed inset-x-0 bottom-0 z-[1050] border-t border-gray-200 bg-white px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
          <div className="mx-auto flex max-w-[600px] items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">{tbc ? "Pay now (items)" : "Total"}</p>
              <p className="truncate text-lg font-bold">{dueNow == null ? "—" : formatKES(dueNow)}</p>
            </div>
            <button type="submit" disabled={submit.busy} className="shrink-0 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
              {submit.busy ? "Placing…" : "Place order"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
