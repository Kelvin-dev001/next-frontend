import React, { Suspense } from "react";
import Header from "@/components/Header";
const Footer = React.lazy(() => import("@/components/Footer"));

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden">
      <Header />
      <main className="w-full flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default AppLayout;
