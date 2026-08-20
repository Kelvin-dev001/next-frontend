import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import SectionHeading from "@/components/ui/SectionHeading";
import TwoRowMarquee from "@/components/ui/TwoRowMarquee";
import ServiceIcon from "@/components/safaricomIcons";

/**
 * The Safaricom strip on the homepage.
 *
 * Green since P9, and the only green section on an otherwise azure page: the
 * colour is what tells a visitor they have crossed into the Safaricom side of
 * the shop before they read a word. Tiles use saf-600 for anything with white
 * text on it — the identity green is 2.85:1 against white and fails at every
 * size (see globals.css).
 *
 * Tiles are admin-managed (the `safaricom_corner` homepage section), so their
 * icons arrive as an `iconKey` string — resolved through the same map the
 * /safaricom hub uses, so a service looks the same in both places.
 */
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
                className="relative flex h-[200px] w-[190px] flex-col items-center justify-end overflow-hidden rounded-[10px] border border-black/5 bg-white bg-cover bg-center p-5 text-center shadow-[0_5px_18px_rgba(0,96,31,0.10)] transition hover:-translate-y-0.5 hover:shadow-md md:w-[220px]"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                {item.image && <span className="absolute inset-0 bg-black/55" aria-hidden="true" />}

                {!item.image && (
                  <span className="relative z-[1] mx-auto mb-3 grid h-16 w-16 place-items-center rounded-lg bg-saf-50 text-saf-700">
                    <ServiceIcon iconKey={item.iconKey} />
                  </span>
                )}

                <span className="relative z-[1]">
                  <span className={`block text-base font-bold ${item.image ? "text-white" : "text-gray-900"}`}>{item.title}</span>
                  {item.subtitle && (
                    <span className={`block text-xs ${item.image ? "text-white/80" : "text-gray-500"}`}>{item.subtitle}</span>
                  )}
                  <span className="mt-1 inline-block rounded-full bg-saf-600 px-2 py-0.5 text-[0.68rem] font-bold tracking-wide text-white">
                    {item.ctaLabel || "View Service"}
                  </span>
                </span>
              </Link>
            );
          }}
        />

        {/* The strip had twelve destinations and no front door until P9. */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/safaricom"
            className="inline-flex items-center gap-2 rounded-full border border-saf-300 px-4 py-2 text-[0.85rem] font-bold text-saf-700 no-underline transition hover:bg-saf-50"
          >
            See all Safaricom services &amp; devices
            <FaChevronRight className="text-[0.7rem]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
