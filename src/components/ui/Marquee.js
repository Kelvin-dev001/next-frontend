import React, { useCallback, useEffect, useRef, useState } from "react";
import useInView from "@/hooks/useInView";
import useReducedMotion from "@/hooks/useReducedMotion";

const MIN_COPIES = 3;
const MAX_COPIES = 8;
// How long after the visitor lets go before the rail starts moving again. Long
// enough to read the card they stopped on, short enough not to feel broken.
const RESUME_DELAY_MS = 1200;
// Movement past this is a drag, not a tap — used to swallow the click that
// would otherwise open whatever product the finger happened to land on.
const DRAG_SLOP_PX = 5;
// Frame budget cap: after a tab switch the first timestamp gap can be seconds,
// which would teleport the rail.
const MAX_FRAME_MS = 50;

const now = () => (typeof performance === "undefined" ? Date.now() : performance.now());

/**
 * Horizontal looping rail. The single motion primitive for the storefront —
 * the top info bar, the deals rails and the two-row category / brand /
 * Safaricom loops all sit on top of this.
 *
 * How it loops seamlessly at any content length: the list is rendered as N
 * side-by-side copies and the rail is parked one whole copy in, so there is
 * always identical content on both sides. Autoplay walks the scroll position
 * and wraps by exactly one copy's width — the copies are pixel-identical, so
 * the wrap is invisible. N is chosen so the copies always overrun the rail plus
 * that runway; with a fixed two copies, a short list like 14 brand logos on a
 * desktop would drag a block of empty space across the screen.
 *
 * Only the FIRST copy is real. The rest are aria-hidden + inert, so a screen
 * reader hears the brand list once and tab order visits each link once.
 *
 * Motion is scroll position, not a CSS transform (P9). A transform cannot be
 * grabbed: the previous version animated translate3d, so a customer who wanted
 * the card that had just slid past had to wait for the whole loop. Driving
 * scrollLeft instead means swipe, momentum, trackpad and wheel all come free
 * from the platform for no bundle cost, and the reduced-motion fallback stops
 * being a special case — it is this same scroll container with the loop off.
 *
 * Behaviour:
 *  - pauses while the visitor is touching, dragging or scrolling it, on hover,
 *    on keyboard focus inside it, while off-screen and while the tab is hidden
 *    (a rail animating off-screen is real battery cost on a 3G handset)
 *  - under prefers-reduced-motion there is no loop at all: one copy, plain
 *    swipe rail, handled entirely in globals.css so server and client markup
 *    stay identical
 *
 * There is deliberately no pause button (P9, owner's decision). WCAG 2.2.2 asks
 * for a mechanism to stop the motion: touching, dragging, hovering or focusing
 * the rail stops it, and the OS "reduce motion" setting removes the movement
 * altogether. Recorded in BACKLOG.md under P9.
 */
export default function Marquee({
  items = [],
  renderItem,
  itemKey,
  direction = "left",
  speed = 45, // px per second
  gap = "1rem",
  pauseOnHover = true,
  className = "",
  ...rest
}) {
  const copyRef = useRef(null);
  const [rootRef, inView] = useInView({ rootMargin: "150px" });
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [shift, setShift] = useState(0);
  const [copies, setCopies] = useState(MIN_COPIES);

  // Refs, not state: these are written from scroll and pointer handlers that
  // fire at frame rate, where a setState would re-render the entire rail.
  const shiftRef = useRef(0);
  const programmaticRef = useRef(0); // the last scrollLeft WE wrote
  const resumeAtRef = useRef(0);
  const pointerDownRef = useRef(false);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);

  // Move the rail, wrapping so it stays one copy in from either end. Records
  // the value so the scroll handler can tell our writes from the visitor's.
  const write = useCallback(
    (value) => {
      const root = rootRef.current;
      const span = shiftRef.current;
      if (!root || !span) return;
      let next = value;
      if (next >= 2 * span) next -= span;
      else if (next < span) next += span;
      root.scrollLeft = next;
      programmaticRef.current = root.scrollLeft;
    },
    [rootRef]
  );

  const holdOff = useCallback(() => {
    resumeAtRef.current = now() + RESUME_DELAY_MS;
  }, []);

  useEffect(() => {
    const copy = copyRef.current;
    const root = rootRef.current;
    if (!copy || !root) return;

    const measure = () => {
      const copyWidth = copy.offsetWidth;
      if (!copyWidth) return;
      setShift(copyWidth);
      // +2 rather than +1: one copy of runway on each side of the visible band,
      // so the rail can be pushed backwards the moment it is touched.
      setCopies(
        Math.min(MAX_COPIES, Math.max(MIN_COPIES, Math.ceil(root.clientWidth / copyWidth) + 2))
      );
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(copy);
    observer.observe(root);
    return () => observer.disconnect();
  }, [items, rootRef]);

  // Park one copy in, once the copies for that measurement have rendered.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    shiftRef.current = shift;
    // Under reduce-motion the extra copies are display:none, so there is only
    // one copy to scroll and a parked position would clamp to the end.
    root.scrollLeft = reducedMotion ? 0 : shift;
    programmaticRef.current = root.scrollLeft;
  }, [shift, copies, reducedMotion, rootRef]);

  useEffect(() => {
    if (reducedMotion || !inView || !shift || (pauseOnHover && hovered)) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let last = 0;
    const step = (timestamp) => {
      frame = requestAnimationFrame(step);
      if (!last) {
        last = timestamp;
        return;
      }
      const elapsed = Math.min(timestamp - last, MAX_FRAME_MS);
      last = timestamp;
      if (document.hidden || pointerDownRef.current || timestamp < resumeAtRef.current) return;
      const delta = (speed * elapsed) / 1000;
      write(root.scrollLeft + (direction === "right" ? -delta : delta));
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, inView, shift, hovered, pauseOnHover, speed, direction, write, rootRef]);

  // Any scroll we did not write is the visitor's — hold the loop off, and once
  // they are no longer holding the rail, keep them off the hard ends so it
  // stays endless in both directions.
  const handleScroll = useCallback(() => {
    const root = rootRef.current;
    const span = shiftRef.current;
    if (!root || !span) return;
    const position = root.scrollLeft;
    if (Math.abs(position - programmaticRef.current) <= 2) return;

    holdOff();
    if (pointerDownRef.current) return; // mid-gesture: never fight the finger
    const max = root.scrollWidth - root.clientWidth;
    if (position < 4) {
      root.scrollLeft = position + span;
      programmaticRef.current = root.scrollLeft;
    } else if (position > max - 4) {
      root.scrollLeft = position - span;
      programmaticRef.current = root.scrollLeft;
    }
  }, [holdOff, rootRef]);

  const handlePointerDown = useCallback(
    (event) => {
      pointerDownRef.current = true;
      draggedRef.current = false;
      holdOff();
      // Touch and pen scroll natively, with far better momentum than anything
      // we could write. Only the mouse needs a drag implementation.
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const root = rootRef.current;
      if (!root) return;
      dragRef.current = { x: event.clientX, scroll: root.scrollLeft };
      try {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {
        // Capture is a nicety; the drag still works without it.
      }
    },
    [holdOff, rootRef]
  );

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      const root = rootRef.current;
      if (!drag || !root) return;
      const travelled = event.clientX - drag.x;
      if (Math.abs(travelled) > DRAG_SLOP_PX) draggedRef.current = true;
      root.scrollLeft = drag.scroll - travelled;
      programmaticRef.current = -1; // make handleScroll read this as the user
      holdOff();
    },
    [holdOff, rootRef]
  );

  const endPointer = useCallback(() => {
    pointerDownRef.current = false;
    dragRef.current = null;
    holdOff();
  }, [holdOff]);

  // A drag that ends on a product card must not also open it.
  const handleClickCapture = useCallback((event) => {
    if (!draggedRef.current) return;
    draggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  if (!items.length || typeof renderItem !== "function") return null;

  const keyFor = (item, index) => (itemKey ? itemKey(item, index) : item?._id || item?.id || index);

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
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onClickCapture={handleClickCapture}
      // Native image / link dragging would hijack a mouse drag halfway through.
      onDragStart={(event) => event.preventDefault()}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      {...rest}
    >
      <div className="marquee-track" style={{ "--marquee-gap": gap }}>
        {Array.from({ length: copies }, (_, index) => copy(index))}
      </div>
    </div>
  );
}
