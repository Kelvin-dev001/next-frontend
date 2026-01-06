"use client";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useRouter } from "next/navigation";
import AppLayout from "@/layouts/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

export default function MyApp({ Component, pageProps }) {
  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);
  const router = useRouter();
  const isAdmin = router?.pathname?.startsWith("/admin");

  const Layout = isAdmin ? AdminLayout : AppLayout;

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}