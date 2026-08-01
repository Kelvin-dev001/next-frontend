import React from "react";

export default function ProductCardSkeleton({ size = "compact" }) {
  const isFull = size === "full";
  return (
    <div
      className={`w-full overflow-hidden bg-white shadow-[0_6px_24px_rgba(30,60,114,0.08)] ${
        isFull ? "min-h-[420px] rounded-[22px] md:min-h-[360px]" : "min-h-[360px] rounded-[18px] md:min-h-[350px]"
      }`}
    >
      <div className={isFull ? "px-[14px] pt-[13px]" : "px-[10px] pt-[10px]"}>
        <div className={`w-full overflow-hidden ${isFull ? "aspect-[5/4] rounded-2xl" : "aspect-[4/5] rounded-[14px]"}`}>
          <div className="h-full w-full animate-pulse bg-gray-200" />
        </div>
      </div>
      <div className={isFull ? "p-4" : "p-[10px]"}>
        <div className="mb-2 h-4 w-2/5 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-5 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="mb-2 h-4 w-3/5 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
