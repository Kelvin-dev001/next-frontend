import React, { useMemo } from "react";
import Marquee from "@/components/ui/Marquee";

/**
 * Two looping rows, scrolling in opposite directions.
 *
 * Used by Shop by Category, Shop by Brand and Safaricom Corner. The point is a
 * section whose height is fixed at two rows no matter how big the catalogue
 * gets — previously these were open grids that grew a row every few additions
 * and pushed the rest of the homepage further out of reach.
 *
 * Each row is independently draggable (P9): the two rows move opposite ways, so
 * a shared control over both never matched what the visitor was reaching for.
 *
 * `autoplay={false}` keeps the two rows but stops them moving; each row is then
 * centred under the (centred) section heading whenever it fits.
 */
export default function TwoRowMarquee({
  items = [],
  renderItem,
  itemKey,
  speed = 30,
  gap = "1rem",
  autoplay = true,
}) {
  // Below six items a split leaves rows too sparse to read as a pair, so keep
  // it as a single rail instead.
  const [topRow, bottomRow] = useMemo(() => {
    if (items.length < 6) return [items, []];
    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  }, [items]);

  if (!items.length) return null;

  const rowProps = {
    renderItem,
    itemKey,
    speed,
    gap,
    autoplay,
    className: autoplay ? "py-2" : "py-2 marquee-center",
  };

  return (
    <div>
      <Marquee items={topRow} direction="left" {...rowProps} />
      {bottomRow.length > 0 && (
        <Marquee items={bottomRow} direction="right" {...rowProps} />
      )}
    </div>
  );
}
