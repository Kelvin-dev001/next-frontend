import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaWhatsapp } from "react-icons/fa";
import { waLink, HOURS_DISPLAY } from "@/constants/business";

const CHAT_LINK = waLink("Hello Snaap Connections, I'd like some help.");

// Pages with a bar pinned to the bottom on phones (checkout's "Place order").
const RAISED_ON = new Set(["/checkout"]);

/**
 * Persistent WhatsApp SUPPORT entry point, on every storefront page.
 *
 * Since P10-3 orders are placed on the site; WhatsApp is how a customer reaches
 * a person for help (owner, 27 Oct 2026), so it stays one tap away. This is
 * the one control that keeps WhatsApp green: it carries no label, so colour is
 * the only thing telling you what it opens.
 *
 * z-index sits below the mobile nav drawer (1200/1300 in MainNavbar), or it
 * would float over an open menu.
 */
export default function FloatingWhatsApp() {
  const { pathname } = useRouter();
  const raised = RAISED_ON.has(pathname);
  const [visible, setVisible] = useState(false);

  // Held back briefly so it animates in after the page has settled instead of
  // competing with the hero for attention on first paint.
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // In a labelled landmark so it isn't stray content outside every region
  // (axe "region"). The link itself is fixed-position; the aside adds no layout.
  return (
    <aside aria-label="WhatsApp support">
    <a
      href={CHAT_LINK}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      title={`Chat with us on WhatsApp — ${HOURS_DISPLAY}`}
      data-visible={visible ? "true" : "false"}
      className={`wa-fab group fixed ${raised ? "bottom-24" : "bottom-5"} right-4 z-[1100] flex h-14 min-w-14 items-center gap-2 rounded-full bg-wa px-4 text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] transition-[width,background-color,box-shadow] hover:bg-wa-dark hover:shadow-[0_8px_28px_rgba(37,211,102,0.6)] active:scale-95 md:bottom-6 md:right-6`}
    >
      <FaWhatsapp className="shrink-0 text-[1.6rem]" aria-hidden="true" />
      {/* Expands to a label on pointer devices; stays a 56px circle on touch,
          where screen space is scarce and the glyph is already understood. */}
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[0.9rem] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100 md:inline">
        Chat with us
      </span>
    </a>
    </aside>
  );
}
