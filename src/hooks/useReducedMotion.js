import { useEffect, useState } from "react";

/**
 * Tracks the visitor's "reduce motion" OS setting.
 *
 * Always returns false on the server and on the first client render, so markup
 * matches and hydration stays clean. Components must therefore express the
 * reduced state as a *class or data attribute* on already-rendered markup —
 * never by rendering a different tree.
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
