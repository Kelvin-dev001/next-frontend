import React from "react";
import Link from "next/link";
import {
  FaBroadcastTower, FaMoneyBillWave, FaFileInvoiceDollar, FaPhone, FaSms, FaThLarge,
  FaSimCard, FaWifi, FaHome, FaStore, FaWallet, FaMobileAlt, FaNetworkWired, FaLaptop,
  FaMoneyCheckAlt, FaHeadset,
} from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import TwoRowMarquee from "@/components/ui/TwoRowMarquee";

const iconMap = {
  iot: <FaBroadcastTower className="text-3xl" />,
  mpesa: <FaMoneyBillWave className="text-3xl" />,
  paybill: <FaFileInvoiceDollar className="text-3xl" />,
  voice: <FaPhone className="text-3xl" />,
  sms: <FaSms className="text-3xl" />,
  // Safaricom Corner service tiles (P7)
  sim: <FaSimCard className="text-3xl" />,
  data: <FaWifi className="text-3xl" />,
  fibre: <FaHome className="text-3xl" />,
  business: <FaStore className="text-3xl" />,
  pochi: <FaWallet className="text-3xl" />,
  app: <FaMobileAlt className="text-3xl" />,
  connectivity: <FaNetworkWired className="text-3xl" />,
  devices: <FaLaptop className="text-3xl" />,
  bulk: <FaMoneyCheckAlt className="text-3xl" />,
  support: <FaHeadset className="text-3xl" />,
  default: <FaThLarge className="text-3xl" />,
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

        <TwoRowMarquee
          items={section.items}
          label="the Safaricom services carousel"
          itemKey={(item, idx) => `${item.title}-${idx}`}
          renderItem={(item) => {
            const link = item.ctaLink
              ? item.ctaLink
              : `/products?category=${encodeURIComponent(item.category || "")}&search=${encodeURIComponent(item.search || "")}`;

            return (
              <Link
                href={link}
                prefetch={false}
                className="relative flex h-[200px] w-[190px] flex-col items-center justify-end overflow-hidden rounded-[10px] border border-black/5 bg-white bg-cover bg-center p-5 text-center shadow-[0_5px_18px_rgba(7,89,133,0.08)] transition hover:-translate-y-0.5 hover:shadow-md md:w-[220px]"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                {item.image && <span className="absolute inset-0 bg-black/55" aria-hidden="true" />}

                {!item.image && (
                  <span className="relative z-[1] mx-auto mb-3 grid h-16 w-16 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    {iconMap[item.iconKey] || iconMap.default}
                  </span>
                )}

                <span className="relative z-[1]">
                  <span className={`block text-base font-bold ${item.image ? "text-white" : "text-gray-900"}`}>{item.title}</span>
                  {item.subtitle && (
                    <span className={`block text-xs ${item.image ? "text-white/80" : "text-gray-500"}`}>{item.subtitle}</span>
                  )}
                  <span className="mt-1 inline-block rounded-full bg-brand-600 px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">
                    {item.ctaLabel || "View Service"}
                  </span>
                </span>
              </Link>
            );
          }}
        />
      </div>
    </section>
  );
}
