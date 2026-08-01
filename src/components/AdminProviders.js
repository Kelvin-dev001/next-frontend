import { useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// All MUI + emotion for the admin area lives behind this module. _app loads it via
// next/dynamic (ssr:false) only on /admin/* routes, so MUI stays out of the
// customer-facing storefront bundle (P4 Tailwind migration — the perf payoff).
const adminEmotionCache = createCache({ key: "css", prepend: true });

export default function AdminProviders({ children }) {
  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);
  return (
    <CacheProvider value={adminEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
