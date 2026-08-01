import React from "react";

/**
 * Centered storefront section heading with an on-brand accent bar.
 * Keeps the homepage section titles visually consistent (P4 polish).
 */
export default function SectionHeading({ children, className = "" }) {
  return (
    <div className={`mb-6 text-center ${className}`}>
      <h2 className="font-extrabold tracking-wide text-[#1e3c72] text-[1.45rem] md:text-[1.8rem]">
        {children}
      </h2>
      <span className="mx-auto mt-2.5 block h-1 w-16 rounded-full bg-gradient-to-r from-[#6dd5ed] to-[#1e3c72]" />
    </div>
  );
}
