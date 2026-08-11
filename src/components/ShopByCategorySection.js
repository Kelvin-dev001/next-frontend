import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Api } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";
import TwoRowMarquee from "@/components/ui/TwoRowMarquee";

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
        <SectionHeading>Shop by Category</SectionHeading>
        <TwoRowMarquee
          items={list}
          label="the category carousel"
          itemKey={(cat, idx) => cat._id || `${cat.name}-${idx}`}
          renderItem={(cat) => (
            <Link
              href={`/products?category=${encodeURIComponent(cat.name || "")}`}
              prefetch={false}
              className="flex h-full w-[150px] flex-col items-center gap-2 rounded-[10px] border border-black/5 bg-white p-4 text-center shadow-[0_5px_18px_rgba(7,89,133,0.08)] transition hover:-translate-y-0.5 hover:shadow-md md:w-[172px]"
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-md bg-brand-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.icon || "/category-placeholder.png"} alt={`${cat.name} category`} className="h-10 w-10 object-contain" />
              </span>
              <span className="text-xs font-bold text-brand-900">{cat.name || "Loading"}</span>
              <span className="mt-auto rounded-full bg-brand-600 px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">Explore</span>
            </Link>
          )}
        />
      </div>
    </section>
  );
}
