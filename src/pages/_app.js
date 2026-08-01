"use client";
import "@/styles/globals.css";
// react-slick IS used by ReviewsSection (homepage + product page). P2-P1 wrongly
// removed this as "dead" — that degraded the reviews carousel. Restored. The P4
// Tailwind migration drops react-slick from ReviewsSection, after which this goes.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";
import Head from "next/head";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useRouter } from "next/router";
import AppLayout from "@/layouts/AppLayout";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

export default function MyApp({ Component, pageProps }) {
  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);
  const router = useRouter();
  const isAdmin = router?.pathname?.startsWith("/admin");

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAdmin ? (
          <>
            {/* Admin is private and client-only — keep all /admin/* out of the index (P1-4). */}
            <Head>
              <meta name="robots" content="noindex,nofollow" />
            </Head>
            <Component {...pageProps} />
          </>
        ) : (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}