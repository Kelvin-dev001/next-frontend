import React from "react";
import { FaTruck, FaWhatsapp, FaClock } from "react-icons/fa";
import Marquee from "@/components/ui/Marquee";
import { SAME_DAY_COUNTIES, HOURS_DISPLAY } from "@/constants/business";

/**
 * The band directly under the navbar, on every storefront page.
 *
 * Every fact here is derived from constants/business.js — the delivery matrix
 * and the opening hours are business facts with exactly one source, and this
 * bar is seen on every page, so a hardcoded copy would be the most visible
 * possible place to drift.
 *
 * brand-700 rather than the raw logo blue: white text this size needs 4.5:1 and
 * brand-500 only reaches 3.29:1.
 */
const MESSAGES = [
  { key: "delivery", Icon: FaTruck, text: `Same-day delivery in ${SAME_DAY_COUNTIES.join(", ")}` },
  { key: "whatsapp", Icon: FaWhatsapp, text: "Order on WhatsApp" },
  { key: "hours", Icon: FaClock, text: `Open ${HOURS_DISPLAY}` },
];

export default function TopInfoMarquee() {
  return (
    <div className="bg-brand-700 text-white">
      <Marquee
        items={MESSAGES}
        itemKey={(m) => m.key}
        renderItem={({ Icon, text }) => (
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-[0.78rem] font-medium md:text-[0.85rem]">
            <Icon className="shrink-0 text-brand-300" aria-hidden="true" />
            {text}
          </span>
        )}
        gap="3rem"
        speed={55}
        className="py-2"
        aria-label="Delivery, ordering and opening hours"
      />
    </div>
  );
}
