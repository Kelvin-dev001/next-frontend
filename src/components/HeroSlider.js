import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSection } from "@/utils/sections";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";
import ctaTarget from "@/utils/ctaTarget";
import useReducedMotion from "@/hooks/useReducedMotion";
import useInView from "@/hooks/useInView";
import MotionToggle from "@/components/ui/MotionToggle";

const AUTOPLAY_MS = 6000;

/**
 * Admin-managed banner carousel. Two placements on the homepage, both fed from
 * the existing HomepageSection model under the sectionKeys "hero_slider_top"
 * and "hero_slider_mid" — see components/admin/HeroSlidesManager.js.
 *
 * Built on native scroll-snap rather than a carousel library: swipe, momentum
 * and keyboard scrolling all come free from the platform, and it costs no
 * bundle. react-slick is installed in this repo but was never worth its weight.
 *
 * Slides arrive through getStaticProps, so every banner is a real <a href> in
 * the served HTML. Slide captions are <p>, not headings — these are promotional
 * images whose text repeats the destination page, and the homepage's single
 * <h1> invariant (see pages/index.js) must not be disturbed.
 */
export default function HeroSlider({ sections = [], sectionKey, priority = false }) {
  const section = getSection(sections, sectionKey);
  const slides = (section?.items || []).filter((item) => item && item.image);

  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [rootRef, inView] = useInView({ rootMargin: "0px" });
  const reducedMotion = useReducedMotion();

  const goTo = useCallback((next) => {
    const track = trackRef.current;
    if (!track) return;
    // Move the indicator immediately rather than waiting for the smooth scroll
    // to settle — handleScroll then keeps it honest when the visitor swipes.
    setIndex(next);
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }, []);

  // Autoplay. Stops when paused by the control, while the visitor is
  // interacting, when the slider is scrolled out of view, when the tab is
  // hidden, and entirely under reduce-motion.
  useEffect(() => {
    if (reducedMotion || paused || interacting || !inView || slides.length < 2) return;

    const tick = () => {
      if (document.hidden) return;
      const track = trackRef.current;
      if (!track) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      goTo((current + 1) % slides.length);
    };

    const id = setInterval(tick, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reducedMotion, paused, interacting, inView, slides.length, goTo]);

  // Keep the dots in step with wherever the visitor has swiped to.
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track || !track.clientWidth) return;
      setIndex(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  if (!section || slides.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={section.title || "Featured offers"}
      className="mx-auto max-w-screen-2xl px-4 py-3 md:py-5"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="group relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
        >
          {slides.map((slide, i) => {
            const { href, external } = ctaTarget(slide);
            const Wrapper = external ? "a" : Link;
            const wrapperProps = external
              ? { href, target: "_blank", rel: "noopener" }
              : { href, prefetch: false };

            return (
              <div
                key={slide._id || `${slide.title}-${i}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                className="w-full shrink-0 snap-start"
              >
                <Wrapper
                  {...wrapperProps}
                  className="relative block aspect-[16/9] w-full overflow-hidden rounded-2xl md:aspect-[64/21]"
                >
                  <Image
                    src={getOptimizedCloudinaryUrl(slide.image, { width: 1920 }) || slide.image}
                    alt={slide.alt || slide.title || "Promotional banner"}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    // Only the first slide of the top placement is eager: it is
                    // the homepage LCP element. The rest must stay lazy or the
                    // hero costs five full-width images on a metered connection.
                    priority={priority && i === 0}
                  />

                  {(slide.title || slide.subtitle || slide.ctaLabel) && (
                    <>
                      {/* Banner artwork is uploaded by the shop and is often
                          busy, so the scrim has to be strong enough to carry
                          white text over anything. */}
                      <span
                        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/5"
                        aria-hidden="true"
                      />
                      <span className="absolute inset-y-0 left-0 flex max-w-[85%] flex-col justify-center gap-1.5 p-5 text-left md:max-w-[55%] md:gap-3 md:p-10">
                        {slide.title && (
                          <span className="text-[1.15rem] font-extrabold leading-tight text-white drop-shadow md:text-[2.2rem]">
                            {slide.title}
                          </span>
                        )}
                        {slide.subtitle && (
                          <span className="text-[0.78rem] text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)] md:text-[1.05rem]">
                            {slide.subtitle}
                          </span>
                        )}
                        {slide.ctaLabel && (
                          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-[0.75rem] font-bold text-white transition group-hover:bg-brand-500 md:px-6 md:py-2.5 md:text-[0.95rem]">
                            {slide.ctaLabel}
                          </span>
                        )}
                      </span>
                    </>
                  )}
                </Wrapper>
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo((index - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-700 shadow transition hover:bg-white md:grid"
            >
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo((index + 1) % slides.length)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-700 shadow transition hover:bg-white md:grid"
            >
              <FaChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={`dot-${slide._id || i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-600" : "w-2 bg-brand-200 hover:bg-brand-300"
                }`}
              />
            ))}
          </div>
          <MotionToggle
            paused={paused}
            onToggle={() => setPaused((p) => !p)}
            label="the banner carousel"
            tone="dark"
          />
        </div>
      )}
    </section>
  );
}
