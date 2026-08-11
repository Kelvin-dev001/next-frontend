import "@/styles/globals.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import AppLayout from "@/layouts/AppLayout";

// The storefront is Tailwind-only. MUI + emotion load exclusively for /admin, via
// this dynamic (ssr:false) boundary — so none of it ships in the customer bundle.
// react-slick, slick-carousel and react-fast-marquee were uninstalled in P8: the
// hero carousel runs on native scroll-snap and the marquees on one CSS keyframe,
// so the storefront ships no carousel library at all.
const AdminProviders = dynamic(() => import("@/components/AdminProviders"), { ssr: false });

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router?.pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        {/* Admin is private and client-only — keep all /admin/* out of the index (P1-4).
            Kept outside AdminProviders so the noindex tag still server-renders. */}
        <Head>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <AdminProviders>
          <Component {...pageProps} />
        </AdminProviders>
      </>
    );
  }

  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}
