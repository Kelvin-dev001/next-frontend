import React from "react";
import Link from "next/link";
import { FaBroadcastTower, FaMoneyBillWave, FaFileInvoiceDollar, FaPhone, FaSms, FaThLarge } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";

const iconMap = {
  iot: <FaBroadcastTower className="text-2xl" />,
  mpesa: <FaMoneyBillWave className="text-2xl" />,
  paybill: <FaFileInvoiceDollar className="text-2xl" />,
  voice: <FaPhone className="text-2xl" />,
  sms: <FaSms className="text-2xl" />,
  default: <FaThLarge className="text-2xl" />,
};

export default function SafaricomCorner({ sections = [] }) {
  const section = sections.find((s) => s.sectionKey === "safaricom_corner" && s.enabled);
  if (!section) return null;

  return (
    <section aria-label="Safaricom Corner" className="py-6 md:py-9">
      <div className="mx-auto max-w-screen-2xl px-4">
        <SectionHeading className="mb-3">{section.title}</SectionHeading>
        {section.subtitle && (
          <p className="mx-auto mb-8 max-w-[720px] text-center text-gray-500">{section.subtitle}</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {section.items.map((item, idx) => {
            const link = item.ctaLink
              ? item.ctaLink
              : `/products?category=${encodeURIComponent(item.category || "")}&search=${encodeURIComponent(item.search || "")}`;

            return (
              <Link
                key={`${item.title}-${idx}`}
                href={link}
                prefetch={false}
                className="relative flex min-h-[170px] flex-col items-center justify-end overflow-hidden rounded-[10px] border border-black/5 bg-white bg-cover bg-center p-4 text-center shadow-[0_5px_18px_rgba(30,60,114,0.08)]"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                {item.image && <span className="absolute inset-0 bg-black/55" aria-hidden="true" />}

                {!item.image && (
                  <span className="relative z-[1] mx-auto mb-3 grid h-14 w-14 place-items-center rounded-lg bg-[#f5f8ff] text-[#1e3c72]">
                    {iconMap[item.iconKey] || iconMap.default}
                  </span>
                )}

                <span className="relative z-[1]">
                  <span className={`block text-sm font-bold ${item.image ? "text-white" : "text-gray-900"}`}>{item.title}</span>
                  {item.subtitle && (
                    <span className={`block text-xs ${item.image ? "text-white/80" : "text-gray-500"}`}>{item.subtitle}</span>
                  )}
                  <span className="mt-1 inline-block rounded-full bg-[#1e3c72] px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">
                    {item.ctaLabel || "View Service"}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
