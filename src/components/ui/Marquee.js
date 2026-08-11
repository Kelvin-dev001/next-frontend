import React, { useEffect, useRef, useState } from "react";
import useInView from "@/hooks/useInView";

const MIN_COPIES = 2;
const MAX_COPIES = 8;

/**
 * Horizontal looping rail. The single motion primitive for the storefront —
 * the top info bar, the deals rails and the two-row category / brand /
 * Safaricom loops all sit on top of this.
 *
 * How it loops seamlessly at any content length: the list is rendered as N
 * side-by-side copies and the track is translated by exactly one copy's width
 * (measured, exposed as --marquee-shift). N is chosen so the copies always
 * overrun the rail — with a fixed two copies, a short list like 14 brand logos
 * on a desktop would drag a block of empty space across the screen.
 *
 * Only the FIRST copy is real. The rest are aria-hidden + inert, so a screen
 * reader hears the brand list once and tab order visits each link once.
 *
 * Behaviour:
 *  - pauses on hover, on keyboard focus inside it, and while off-screen
 *    (a rail animating off-screen is real battery cost on a 3G handset)
 *  - `paused` lets a parent drive it from a visible control — WCAG 2.2.2, since
 *    content that starts moving on its own must be stoppable
 *  - under prefers-reduced-motion it degrades to a plain swipe rail, handled
 *    entirely in globals.css so server and client markup stay identical
 */
export default function Marquee({
  items = [],
  renderItem,
  itemKey,
  direction = "left",
  speed = 45, // px per second
  gap = "1rem",
  paused = false,
  pauseOnHover = true,
  className = "",
  ...rest
}) {
  const copyRef = useRef(null);
  const [rootRef, inView] = useInView({ rootMargin: "150px" });
  const [hovered, setHovered] = useState(false);
  const [shift, setShift] = useState(0);
  const [copies, setCopies] = useState(MIN_COPIES);

  useEffect(() => {
    const copy = copyRef.current;
    const root = rootRef.current;
    if (!copy || !root) return;

    const measure = () => {
      const copyWidth = copy.offsetWidth;
      if (!copyWidth) return;
      setShift(copyWidth);
      setCopies(
        Math.min(MAX_COPIES, Math.max(MIN_COPIES, Math.ceil(root.clientWidth / copyWidth) + 1))
      );
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    observer.observe(root);
    return () => observer.disconnect();
  }, [items, rootRef]);

  if (!items.length || typeof renderItem !== "function") return null;

  const isPaused = paused || !inView || (pauseOnHover && hovered);
  const keyFor = (item, index) => (itemKey ? itemKey(item, index) : item?._id || item?.id || index);
  // Constant speed regardless of how much content the rail holds.
  const duration = shift > 0 ? Math.max(shift / speed, 6) : 40;

  const copy = (copyIndex) => (
    <div
      key={`copy-${copyIndex}`}
      ref={copyIndex === 0 ? copyRef : undefined}
      className="marquee-copy"
      {...(copyIndex === 0 ? {} : { "aria-hidden": "true", inert: true })}
    >
      {items.map((item, index) => (
        <div className="marquee-item" key={`${copyIndex}-${keyFor(item, index)}`}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={`marquee-root ${className}`}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      {...rest}
    >
      <div
        className="marquee-track"
        data-direction={direction}
        data-paused={isPaused ? "true" : "false"}
        style={{
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": gap,
          "--marquee-shift": `${shift}px`,
        }}
      >
        {Array.from({ length: copies }, (_, index) => copy(index))}
      </div>
    </div>
  );
}
