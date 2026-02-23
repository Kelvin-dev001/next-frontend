"use client";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";
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
          <Component {...pageProps} />
        ) : (
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}