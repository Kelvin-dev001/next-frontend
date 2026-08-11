import React, { useMemo, useState } from "react";
import Marquee from "@/components/ui/Marquee";
import MotionToggle from "@/components/ui/MotionToggle";

/**
 * Two looping rows, scrolling in opposite directions.
 *
 * Used by Shop by Category, Shop by Brand and Safaricom Corner. The point is a
 * section whose height is fixed at two rows no matter how big the catalogue
 * gets — previously these were open grids that grew a row every few additions
 * and pushed the rest of the homepage further out of reach.
 *
 * Both rows share one pause control so a visitor stops the whole section at
 * once rather than chasing two buttons.
 */
export default function TwoRowMarquee({
  items = [],
  renderItem,
  itemKey,
  label,
  speed = 30,
  gap = "1rem",
}) {
  const [paused, setPaused] = useState(false);

  // Below six items a split leaves rows too sparse to read as a pair, so keep
  // it as a single rail instead.
  const [topRow, bottomRow] = useMemo(() => {
    if (items.length < 6) return [items, []];
    const mid = Math.ceil(items.length / 2);
    return [items.slice(0, mid), items.slice(mid)];
  }, [items]);

  if (!items.length) return null;

  const rowProps = { renderItem, itemKey, speed, gap, paused, className: "py-2" };

  return (
    <div>
      <Marquee items={topRow} direction="left" {...rowProps} />
      {bottomRow.length > 0 && (
        <Marquee items={bottomRow} direction="right" {...rowProps} />
      )}

      <div className="mt-3 flex justify-center">
        <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label={label}
          tone="dark"
        />
      </div>
    </div>
  );
}
