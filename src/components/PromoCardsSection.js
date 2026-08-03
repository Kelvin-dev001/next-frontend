import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSection, splitPromo } from "@/utils/sections";

// P3: promo cards are now admin-managed (the /homepage-sections "promo_cards"
// section), server-filtered for scheduling in getStaticProps. No hardcoded cards —
// that's what let four phantom "phones we don't stock" ship on the homepage.

const toneStyles = {
  soft: { background: "linear-gradient(180deg, #fff5f7 0%, #ffeef1 100%)", text: "#3a1b2b", chip: "#b4235f" },
  light: { background: "linear-gradient(180deg, #f7f7f7 0%, #f1f1f1 100%)", text: "#1c1c1c", chip: "#b42318" },
  cool: { background: "linear-gradient(180deg, #e9f3ff 0%, #dcecff 100%)", text: "#123252", chip: "#2e7d32" },
  dark: { background: "linear-gradient(180deg, #0b0b0b 0%, #151515 100%)", text: "#ffffff", chip: "#ef4444" },
  midnight: { background: "linear-gradient(180deg, #0b1533 0%, #101b3c 100%)", text: "#ffffff", chip: "#3b82f6" },
};

function PromoCard({ card, priority = false, asH1 = false }) {
  const styles = toneStyles[card.tone] || toneStyles.light;
  const isAnnouncement = card.type === "announcement";
  const Heading = asH1 ? "h1" : "h2";
  return (
    <div
      className="grid min-h-[320px] items-center overflow-hidden rounded-3xl border border-white/70 shadow-[0_12px_36px_rgba(17,24,39,0.12)] md:grid-cols-[1.1fr_0.9fr]"
      style={{ background: styles.background, color: styles.text }}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-start gap-[1.3rem]">
          {card.badge && (
            <span className="w-fit rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white" style={{ background: styles.chip }}>
              {card.badge}
            </span>
          )}
          <Heading className={`font-extrabold leading-tight ${isAnnouncement ? "text-[1.8rem] md:text-[2.4rem]" : "text-[1.6rem] md:text-[2rem]"}`}>
            {card.title}
          </Heading>
          {card.subtitle && <p className="opacity-90 text-[0.98rem] md:text-[1.05rem]">{card.subtitle}</p>}
          {card.ctaLink && (
            <Link
              href={card.ctaLink}
              prefetch={false}
              aria-label={card.ctaLabel || card.title}
              className="w-fit rounded-full bg-[#111827] px-6 py-2.5 font-bold text-white transition hover:bg-[#0f172a]"
            >
              {card.ctaLabel || "Shop now"}
            </Link>
          )}
        </div>
      </div>
      {card.image && (
        <div className="relative min-h-[220px] md:min-h-[280px]">
          <Image
            src={card.image}
            alt={card.alt || card.title}
            fill
            priority={priority}
            sizes="(max-width: 600px) 90vw, (max-width: 1200px) 40vw, 420px"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}

export default function PromoCardsSection({ sections = [], renderAnnouncementHeading = false }) {
  const section = getSection(sections, "promo_cards");
  if (!section) return null;

  const { announcement, offers } = splitPromo(section);
  if (!announcement && offers.length === 0) return null;

  return (
    <section aria-label="Promotions" className="py-4 md:py-8">
      <div className="mx-auto max-w-screen-2xl px-4">
        {announcement && (
          <div className="mb-3 md:mb-4">
            <PromoCard card={announcement} priority asH1={renderAnnouncementHeading} />
          </div>
        )}
        {offers.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {offers.map((card, i) => (
              <PromoCard key={card._id || card.title || i} card={card} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
