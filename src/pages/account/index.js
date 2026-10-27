import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import useCustomer, { signOut, updateSignedInUser } from "@/hooks/useCustomer";
import OrderView from "@/components/checkout/OrderView";
import { DELIVERY_ZONES, formatKES } from "@/constants/business";

const FIELD = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";
const CARD = "rounded-2xl border border-gray-200 bg-white p-4";
const STATUS = { pending: "Received", confirmed: "Confirmed", paid: "Paid", dispatched: "On its way", delivered: "Delivered", cancelled: "Cancelled" };

function Notice({ state }) {
  return (
    <div aria-live="polite">
      {state.error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
      {state.ok && <p className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">{state.ok}</p>}
    </div>
  );
}

function PasswordForm({ forced }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [state, setState] = useState({ busy: false, error: "", ok: "" });
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", ok: "" });
    try {
      const res = await Api.post("/customer/password", form);
      updateSignedInUser(res.data.user);
      setForm({ currentPassword: "", newPassword: "" });
      setState({ busy: false, error: "", ok: "Password changed. Any other device you were signed in on has been signed out." });
    } catch (err) {
      setState({ busy: false, error: err?.response?.data?.message || "We couldn't change your password. Try again.", ok: "" });
    }
  };
  return (
    <form onSubmit={submit} className={`${CARD} space-y-3`} aria-labelledby="pw-heading">
      <h2 id="pw-heading" className="text-lg font-bold">{forced ? "Choose a new password" : "Change password"}</h2>
      {forced && <p className="text-sm text-gray-700">We reset your password. Enter the temporary password we gave you, then choose your own.</p>}
      <Notice state={state} />
      <div>
        <label htmlFor="pw-current" className="mb-1 block text-sm font-semibold">{forced ? "Temporary password" : "Current password"}</label>
        <input id="pw-current" type="password" autoComplete="current-password" required className={FIELD}
          value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="pw-new" className="mb-1 block text-sm font-semibold">New password</label>
        <input id="pw-new" type="password" autoComplete="new-password" required minLength={8} maxLength={128} className={FIELD}
          value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} aria-describedby="pw-new-hint" />
        <p id="pw-new-hint" className="mt-1 text-xs text-gray-600">At least 8 characters.</p>
      </div>
      <button type="submit" disabled={state.busy} className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
        {state.busy ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}

function DetailsForm({ user }) {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    county: user.defaultAddress?.county || "",
    town: user.defaultAddress?.town || "",
    address: user.defaultAddress?.address || "",
  });
  const [state, setState] = useState({ busy: false, error: "", ok: "" });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", ok: "" });
    try {
      const res = await Api.patch("/customer/me", {
        name: form.name,
        phone: form.phone,
        defaultAddress: form.county ? { county: form.county, town: form.town, address: form.address } : null,
      });
      updateSignedInUser(res.data.user);
      setState({ busy: false, error: "", ok: "Saved." });
    } catch (err) {
      setState({ busy: false, error: err?.response?.data?.message || "We couldn't save your details. Try again.", ok: "" });
    }
  };
  return (
    <form onSubmit={submit} className={`${CARD} space-y-3`} aria-labelledby="details-heading">
      <h2 id="details-heading" className="text-lg font-bold">Your details</h2>
      <p className="text-sm text-gray-700">Signed in as <strong>{user.email}</strong>. Your delivery address fills in at checkout.</p>
      <Notice state={state} />
      <div>
        <label htmlFor="ac-name" className="mb-1 block text-sm font-semibold">Full name</label>
        <input id="ac-name" autoComplete="name" maxLength={80} className={FIELD} value={form.name} onChange={set("name")} />
      </div>
      <div>
        <label htmlFor="ac-phone" className="mb-1 block text-sm font-semibold">Phone number</label>
        <input id="ac-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} className={FIELD} value={form.phone} onChange={set("phone")} />
      </div>
      <div>
        <label htmlFor="ac-county" className="mb-1 block text-sm font-semibold">Delivery county</label>
        <select id="ac-county" className={FIELD} value={form.county} onChange={set("county")}>
          <option value="">No saved address</option>
          {DELIVERY_ZONES.flatMap((z) => z.counties).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {form.county && (
        <>
          <div>
            <label htmlFor="ac-town" className="mb-1 block text-sm font-semibold">Town or area</label>
            <input id="ac-town" autoComplete="address-level2" maxLength={80} className={FIELD} value={form.town} onChange={set("town")} />
          </div>
          <div>
            <label htmlFor="ac-address" className="mb-1 block text-sm font-semibold">Street, building or landmark</label>
            <input id="ac-address" autoComplete="street-address" maxLength={200} className={FIELD} value={form.address} onChange={set("address")} />
          </div>
        </>
      )}
      <button type="submit" disabled={state.busy} className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
        {state.busy ? "Saving…" : "Save details"}
      </button>
    </form>
  );
}

function Orders() {
  const [result, setResult] = useState({ loaded: false, orders: [], error: "" });
  const [open, setOpen] = useState(null);
  useEffect(() => {
    let cancelled = false;
    Api.get("/customer/orders")
      .then((res) => { if (!cancelled) setResult({ loaded: true, orders: res.data?.orders || [], error: "" }); })
      .catch(() => { if (!cancelled) setResult({ loaded: true, orders: [], error: "We couldn't load your orders. Refresh to try again." }); });
    return () => { cancelled = true; };
  }, []);
  const replaceOrder = (updated) => setResult((r) => ({ ...r, orders: r.orders.map((o) => (o.orderNumber === updated.orderNumber ? { ...updated, phone: o.phone } : o)) }));

  return (
    <section className={CARD} aria-labelledby="orders-heading">
      <h2 id="orders-heading" className="mb-2 text-lg font-bold">Your orders</h2>
      {!result.loaded ? (
        <p className="text-sm text-gray-600">Loading…</p>
      ) : result.error ? (
        <p role="alert" className="text-sm text-red-800">{result.error}</p>
      ) : result.orders.length === 0 ? (
        <p className="text-sm text-gray-700">No orders yet. <Link href="/products" className="font-semibold text-brand-700 underline">Start shopping</Link>.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {result.orders.map((o) => {
            const t = o.totals || {};
            const expanded = open === o.orderNumber;
            return (
              <li key={o.orderNumber} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : o.orderNumber)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span>
                    <span className="block font-semibold text-brand-700">{o.orderNumber}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(o.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium", timeZone: "Africa/Nairobi" })} · {STATUS[o.status] || o.status}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">
                    {t.total == null ? `${formatKES((t.subtotal || 0) - (t.itemsDiscount || 0))} + delivery` : formatKES(t.total)}
                  </span>
                </button>
                {expanded && <div className="mt-3"><OrderView order={o} phone={o.phone} onUpdated={replaceOrder} /></div>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * P10-4. The customer's own orders, details and password. Guest orders are
 * never attached to an account by phone (owner): only orders placed while
 * signed in, or the one that created the account, appear here.
 */
export default function AccountPage() {
  const router = useRouter();
  const { status, user } = useCustomer();

  let body;
  if (status === "signedIn" && user) {
    body = user.mustChangePassword ? (
      <PasswordForm forced />
    ) : (
      <div className="space-y-5">
        <Orders />
        <DetailsForm key={user.id} user={user} />
        <PasswordForm />
        <button
          type="button"
          onClick={async () => { await signOut(); router.replace("/"); }}
          className="rounded-full border-2 border-brand-700 px-6 py-2 font-semibold text-brand-700 hover:bg-brand-700 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  } else if (status === "signedOut") {
    body = (
      <div className={`${CARD} text-center`}>
        <p className="mb-4">Sign in to see your orders and saved details.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/account/login" className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white no-underline hover:bg-brand-700">Sign in</Link>
          <Link href="/account/register" className="rounded-full border-2 border-brand-700 px-6 py-2 font-semibold text-brand-700 no-underline">Create an account</Link>
        </div>
        <p className="mt-4 text-sm text-gray-600">Ordered as a guest? <Link href="/track-order" className="font-semibold text-brand-700 underline">Track your order</Link>.</p>
      </div>
    );
  } else {
    body = <p role="status" className="text-gray-600">Loading your account…</p>;
  }

  return (
    <>
      <Head>
        <title>My account | Snaap Connections</title>
        <meta name="description" content="Your Snaap Connections orders and account details." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="mx-auto max-w-[760px] px-3 py-6 md:px-6 md:py-10">
        <h1 className="mb-4 text-[1.4rem] font-bold text-brand-700 md:text-[2rem]">
          {status === "signedIn" && user ? `Hello, ${user.name.split(" ")[0]}` : "My account"}
        </h1>
        {body}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
