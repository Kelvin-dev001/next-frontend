import React from "react";

/**
 * Lifts a section into place as it scrolls into view.
 *
 * Pure CSS, via a scroll-driven animation timeline (see .section-reveal in
 * globals.css). There is no JavaScript in this path at all — no observer, no
 * state, nothing to hydrate.
 *
 * That is a deliberate correction. An IntersectionObserver version left
 * sections pinned at opacity 0 whenever callbacks were throttled, which on a
 * shop means the catalogue disappears. Here the hidden state only ever exists
 * inside `@supports (animation-timeline: view())`: a browser without support,
 * or with reduce-motion set, renders the section plainly visible and there is
 * no failure mode that can hide content.
 *
 * Not used above the fold — the hero must paint immediately, it is the LCP
 * element.
 */
export default function Reveal({ children, className = "" }) {
  return <div className={`section-reveal ${className}`}>{children}</div>;
}
