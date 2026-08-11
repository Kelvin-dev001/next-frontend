import React, { useCallback, useState } from "react";

/**
 * Storefront button primitive (Tailwind — no MUI). Polymorphic via `component`
 * (e.g. next/link) so it can render an <a> while keeping button styling.
 * Part of the P4 Tailwind migration; re-themed onto brand tokens in P8.
 *
 * Colour note: white label text needs brand-600 or darker to clear WCAG AA at
 * this text size. brand-500 (the raw logo blue) is only 3.29:1 against white,
 * so it is used for borders and accents here, never as a fill under white text.
 */
const VARIANTS = {
  // The WhatsApp CTA — the only checkout path on the site, so it gets the
  // brightest passing blue. The glyph is white: the word "WhatsApp" carries the
  // meaning, and green-on-blue would measure ~1.9:1.
  whatsapp: "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_2px_10px_rgba(1,151,212,0.28)]",
  view:
    "border border-brand-300 text-brand-700 hover:text-white hover:border-transparent " +
    "hover:bg-[linear-gradient(96deg,var(--color-brand-400)_10%,var(--color-brand-700)_90%)] " +
    "hover:shadow-[0_2px_20px_rgba(7,89,133,0.45)] hover:scale-[1.03]",
  solid: "bg-brand-700 text-white hover:bg-brand-900",
  outline: "border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white",
};

// Variants that sit on a light background need a tinted ripple — a white one
// would be invisible.
const DARK_RIPPLE = new Set(["view", "outline"]);

export default function Button({
  component: Comp = "button",
  variant = "solid",
  fullWidth = true,
  className = "",
  onPointerDown,
  children,
  ...props
}) {
  const [ripple, setRipple] = useState(null);

  // Decorative only. This never gates the consumer's onClick — ProductCard opens
  // wa.me inside its click handler and popup blockers require that to stay in
  // the user gesture, so the animation has to run alongside, not before.
  const handlePointerDown = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setRipple({
        key: Date.now(),
        x: `${event.clientX - rect.left}px`,
        y: `${event.clientY - rect.top}px`,
      });
      onPointerDown?.(event);
    },
    [onPointerDown]
  );

  const base =
    "relative isolate overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-full " +
    "font-semibold no-underline transition-all duration-200 active:scale-[0.96] " +
    "text-[0.72rem] md:text-[0.92rem] py-2 md:py-2.5 px-4";

  return (
    <Comp
      className={`${base} ${fullWidth ? "w-full" : ""} ${VARIANTS[variant] || ""} ${
        ripple ? "is-pressed" : ""
      } ${className}`}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {children}
      {ripple && (
        <span
          key={ripple.key}
          className="ripple-layer"
          data-tone={DARK_RIPPLE.has(variant) ? "dark" : undefined}
          style={{ "--ripple-x": ripple.x, "--ripple-y": ripple.y }}
          onAnimationEnd={() => setRipple(null)}
          aria-hidden="true"
        />
      )}
    </Comp>
  );
}
