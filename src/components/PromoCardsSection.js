import React from "react";
import Image from "next/image";
import Link from "next/link";

// NOTE: promo content is hardcoded and largely non-catalogue — that's a P3 item
// (move into the /homepage-sections API). This file only migrates the styling.
const promoCards = [
  {
    id: "valentine-announcement",
    type: "announcement",
    badge: "LIMITED TIME",
    title: "Ramadhan's Upgrade Offer",
    subtitle: "Save big on select phones + free accessories this ramadhan. Fast the smart way as the offer moves fast!!.",
    cta: "Shop Ramadhan Deals",
    href: "/products?tag=valentine",
    image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1771914267/WHY_OPPO_RENO_15_4.jpg_zeipio.jpg",
    alt: "Ramadhan limited time phone offer announcement",
    tone: "soft",
  },
  { id: "offer-1", type: "phone", badge: "NEW IN STOCK", title: "Samsung S26 ultra", subtitle: "Up to 10% off + Amazing gifts", cta: "Buy Samsung S26 Ultra Today!", href: "/products?brand=Samsung", image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1773067312/tecno_tls7em.png", alt: "Samsung S26 Series", tone: "light" },
  { id: "offer-2", type: "phone", badge: "FRESH DEAL", title: "Camon 50 Series", subtitle: "Limited drop with launch pricing", cta: "Shop Camon 50", href: "/products?brand=Tecno", image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954814/camon50_q889gg.png", alt: "Camon 40 Series promo phone", tone: "cool" },
  { id: "offer-3", type: "phone", badge: "ONE MORE DEAL", title: "Redmi Note 15", subtitle: "Premium upgrades. Up to 10% off.", cta: "Explore Redmi Deals", href: "/products?brand=Infinix.", image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954598/Redmi_Note_15_ti0s4t.png", alt: "Redmi Note 15 Series promo phone", tone: "dark" },
  { id: "offer-4", type: "phone", badge: "MAKE THE UPGRADE", title: "Galaxy S26 Series", subtitle: "2‑year warranty + fast delivery", cta: "Shop Galaxy S26", href: "/products?brand=Samsung", image: "https://res.cloudinary.com/dltfgasbb/image/upload/v1770954625/s26ultra_yizrni.png", alt: "Galaxy S26 Series promo phone", tone: "midnight" },
];

const toneStyles = {
  soft: { background: "linear-gradient(180deg, #fff5f7 0%, #ffeef1 100%)", text: "#3a1b2b", chip: "#b4235f" },
  light: { background: "linear-gradient(180deg, #f7f7f7 0%, #f1f1f1 100%)", text: "#1c1c1c", chip: "#b42318" },
  cool: { background: "linear-gradient(180deg, #e9f3ff 0%, #dcecff 100%)", text: "#123252", chip: "#2e7d32" },
  dark: { background: "linear-gradient(180deg, #0b0b0b 0%, #151515 100%)", text: "#ffffff", chip: "#ef4444" },
  midnight: { background: "linear-gradient(180deg, #0b1533 0%, #101b3c 100%)", text: "#ffffff", chip: "#3b82f6" },
};

function PromoCard({ card, priority = false }) {
  const styles = toneStyles[card.tone] || toneStyles.light;
  const isAnnouncement = card.type === "announcement";
  return (
    <div
      className="grid min-h-[320px] items-center overflow-hidden rounded-3xl border border-white/70 shadow-[0_12px_36px_rgba(17,24,39,0.12)] md:grid-cols-[1.1fr_0.9fr]"
      style={{ background: styles.background, color: styles.text }}
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col items-start gap-[1.3rem]">
          <span className="w-fit rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white" style={{ background: styles.chip }}>
            {card.badge}
          </span>
          <h2 className={`font-extrabold leading-tight ${isAnnouncement ? "text-[1.8rem] md:text-[2.4rem]" : "text-[1.6rem] md:text-[2rem]"}`}>
            {card.title}
          </h2>
          <p className="opacity-90 text-[0.98rem] md:text-[1.05rem]">{card.subtitle}</p>
          <Link href={card.href} prefetch={false} aria-label={card.cta} className="w-fit rounded-full bg-[#111827] px-6 py-2.5 font-bold text-white transition hover:bg-[#0f172a]">
            {card.cta}
          </Link>
        </div>
      </div>
      <div className="relative min-h-[220px] md:min-h-[280px]">
        <Image src={card.image} alt={card.alt} fill priority={priority} sizes="(max-width: 600px) 90vw, (max-width: 1200px) 40vw, 420px" style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

export default function PromoCardsSection() {
  const announcement = promoCards.find((c) => c.type === "announcement");
  const offers = promoCards.filter((c) => c.type !== "announcement");

  return (
    <section aria-label="Promotions" className="py-4 md:py-8">
      <div className="mx-auto max-w-screen-2xl px-4">
        {announcement && (
          <div className="mb-3 md:mb-4">
            <PromoCard card={announcement} priority />
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {offers.map((card) => (
            <PromoCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
