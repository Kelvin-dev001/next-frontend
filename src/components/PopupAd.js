import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";
import ctaTarget from "@/utils/ctaTarget";

const DISMISS_KEY = "snaap_popup_dismissed";
const SEEN_KEY = "snaap_popup_seen";
const DISMISS_DAYS = 7;
const DELAY_MS = 6000;

function dismissedAd() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.until || parsed.until < Date.now()) return null;
    return parsed;
  } catch {
    // Private mode, quota, corrupted value — all mean "no record", never a crash.
    return null;
  }
}

/**
 * The entry advert.
 *
 * Deliberately restrained, because the whole engagement so far has been about
 * getting this site indexed: Google demotes a mobile page whose content is
 * covered by an interstitial right after a search arrival, so an advert that
 * lands instantly and full-screen would spend the ranking that P1–P5 bought.
 * Hence, in order of importance:
 *
 *  - it waits ~6 seconds, or until the visitor scrolls, whichever is first.
 *    It is never the first thing a page does.
 *  - on a phone it is a bottom sheet with NO backdrop. The page behind stays
 *    readable and usable, which is exactly the distinction Google draws
 *    between a banner and an interstitial. The dimmed backdrop only appears at
 *    640px and up, where the rule does not apply.
 *  - it never traps focus and never locks scrolling. An uninvited advert has
 *    not earned the right to take the keyboard away from someone mid-page.
 *  - once dismissed it stays gone for a week, keyed to the advert's id, so a
 *    new campaign can still reach someone who closed the last one.
 *  - it shows at most once per browsing session even if it is ignored rather
 *    than dismissed, so it cannot follow someone from page to page.
 *
 * Mounted client-only from _app, so it costs the served HTML nothing and does
 * not appear in the rendered layout a crawler evaluates.
 */
export default function PopupAd() {
  const [ad, setAd] = useState(null);
  const [open, setOpen] = useState(false);
  const armedRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(
        DISMISS_KEY,
        JSON.stringify({ id: ad?._id || "", until: Date.now() + DISMISS_DAYS * 86400000 })
      );
    } catch {
      // Nothing to do — worst case the advert is offered again next session.
    }
  }, [ad]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const reveal = async () => {
      if (armedRef.current) return;
      armedRef.current = true;
      window.removeEventListener("scroll", reveal);

      try {
        const res = await fetch("/api/popup-ad");
        const data = await res.json();
        if (cancelled || !data?.ad) return;

        const skip = dismissedAd();
        if (skip && skip.id === data.ad._id) return;

        try {
          window.sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // Non-fatal: the once-per-session cap is a courtesy, not a guarantee.
        }
        setAd(data.ad);
        setOpen(true);
      } catch {
        // No advert is a perfectly good outcome.
      }
    };

    // Anything already decided is decided before a request is made: a visitor
    // who dismissed this week never costs themselves a round trip.
    try {
      if (window.sessionStorage.getItem(SEEN_KEY)) return undefined;
    } catch {
      /* storage unavailable — carry on */
    }

    timer = window.setTimeout(reveal, DELAY_MS);
    window.addEventListener("scroll", reveal, { passive: true, once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open || !ad) return null;

  const { href, external } = ctaTarget(ad);
  const Wrapper = external ? "a" : Link;
  const wrapperProps = external
    ? { href, target: "_blank", rel: "noopener" }
    : { href, prefetch: false };
  const artwork = getOptimizedCloudinaryUrl(ad.imageMobile || ad.image, { width: 640 });

  return (
    <div
      // Mobile has no backdrop, so this layer must not swallow taps meant for
      // the page behind it — hence pointer-events-none there. From sm up it IS
      // a real backdrop: it dims, it catches pointer events, and it closes.
      className="pointer-events-none fixed inset-0 z-[1200] flex items-end justify-center sm:pointer-events-auto sm:items-center sm:bg-black/50 sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-label={ad.title ? `Offer: ${ad.title}` : "Special offer"}
        className="pointer-events-auto relative w-full overflow-hidden rounded-t-2xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.25)] sm:max-w-sm sm:rounded-2xl sm:shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close this offer"
          className="absolute right-2 top-2 z-[2] grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
        >
          <FaTimes aria-hidden="true" />
        </button>

        <Wrapper {...wrapperProps} className="block no-underline" onClick={close}>
          {artwork && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artwork}
              alt={ad.alt || ad.title || "Offer"}
              className="h-auto w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}

          {(ad.title || ad.subtitle || ad.ctaLabel) && (
            <div className="p-4">
              {ad.title && <p className="m-0 text-[1.05rem] font-extrabold text-brand-700">{ad.title}</p>}
              {ad.subtitle && <p className="mt-1 mb-0 text-[0.9rem] text-gray-600">{ad.subtitle}</p>}
              {ad.ctaLabel && (
                <span className="mt-3 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-[0.85rem] font-bold text-white">
                  {ad.ctaLabel}
                </span>
              )}
            </div>
          )}
        </Wrapper>
      </div>
    </div>
  );
}
