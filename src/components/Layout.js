"use client";
import dynamic from "next/dynamic";
import MainNavbar from "./MainNavbar";

const Footer = dynamic(() => import("./Footer"), { ssr: false });

export default function Layout({ children }) {
  return (
    <>
      <MainNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}