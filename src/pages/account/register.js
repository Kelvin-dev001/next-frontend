import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Api } from "@/lib/api";
import { signedInAs } from "@/hooks/useCustomer";
import safeNext from "@/lib/safeNext";

const FIELD = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[0.95rem] outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200";
const PASSWORD_MIN = 8;

// P10-4. Optional — guest checkout always works.
export default function RegisterPage() {
  const router = useRouter();
  const next = safeNext(router.query.next);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({ busy: false, error: "", taken: false });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < PASSWORD_MIN) {
      setState({ busy: false, error: `Use a password of at least ${PASSWORD_MIN} characters.`, taken: false });
      return;
    }
    setState({ busy: true, error: "", taken: false });
    try {
      const res = await Api.post("/customer/register", form);
      signedInAs(res.data.user);
      router.replace(next);
    } catch (err) {
      const data = err?.response?.data;
      setState({ busy: false, error: data?.message || "We couldn't reach our server. Check your connection and try again.", taken: data?.code === "EMAIL_TAKEN" });
    }
  };

  return (
    <>
      <Head>
        <title>Create an account | Snaap Connections</title>
        <meta name="description" content="Create a Snaap Connections account." />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="mx-auto max-w-[440px] px-4 py-10">
        <h1 className="mb-1 text-2xl font-bold text-brand-700">Create an account</h1>
        <p className="mb-5 text-sm text-gray-700">Optional — you can always check out as a guest.</p>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4" noValidate>
          <div aria-live="polite">
            {state.error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {state.error}{" "}
                {state.taken && <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-semibold underline">Sign in</Link>}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="rg-name" className="mb-1 block text-sm font-semibold">Full name</label>
            <input id="rg-name" autoComplete="name" required maxLength={80} className={FIELD} value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label htmlFor="rg-email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="rg-email" type="email" inputMode="email" autoComplete="email" required maxLength={120} className={FIELD} value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label htmlFor="rg-phone" className="mb-1 block text-sm font-semibold">Phone number (optional)</label>
            <input id="rg-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="0712 345 678" className={FIELD} value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label htmlFor="rg-password" className="mb-1 block text-sm font-semibold">Password</label>
            <div className="flex gap-2">
              <input id="rg-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128}
                className={FIELD} value={form.password} onChange={set("password")} aria-describedby="rg-password-hint" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-pressed={showPassword}
                className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-brand-700">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p id="rg-password-hint" className="mt-1 text-xs text-gray-600">At least {PASSWORD_MIN} characters.</p>
          </div>
          <p className="text-xs text-gray-600">
            We use your details to run your account and orders — see our{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-700 underline">privacy policy</Link>.
          </p>
          <button type="submit" disabled={state.busy} className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {state.busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link href={`/account/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-700 underline">Sign in</Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
