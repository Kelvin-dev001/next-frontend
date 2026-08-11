import React, { Suspense } from "react";
import Header from "@/components/Header";
import TopInfoMarquee from "@/components/TopInfoMarquee";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
const Footer = React.lazy(() => import("@/components/Footer"));

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden">
      <Header />
      {/* Sits below the sticky header so it scrolls away with the page rather
          than permanently eating viewport on a phone. */}
      <TopInfoMarquee />
      <main className="w-full flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {/* Storefront only — /admin/* bypasses AppLayout entirely in _app.js. */}
      <FloatingWhatsApp />
    </div>
  );
};

export default AppLayout;
