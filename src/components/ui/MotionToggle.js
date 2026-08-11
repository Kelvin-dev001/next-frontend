import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";

/**
 * Pause / resume control for auto-moving content.
 *
 * WCAG 2.2.2: anything that starts moving on its own and runs for more than
 * five seconds needs a way to stop it. Hovering isn't enough — most of this
 * site's visitors are on touch screens and never hover.
 */
export default function MotionToggle({ paused, onToggle, label, tone = "dark", className = "" }) {
  const tones = {
    dark: "text-brand-700 bg-white/80 hover:bg-white border-brand-100",
    light: "text-white bg-white/15 hover:bg-white/30 border-white/25",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={`${paused ? "Resume" : "Pause"} ${label}`}
      className={`inline-grid h-7 w-7 place-items-center rounded-full border text-[0.6rem] transition ${
        tones[tone] || tones.dark
      } ${className}`}
    >
      {paused ? <FaPlay aria-hidden="true" /> : <FaPause aria-hidden="true" />}
    </button>
  );
}
