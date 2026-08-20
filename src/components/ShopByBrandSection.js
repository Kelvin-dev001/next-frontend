import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Api } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";
import TwoRowMarquee from "@/components/ui/TwoRowMarquee";

export default function ShopByBrandSection({ brands: brandsProp = [] }) {
  const [brands, setBrands] = useState(brandsProp);
  const shouldFetch = brandsProp.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    let active = true;
    Api.get("/brands")
      .then((res) => { if (!active) return; setBrands(res.data?.brands || res.data || []); })
      .catch(() => setBrands([]));
    return () => { active = false; };
  }, [shouldFetch]);

  const list = useMemo(
    () => (brands && brands.length > 0 ? brands : [{ name: "Coming Soon", logo: "/brand-placeholder.png" }]),
    [brands]
  );

  return (
    <section aria-label="Shop by top brands" className="py-5 md:py-8">
      <div className="mx-auto max-w-screen-2xl px-4">
        <SectionHeading>Shop by Top Brands</SectionHeading>
        {/* Two looping rows rather than an open grid: the section stays exactly
            two rows tall however many brands the shop carries. */}
        <TwoRowMarquee
          items={list}
          itemKey={(brand, idx) => brand._id || `${brand.name}-${idx}`}
          renderItem={(brand) => (
            <Link
              href={`/products?brand=${encodeURIComponent(brand.name || "")}`}
              prefetch={false}
              className="flex h-full w-[150px] flex-col items-center gap-2 rounded-[10px] border border-black/5 bg-white p-4 text-center shadow-[0_5px_18px_rgba(7,89,133,0.08)] transition hover:-translate-y-0.5 hover:shadow-md md:w-[172px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo || "/brand-placeholder.png"} alt={`${brand.name} logo`} className="h-12 w-12 rounded bg-brand-50 object-contain" />
              <span className="text-xs font-bold text-brand-900">{brand.name || "Loading"}</span>
              <span className="mt-auto rounded-full bg-brand-600 px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">Shop now</span>
            </Link>
          )}
        />
      </div>
    </section>
  );
}
