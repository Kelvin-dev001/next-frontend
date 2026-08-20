import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars, FaSearch, FaTimes, FaStore, FaTags, FaStar, FaThLarge, FaWifi } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import AutoCompleteSearch from "@/components/AutoCompleteSearch";
import { Api } from "@/lib/api";

const menuSections = [
  { label: "All Products", icon: <FaStore />, link: "/products" },
  { label: "Safaricom Corner", icon: <FaWifi />, link: "/safaricom" },
  { label: "Deals", icon: <FaTags />, link: "/#deals" },
  { label: "New Arrivals", icon: <FaStar />, link: "/products?sort=newest" },
  { label: "Best Sellers", icon: <FaStar />, link: "/products?sort=popular" },
  { label: "Pocket Friendly", icon: <FaTags />, link: "/products?sort=price-low&maxPrice=15000" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Safaricom", href: "/safaricom" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MainNavbar({ brands: brandsProp = [], categories: categoriesProp = [], onMenuClick }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brands, setBrands] = useState(brandsProp);
  const [categories, setCategories] = useState(categoriesProp);

  const shouldFetchBrands = brandsProp.length === 0;
  const shouldFetchCategories = categoriesProp.length === 0;

  useEffect(() => {
    if (!shouldFetchBrands) return;
    Api.get("/brands").then((res) => setBrands(res.data?.brands || res.data || [])).catch(() => setBrands([]));
  }, [shouldFetchBrands]);

  useEffect(() => {
    if (!shouldFetchCategories) return;
    Api.get("/categories").then((res) => setCategories(res.data?.categories || res.data || [])).catch(() => setCategories([]));
  }, [shouldFetchCategories]);

  const openDrawer = () => { setDrawerOpen(true); onMenuClick?.(); };
  const closeDrawer = () => setDrawerOpen(false);
  const handleSearchSelect = (productId) => { setDrawerOpen(false); router.push(`/products/${productId}`); };

  const drawerItem = "flex items-center gap-3 rounded px-2 py-2.5 hover:bg-gray-100";

  return (
    <header className="sticky top-0 z-50 bg-white text-gray-900 shadow-[0_2px_24px_0_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex min-h-16 max-w-screen-2xl items-center gap-2 px-3 md:min-h-[72px] md:px-6">
        <button onClick={openDrawer} className="md:hidden" aria-label="Open menu"><FaBars className="text-2xl" /></button>

        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/snaap-logo.jpeg" alt="Snaap Connections Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="whitespace-nowrap font-bold tracking-[1.5px]">Snaap Connections</span>
        </Link>

        <div className="flex-1" />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="px-2 py-1 text-sm font-medium hover:text-brand-700">{l.label}</Link>
          ))}
          <div className="ml-2 min-w-[220px]">
            <AutoCompleteSearch onSelect={handleSearchSelect} placeholder="Search products, brands, categories..." />
          </div>
        </nav>

        <button onClick={openDrawer} className="text-brand-700 md:hidden" aria-label="Search"><FaSearch className="text-xl" /></button>
      </div>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-[1200] bg-black/40" onClick={closeDrawer} aria-hidden="true" />
          <div className="fixed right-0 top-0 z-[1300] h-full w-[92vw] max-w-[400px] overflow-y-auto rounded-l-3xl bg-gray-50 p-6 shadow-[0_8px_32px_#07598522]">
            <div className="mb-2 flex justify-end">
              <button onClick={closeDrawer} aria-label="Close menu" className="rounded-lg bg-white p-2 shadow"><FaTimes className="text-2xl" /></button>
            </div>
            <p className="mb-2 text-lg font-bold">Menu</p>
            <div className="mb-3"><AutoCompleteSearch onSelect={handleSearchSelect} placeholder="Quick search..." /></div>

            <hr className="my-2 border-gray-200" />
            <ul>
              {menuSections.map((s) => (
                <li key={s.label}>
                  <Link href={s.link} onClick={closeDrawer} className={drawerItem}><span className="text-brand-700">{s.icon}</span> {s.label}</Link>
                </li>
              ))}
            </ul>

            <hr className="my-2 border-gray-200" />
            <p className="mb-1 font-semibold">Categories</p>
            <ul>
              {(categories.length ? categories : [{ name: "Coming Soon" }]).map((cat) => (
                <li key={cat._id || cat.name}>
                  {cat.name ? (
                    <Link href={`/products?category=${encodeURIComponent(cat.name)}`} onClick={closeDrawer} className={drawerItem}>
                      <FaThLarge className="text-brand-700" /> {cat.name}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-3 px-2 py-2.5 text-gray-400"><FaThLarge /> Loading</span>
                  )}
                </li>
              ))}
            </ul>

            <hr className="my-2 border-gray-200" />
            <p className="mb-1 font-semibold">Brands</p>
            <ul>
              {(brands.length ? brands : [{ name: "Coming Soon" }]).map((brand) => (
                <li key={brand._id || brand.name}>
                  {brand.name ? (
                    <Link href={`/products?brand=${encodeURIComponent(brand.name)}`} onClick={closeDrawer} className={drawerItem}>
                      <SiBrandfolder className="text-brand-700" /> {brand.name}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-3 px-2 py-2.5 text-gray-400"><SiBrandfolder /> Loading</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
