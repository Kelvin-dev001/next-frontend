import React, { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import ProductMarquee from "@/components/ProductMarquee";
import useInView from "@/hooks/useInView";

const dealTypes = [
  { key: "dealOfTheDay", label: "🔥 Deal of the Day" },
  { key: "flashSale", label: "⚡ Flash Sale" },
  { key: "limitedOffer", label: "🎯 Limited Offer" },
];

function getTimeLeft(expiry) {
  if (!expiry) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = new Date(expiry) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function TimeBox({ value, label }) {
  return (
    <span className="min-w-8 rounded bg-red-600 px-1.5 py-0.5 text-center font-bold text-white text-[0.75rem] md:text-[0.85rem]">
      {String(value).padStart(2, "0")}{label}
    </span>
  );
}

/**
 * Counts down to a real `dealExpiry` supplied by the API — not a rolling fake
 * duration. If the API sends no expiry, nothing renders.
 *
 * The tick only runs while the row is on screen. A one-second interval that
 * re-renders forever is a genuine battery cost on the handsets this shop sells
 * to, and there are three of these on the homepage.
 */
function CountdownTimer({ expiry }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiry));
  const [ref, inView] = useInView({ rootMargin: "80px" });

  useEffect(() => {
    if (!expiry || !inView) return;
    const sync = () => setTimeLeft(getTimeLeft(expiry));
    // Catch up immediately on scroll-back-in (the value went stale while the
    // interval was stopped), then tick normally.
    const frame = requestAnimationFrame(sync);
    const interval = setInterval(sync, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, [expiry, inView]);

  if (!expiry) return null;
  if (timeLeft.expired) {
    return (
      <span ref={ref} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
        Expired
      </span>
    );
  }

  return (
    <div ref={ref} className="flex items-center gap-1.5">
      <span className="rounded border border-gray-300 px-2 py-0.5 text-xs">Ends in:</span>
      {timeLeft.days > 0 && <TimeBox value={timeLeft.days} label="d" />}
      <TimeBox value={timeLeft.hours} label="h" />
      <TimeBox value={timeLeft.minutes} label="m" />
      <TimeBox value={timeLeft.seconds} label="s" />
    </div>
  );
}

export default function DealsSection() {
  const [deals, setDeals] = useState({ dealOfTheDay: [], flashSale: [], limitedOffer: [] });

  useEffect(() => {
    Api.get("/products/deals/active")
      .then((res) => setDeals(res.data?.deals || { dealOfTheDay: [], flashSale: [], limitedOffer: [] }))
      .catch(() => setDeals({ dealOfTheDay: [], flashSale: [], limitedOffer: [] }));
  }, []);

  const hasAnyDeals = dealTypes.some(({ key }) => deals[key]?.length > 0);
  // Nothing to show while the fetch is in flight either — otherwise the section
  // would render as a bare pause button with no rails under it.
  if (!hasAnyDeals) return null;

  return (
    <section id="deals" className="py-4 md:py-8">
      {dealTypes.map(({ key, label }, rowIndex) => {
        const items = deals[key] || [];
        if (!items.length) return null;
        const earliestExpiry = items.map((p) => p.dealExpiry).filter(Boolean).sort()[0];

        return (
          <div key={key} className="mb-4 md:mb-6 md:px-2">
            <div className="mb-2 flex flex-col items-start gap-1 px-1.5 sm:flex-row sm:items-center sm:justify-between md:px-0">
              <h2 className="font-bold tracking-wide text-brand-900 text-[1.1rem] md:text-[1.4rem]">{label}</h2>
              <CountdownTimer expiry={earliestExpiry} />
            </div>
            {/* Alternating direction so three stacked rails don't read as one
                sliding block. */}
            <ProductMarquee
              products={items}
              direction={rowIndex % 2 === 0 ? "left" : "right"}
            />
          </div>
        );
      })}
    </section>
  );
}
