import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Stars({ value = 0 }) {
  return (
    <span className="inline-flex items-center text-[#FFD600]" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        if (value >= i) return <FaStar key={i} className="text-sm" />;
        if (value >= i - 0.5) return <FaStarHalfAlt key={i} className="text-sm" />;
        return <FaRegStar key={i} className="text-sm" />;
      })}
    </span>
  );
}

export default function ReviewCard({ review = {} }) {
  const { name, rating, comment, createdAt, image } = review;
  return (
    <div className="flex min-h-[180px] flex-col rounded-2xl bg-white p-4 shadow-[0_3px_14px_rgba(7,89,133,0.1)]">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-bold text-gray-900">{name || "Customer"}</span>
        <Stars value={rating || 0} />
      </div>
      <p className="mb-1 flex-grow text-sm text-gray-500">{comment || "No comment provided."}</p>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="Review" className="mt-1 max-h-[190px] w-full rounded-lg object-cover" />
      )}
      {createdAt && (
        <span className="mt-1 block text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
      )}
    </div>
  );
}
