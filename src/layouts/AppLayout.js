"use client";
import React, { Suspense } from "react";
import Header from "@/components/Header";
const Footer = React.lazy(() => import("@/components/Footer"));

const AppLayout = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <main style={{ minHeight: "60vh" }}>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default AppLayout;