import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Api } from "@/lib/api";
import { signedInAs } from "@/hooks/useCustomer";
import safeNext from "@/lib/safeNext";
import { waLink } from "@/constants/business";

const FIELD = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

/**
 * P10-4. Email + password (owner's choice). There is no "email me a reset
 * link": the shop resets a password from the admin portal, so a forgotten
 * password is a WhatsApp support message.
 */
export default function LoginPage() {
  const router = useRouter();
  const next = safeNext(router.query.next);
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ busy: false, error: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "" });
    try {
      const res = await Api.post("/customer/login", form);
      signedInAs(res.data.user);
      // A temporary password from the shop must be replaced first (account page).
      router.replace(res.data.user.mustChangePassword ? "/account" : next);
    } catch (err) {
      setState({ busy: false, error: err?.response?.data?.message || "We couldn't reach our server. Check your connection and try again." });
    }
  };

  return (
    <>
      <Head>
        <title>Sign in | Snaap Connections</title>
        <meta name="description" content="Sign in to your Snaap Connections account." />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="mx-auto max-w-[440px] px-4 py-10">
        <h1 className="mb-1 text-2xl font-bold text-brand-700">Sign in</h1>
        <p className="mb-5 text-sm text-gray-700">See your orders, save your address and keep your wishlist on every device. You can always order as a guest instead.</p>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4" noValidate>
          <div aria-live="polite">
            {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
          </div>
          <div>
            <label htmlFor="li-email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="li-email" type="email" inputMode="email" autoComplete="email" required maxLength={120} className={FIELD}
              value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="li-password" className="mb-1 block text-sm font-semibold">Password</label>
            <input id="li-password" type="password" autoComplete="current-password" required maxLength={128} className={FIELD}
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" disabled={state.busy} className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {state.busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm">
          New here?{" "}
          <Link href={`/account/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-700 underline">
            Create an account
          </Link>
        </p>
        <p className="mt-3 text-sm text-gray-700">
          Forgot your password? We&apos;ll reset it for you:{" "}
          <a href={waLink("Hi Snaap Connections, I need my account password reset.")} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-brand-700 underline">
            <FaWhatsapp aria-hidden="true" /> message us on WhatsApp
          </a>
          .
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
