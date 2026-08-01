import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Api } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((brand, idx) => (
            <Link
              key={brand._id || idx}
              href={`/products?brand=${encodeURIComponent(brand.name || "")}`}
              prefetch={false}
              className="flex min-h-[120px] flex-col items-center gap-2 rounded-[10px] border border-black/5 bg-white p-4 text-center shadow-[0_5px_18px_rgba(30,60,114,0.08)] transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo || "/brand-placeholder.png"} alt={`${brand.name} logo`} className="h-12 w-12 rounded bg-[#f8fafc] object-contain" />
              <span className="text-xs font-bold text-[#152c56]">{brand.name || "Loading"}</span>
              <span className="rounded-full bg-[#1e3c72] px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">Shop now</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
