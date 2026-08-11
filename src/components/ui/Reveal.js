import React from "react";
import useInView from "@/hooks/useInView";

/**
 * Fades and lifts a section into place the first time it scrolls into view.
 *
 * Safety matters more than the effect here: a shop whose sections are stuck at
 * opacity 0 has no catalogue. Two guards —
 *   - useInView falls open to `true` if IntersectionObserver is missing
 *   - globals.css un-hides .section-reveal entirely under `@media (scripting:
 *     none)`, so a visitor without JavaScript sees the full page
 * Reveals fire once and never re-hide.
 *
 * Deliberately not used above the fold: the hero must paint immediately, since
 * it is the LCP element.
 */
export default function Reveal({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView({ once: true, rootMargin: "-40px 0px" });

  return (
    <div
      ref={ref}
      className={`section-reveal ${className}`}
      data-revealed={inView ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
