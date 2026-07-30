import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Api } from "@/lib/api";

export default function ShopByCategorySection({ categories: categoriesProp = [] }) {
  const [categories, setCategories] = useState(categoriesProp);
  const shouldFetch = categoriesProp.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let active = true;
    Api.get("/categories")
      .then((res) => { if (!active) return; setCategories(res.data?.categories || res.data || []); })
      .catch(() => setCategories([]));
    return () => { active = false; };
  }, [shouldFetch]);

  const list = useMemo(
    () => (categories && categories.length > 0 ? categories : [{ name: "Coming Soon", icon: "/category-placeholder.png" }]),
    [categories]
  );

  return (
    <section aria-label="Shop by category" className="py-5 md:py-8">
      <div className="mx-auto max-w-screen-2xl px-4">
        <h2 className="mb-6 text-center font-extrabold tracking-wide text-[#1e3c72] text-[1.45rem] md:text-[1.8rem]">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((cat, idx) => (
            <Link
              key={cat._id || idx}
              href={`/products?category=${encodeURIComponent(cat.name || "")}`}
              prefetch={false}
              className="flex min-h-[125px] flex-col items-center gap-2 rounded-[10px] border border-black/5 bg-white p-4 text-center shadow-[0_5px_18px_rgba(30,60,114,0.08)] transition hover:shadow-md"
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-md bg-[#f8fafc] p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.icon || "/category-placeholder.png"} alt={`${cat.name} category`} className="h-10 w-10 object-contain" />
              </span>
              <span className="text-xs font-bold text-[#152c56]">{cat.name || "Loading"}</span>
              <span className="rounded-full bg-[#1e3c72] px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">Explore</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
