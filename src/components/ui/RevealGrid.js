import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import ProductGrid from "@/components/ProductGrid";
import Button from "@/components/ui/Button";

/**
 * A product grid that shows five rows at a time behind a "See more" button.
 *
 * Why the overflow is hidden in CSS rather than sliced in JS: every card stays
 * in the served HTML, so a crawler still sees every product link. Withholding
 * links from the markup is exactly the class of bug that once made 197 product
 * pages invisible to Google, and it is not worth repeating for a UI nicety.
 * `display: none` also takes the clipped cards out of tab order and the
 * accessibility tree, so no `inert` juggling is needed.
 *
 * "Five rows" is a different number of cards per breakpoint, because the grid
 * is 2 / 3 / 4 columns — 10, 15 and 20. The thresholds live in globals.css
 * under .reveal-grid, keyed off the data-pages attribute set here.
 */
export default function RevealGrid({
  items = [],
  viewAllHref = "/products",
  viewAllLabel = "View all products",
  ...gridProps
}) {
  const gridRef = useRef(null);
  const [pages, setPages] = useState(1);
  // Server-render the button when the list exceeds the widest breakpoint's
  // threshold (4 columns x 5 rows), which is true for every section using this.
  // The effect below corrects it once real layout is known.
  const [hasHidden, setHasHidden] = useState(items.length > 20);

  const measure = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    setHasHidden(Array.from(grid.children).some((child) => child.offsetParent === null));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, pages, items.length]);

  // Stagger only the cards that just appeared. Which ones those are depends on
  // the current column count, so it's read from layout rather than recomputed
  // per breakpoint.
  const revealMore = () => {
    const grid = gridRef.current;
    const visibleBefore = grid
      ? Array.from(grid.children).filter((child) => child.offsetParent !== null).length
      : 0;

    setPages((current) => current + 1);

    requestAnimationFrame(() => {
      if (!grid) return;
      Array.from(grid.children).forEach((child, index) => {
        if (index < visibleBefore || child.offsetParent === null) return;
        child.style.setProperty("--i", String(index - visibleBefore));
        child.classList.add("card-reveal");
        child.addEventListener("animationend", () => child.classList.remove("card-reveal"), {
          once: true,
        });
      });
    });
  };

  if (!items.length) return null;

  return (
    <>
      <ProductGrid
        {...gridProps}
        items={items}
        containerRef={gridRef}
        className="reveal-grid"
        data-pages={pages}
      />

      {hasHidden && (
        <div className="mt-6 flex justify-center px-2">
          <Button
            variant="outline"
            fullWidth={false}
            onClick={revealMore}
            className="min-w-[190px] gap-2"
          >
            See more
            <FaChevronDown className="see-more-chevron" aria-hidden="true" />
          </Button>
        </div>
      )}

      {!hasHidden && pages > 1 && (
        <div className="mt-6 flex justify-center px-2">
          <Button
            component={Link}
            href={viewAllHref}
            prefetch={false}
            variant="view"
            fullWidth={false}
            className="min-w-[190px]"
          >
            {viewAllLabel}
          </Button>
        </div>
      )}
    </>
  );
}
