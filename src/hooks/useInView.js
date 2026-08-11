import { useEffect, useRef, useState } from "react";

/**
 * One shared IntersectionObserver helper.
 *
 * Two consumers, two reasons:
 *  - marquees / carousels use it to stop animating while off-screen. On a 3G
 *    handset that is real battery and CPU, not a micro-optimisation.
 *  - section entrance animations use it with `once: true`.
 *
 * Returns [ref, inView]. Defaults to true when IntersectionObserver is missing
 * so nothing is ever permanently hidden or frozen by a failed feature check.
 */
export default function useInView({ once = false, rootMargin = "200px", threshold = 0 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (very old browser): fail open so nothing is left
    // permanently frozen or hidden. Deferred to a frame rather than set inline,
    // because a synchronous setState in an effect body cascades a render.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView];
}
