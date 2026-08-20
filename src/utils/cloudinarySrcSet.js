// src/utils/cloudinarySrcSet.js
//
// Builds a responsive srcset straight from Cloudinary, for the one case where
// next/image can't help: art direction.
//
// next/image renders a single <img> and picks a rendition by width alone. The
// hero sliders serve a DIFFERENT PICTURE below 640px (a 4:3 portrait crop
// designed for phones) than above it (a 64:21 wide banner) — that's a
// <picture> + <source media> decision the browser has to make, which next/image
// has no API for. Rendering both and hiding one with CSS is not an option:
// display:none does not reliably stop the download, and this audience pays per
// KB.
//
// Cloudinary already does f_auto (AVIF/WebP) and q_auto, so nothing is lost by
// going direct — and it keeps these full-bleed banners off Vercel's image
// optimizer entirely.

import { getOptimizedCloudinaryUrl } from "./cloudinaryUrl";

/**
 * @param {string} url    A Cloudinary delivery URL.
 * @param {number[]} widths  Rendition widths, ascending.
 * @returns {string} A srcset string, or "" if the URL isn't one we can transform
 *                   (in which case the caller should just use `src` alone).
 */
export function cloudinarySrcSet(url, widths = []) {
  if (!url || typeof url !== "string" || !url.includes("/image/upload/")) return "";
  return widths
    .map((width) => `${getOptimizedCloudinaryUrl(url, { width })} ${width}w`)
    .join(", ");
}
