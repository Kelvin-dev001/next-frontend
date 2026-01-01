"use client";
import React from "react";

export default function ReviewSummary({ reviews }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.rating) === star).length
  );

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md mb-6">
      <h4 className="text-lg font-semibold mb-3">Review Summary</h4>
      {counts.map((count, idx) => {
        const percent = total ? (count / total) * 100 : 0;
        const star = 5 - idx;
        return (
          <div key={star} className="mb-2">
            <div className="flex justify-between text-sm">
              <span>{star} Stars</span>
              <span>{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}