import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaWhatsapp, FaStar } from "react-icons/fa";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";
import { waLink, formatKES } from "@/constants/business";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";

const BADGE_BG = {
  HOT: "bg-red-600",
  NEW: "bg-green-600",
  TRENDING: "bg-sky-500",
  SALE: "bg-amber-500",
  FEATURED: "bg-brand-700",
};

export default function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted,
  showWhatsApp = true,
  showViewBtn = true,
  badge,
  size = "compact",
  imagePriority = false,
}) {
  const productHref = `/products/${product?._id || product?.id || ""}`;

  const discountPercent =
    product?.discountPrice && product?.price
      ? Math.round(100 - (product.discountPrice / product.price) * 100)
      : null;

  const cloudUrl =
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]);
  const imgUrl = getOptimizedCloudinaryUrl(cloudUrl, { width: 720 }) || "/fallback.png";

  const message = `Hello, am interested in buying (${product?.name}${product?.model ? ", " + product.model : ""}, KES ${product?.discountPrice || product?.price})`;

  const hasRealRating = typeof product?.rating === "number" && product.rating > 0;
  const price = product?.discountPrice || product?.price;

  return (
    <div className="group relative flex min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[14px] bg-white text-brand-700 shadow-[0_6px_24px_rgba(7,89,133,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(7,89,133,0.2)] focus-within:ring-2 focus-within:ring-brand-300 md:rounded-[18px]">
      {/* Stretched, crawlable link over the whole card (P1-1). aria-hidden + tabIndex=-1
          so the visible title link below is the single accessible / focusable link. */}
      <Link
        href={productHref}
        prefetch={false}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 z-[1]"
      />

      {/* Image */}
      <div className="relative px-[0.8rem] pt-[0.8rem] md:px-[1.2rem] md:pt-[1.2rem]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-brand-50 md:rounded-[14px]">
          <Image
            src={imgUrl}
            alt={product?.name || "Product"}
            fill
            sizes="(max-width: 600px) 48vw, (max-width: 900px) 32vw, 25vw"
            style={{ objectFit: "contain" }}
            className="transition-transform duration-500 ease-out group-hover:scale-105"
            priority={imagePriority}
          />
        </div>

        {badge && (
          <Chip className={`absolute left-2 top-2 z-[2] px-2 py-0.5 text-[0.6rem] text-white md:text-[0.75rem] ${BADGE_BG[badge] || "bg-sky-500"}`}>
            {badge}
          </Chip>
        )}
        {discountPercent && (
          <Chip className="absolute right-2 top-2 z-[2] bg-red-600 px-2 py-0.5 text-[0.6rem] text-white md:text-[0.75rem]">
            -{discountPercent}%
          </Chip>
        )}

        <button
          aria-label="add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            if (onWishlistToggle) onWishlistToggle(product?._id || product?.id);
          }}
          className="absolute bottom-1 right-2 z-[2] grid h-8 w-8 place-items-center rounded-full bg-white shadow-[0_2px_8px_#2221] hover:bg-brand-300/30"
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow px-[0.8rem] pb-[0.4rem] pt-[0.8rem] md:px-[1.2rem]">
        <span className="mb-0.5 block text-[0.65rem] text-gray-500 md:text-[0.75rem]">{product?.brand}</span>

        <Link
          href={productHref}
          prefetch={false}
          className="relative z-[2] mb-1 block font-bold leading-tight text-brand-700 no-underline line-clamp-2 text-[0.8rem] hover:underline md:text-[0.95rem]"
        >
          {product?.name}
        </Link>

        {hasRealRating && (
          <div className="mb-1 flex items-center gap-1">
            <span className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <FaStar key={i} className={i < Math.round(product.rating) ? "text-brand-300" : "text-gray-300"} />
              ))}
            </span>
            <span className="text-[0.6rem] md:text-[0.75rem]">{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1">
          <span className="font-bold text-brand-700 text-[0.85rem] md:text-[1rem]">
            {price ? formatKES(price) : "—"}
          </span>
          {product?.discountPrice && (
            <span className="text-[0.6rem] text-gray-500 line-through md:text-[0.75rem]">
              {formatKES(product.price)}
            </span>
          )}
        </div>

        {(product?.specs?.storage || product?.specs?.ram) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {product.specs?.storage && (
              <Chip className="h-5 border border-gray-300 px-2 text-[0.58rem] md:text-[0.68rem]">
                Storage: {product.specs.storage}
              </Chip>
            )}
            {product.specs?.ram && (
              <Chip className="h-5 border border-gray-300 px-2 text-[0.58rem] md:text-[0.68rem]">
                RAM: {product.specs.ram}
              </Chip>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-[2] px-[0.8rem] pb-[0.8rem] pt-1 md:px-[1.2rem] md:pb-[1.2rem]">
        {showWhatsApp && (
          <Button
            variant="whatsapp"
            className="mb-1"
            onClick={(e) => {
              e.stopPropagation();
              window.open(waLink(message), "_blank");
            }}
          >
            <FaWhatsapp /> Buy on WhatsApp
          </Button>
        )}
        {showViewBtn && (
          <Button
            component={Link}
            href={productHref}
            prefetch={false}
            variant="view"
            aria-label={`View ${product?.name || "product"}`}
          >
            View
          </Button>
        )}
      </div>
    </div>
  );
}
