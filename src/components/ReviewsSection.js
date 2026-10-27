import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Api } from "@/lib/api";
import ReviewFilter from "./ReviewFilter";
import ReviewCard from "./ReviewCard";

const ReviewSummary = ({ reviews }) => {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => Math.round(r.rating) === star).length);
  return (
    <div className="mb-6 rounded bg-gray-50 p-4 shadow-md">
      <h3 className="mb-2 text-lg font-semibold">Review Summary</h3>
      {counts.map((count, idx) => {
        const star = 5 - idx;
        const percent = total ? (count / total) * 100 : 0;
        return (
          <div key={star} className="mb-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center text-[#FFD600]">
                {[...Array(star)].map((_, i) => <FaStar key={i} className="mr-0.5 text-sm" />)}
              </span>
              <span className="min-w-[22px] text-right text-sm">{count}</span>
            </div>
            <div className="mt-0.5 h-1.5 w-full rounded bg-gray-200">
              <div className="h-1.5 rounded bg-brand-700 transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

function RatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className="text-2xl text-[#FFD600]"
        >
          {value >= star ? <FaStar aria-hidden="true" /> : <FaRegStar aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

const ReviewForm = ({ open, handleClose, productId, onSubmitSuccess }) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    if (!name || !comment || !rating) {
      setError("Name, rating, and comment are required.");
      return;
    }
    if (lastSubmitted && Date.now() - lastSubmitted < 60000) {
      setError("You can only submit one review per minute.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await Api.post(`/products/${productId}/reviews`, { name, whatsapp, rating, comment });
      setLastSubmitted(Date.now());
      setName(""); setWhatsapp(""); setRating(0); setComment("");
      onSubmitSuccess(res?.data?.message || "Thanks! Your review will appear once it has been approved.");
      handleClose();
    } catch (e) {
      // The API explains what was wrong ("Rating must be…"); axios's own
      // message ("Request failed with status code 401") means nothing to a buyer.
      setError(e?.response?.data?.message || "We couldn't send your review. Please try again.");
    }
    setSubmitting(false);
  };

  const field = "w-full border-b border-gray-300 bg-transparent px-1 py-2 outline-none focus:border-brand-700";
  const label = "block text-sm font-medium text-gray-700";

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
      onKeyDown={(e) => { if (e.key === "Escape") handleClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />
      <div className="relative z-[1] w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="review-form-title" className="mb-4 text-xl font-bold">Write a Review</h3>
        {error && <div role="alert" className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <label htmlFor="review-name" className={label}>Your name</label>
        <input id="review-name" className={`${field} mb-3`} maxLength={60} autoComplete="name" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="review-phone" className={label}>Phone (optional — never shown publicly)</label>
        <input id="review-phone" type="tel" className={`${field} mb-3`} maxLength={20} autoComplete="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <p className={`${label} mt-2`} id="review-rating-label">Rating</p>
        <RatingInput value={rating} onChange={setRating} />
        <label htmlFor="review-comment" className={`${label} mt-3`}>Your review</label>
        <textarea id="review-comment" className={field} rows={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} />
        <p className="mt-2 block text-xs text-gray-500">
          Reviews are checked by our team before they appear publicly.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleClose} disabled={submitting} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name || !comment || !rating}
            className="rounded bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReviewSection({ productId, reviews: propReviews, isHomepage }) {
  const [fetchedReviews, setFetchedReviews] = useState(null);
  const [filterStars, setFilterStars] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  // Both callers server-render the reviews and pass them in (the product page
  // since P10-1), so there is nothing to fetch on a customer's phone. The fetch
  // is only a fallback for a caller that passes a productId and no reviews.
  // No refetch after a submission: a new review stays hidden until approved.
  useEffect(() => {
    if (propReviews || !productId || isHomepage) return;
    let cancelled = false;
    Api.get(`/products/${productId}/reviews`)
      .then((res) => { if (!cancelled) setFetchedReviews(res.data?.reviews || []); })
      .catch(() => { if (!cancelled) setFetchedReviews([]); });
    return () => { cancelled = true; };
  }, [productId, propReviews, isHomepage]);

  const reviews = propReviews || fetchedReviews || [];

  const filtered = reviews
    .filter((r) => (filterStars ? Math.round(r.rating) === filterStars : true))
    .sort((a, b) =>
      sortOrder === "oldest"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-[1090px] px-4">
        <h2 className="mb-1.5 text-center text-2xl font-bold text-brand-700">What Customers Say</h2>
        <ReviewSummary reviews={reviews} />

        <div className="mb-3 text-center">
          <p className="text-gray-500">
            <b>{reviews.length}</b> review{reviews.length !== 1 && "s"} · Average Rating: <b>{avgRating}</b>/5
          </p>
          {productId && !isHomepage && (
            <button
              onClick={() => { setNotice(""); setShowForm(true); }}
              className="mt-2 rounded bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-900"
            >
              Write a Review
            </button>
          )}
          {notice && (
            <p role="status" className="mx-auto mt-3 max-w-md rounded bg-green-50 px-3 py-2 text-sm text-green-800">
              {notice}
            </p>
          )}
        </div>

        <ReviewFilter
          filterStars={filterStars}
          sortOrder={sortOrder}
          setFilterStars={setFilterStars}
          setSortOrder={setSortOrder}
        />

        {filtered.length === 0 ? (
          productId && !isHomepage ? (
            <p className="mb-10 mt-6 text-center text-gray-500">
              {reviews.length ? "No reviews match this filter." : "No reviews yet — be the first to review this product."}
            </p>
          ) : (
            <p className="mb-10 mt-6 text-center text-gray-500">
              No reviews yet.{" "}
              <Link href="/products" className="text-brand-700 underline-offset-2 hover:underline">
                Be the first to review — Shop Now!
              </Link>
            </p>
          )
        ) : (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {filtered.map((review, i) => (
              <div
                key={review._id || review.id || i}
                className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}

        {productId && !isHomepage && (
          <ReviewForm
            open={showForm}
            handleClose={() => setShowForm(false)}
            productId={productId}
            onSubmitSuccess={setNotice}
          />
        )}

        {reviews.length > 0 && (
          <div className="mt-6 rounded-2xl bg-brand-50 p-4">
            <h3 className="mb-2 text-lg font-semibold">Top Comments:</h3>
            {reviews
              .filter((r) => r.rating >= 4)
              .slice(0, 3)
              .map((r, i) => (
                <p key={i} className="mb-1.5 text-sm italic">
                  “{r.comment && r.comment.length > 120 ? r.comment.slice(0, 120) + "..." : r.comment}” — <b>{r.name}</b>
                </p>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
