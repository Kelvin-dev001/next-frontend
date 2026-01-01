"use client";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

export default function MyApp({ Component, pageProps }) {
  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}