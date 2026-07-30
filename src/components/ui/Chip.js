import React from "react";

/**
 * Small pill/badge primitive (Tailwind — no MUI). Pass colour via `className`.
 * Part of the P4 Tailwind migration.
 */
export default function Chip({ className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full font-bold leading-none ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
