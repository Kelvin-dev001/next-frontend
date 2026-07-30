import React from "react";

/**
 * Storefront button primitive (Tailwind — no MUI). Polymorphic via `component`
 * (e.g. next/link) so it can render an <a> while keeping button styling.
 * Part of the P4 Tailwind migration.
 */
const VARIANTS = {
  whatsapp: "bg-[#2e7d32] text-white hover:bg-[#1b5e20]",
  view:
    "border border-[#6dd5ed] text-[#1e3c72] hover:text-white hover:border-transparent " +
    "hover:bg-[linear-gradient(96deg,#6dd5ed_10%,#1e3c72_90%)] hover:shadow-[0_2px_24px_#1e3c72cc] hover:scale-[1.03]",
  solid: "bg-[#1e3c72] text-white hover:bg-[#152c56]",
  outline: "border border-[#1e3c72] text-[#1e3c72] hover:bg-[#1e3c72] hover:text-white",
};

export default function Button({
  component: Comp = "button",
  variant = "solid",
  fullWidth = true,
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold no-underline " +
    "transition-all duration-200 text-[0.72rem] md:text-[0.92rem] py-2 md:py-2.5 px-4";
  return (
    <Comp
      className={`${base} ${fullWidth ? "w-full" : ""} ${VARIANTS[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
