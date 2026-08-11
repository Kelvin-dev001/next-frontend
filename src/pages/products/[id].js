import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaWhatsapp, FaShareAlt, FaHeart, FaRegHeart,
  FaTruck, FaUndoAlt, FaShieldAlt, FaMoneyBillWave,
} from "react-icons/fa";
import { Api } from "@/lib/api";
import ReviewSection from "@/components/ReviewsSection";
import ProductGrid from "@/components/ProductGrid";
import Chip from "@/components/ui/Chip";
import { getOptimizedCloudinaryUrl } from "@/utils/cloudinaryUrl";
import { DELIVERY_ZONES, formatKES, waLink } from "@/constants/business";

const FALLBACK_IMAGE = "/fallback.png";
const SITE_NAME = "Snaap Connections";
const SITE_URL = "https://www.snaapconnections.co.ke";

export default function ProductDetailPage({ product, related = [], priceValidUntil = null }) {
  const router = useRouter();

  const [wishlist, setWishlist] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [product?._id]);

  // Null check AFTER all hooks (keeps hook order stable across renders).
  if (product === null) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          Product not found.{" "}
          <Link href="/products" className="font-semibold underline">Browse all products</Link>.
        </div>
      </div>
    );
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= (product?.inStock ? 10 : 0)) setQuantity(value);
  };
  const incrementQuantity = () => { if (quantity < (product?.inStock ? 10 : 0)) setQuantity(quantity + 1); };
  const decrementQuantity = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const formatPrice = (price) => formatKES(price);

  const handleWhatsAppBuy = () => {
    const message = `I'm interested in: ${product.name}${product.sku ? ` (SKU ${product.sku})` : ""}\nPrice: ${formatPrice(product.discountPrice || product.price)}\nQuantity: ${quantity}\nLink: ${window.location.href}`;
    window.open(waLink(message), "_blank");
  };

  const handleLipaWhatsApp = () => {
    const message = `Hi Snaap Connections, I'd like to know about Lipa Mdogo Mdogo for the ${product.name}.`;
    window.open(waLink(message), "_blank");
  };

  const images = product?.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
  const mainImage = getOptimizedCloudinaryUrl(images[selectedImage], { width: 600 }) || FALLBACK_IMAGE;

  const seoTitle = `${product?.name} | Buy in Mombasa, Kenya | ${SITE_NAME}`;
  // P1-9: meta description from live structured fields so it can't drift.
  const specBits = [product?.specs?.storage, product?.specs?.ram && `${product.specs.ram} RAM`].filter(Boolean).join(", ");
  const livePrice = formatKES(product?.discountPrice || product?.price);
  const seoDescription = product
    ? `Buy the ${product.name}${specBits ? ` (${specBits})` : ""} at ${livePrice} from Snaap Connections, Mombasa. Fast delivery across Kenya.`
    : `Buy smartphones and accessories in Mombasa with fast nationwide delivery across Kenya.`;
  const seoImage = getOptimizedCloudinaryUrl(images[0], { width: 900 }) || FALLBACK_IMAGE;

  // P1-6: real delivery rates → schema shippingDetails (mirrors constants/business.js).
  const shippingDetails = DELIVERY_ZONES.map((z) => ({
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      currency: "KES",
      ...(z.priceKES != null ? { value: z.priceKES } : { minValue: z.priceKESMin, maxValue: z.priceKESMax }),
    },
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "KE", addressRegion: z.counties },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: z.transitDays, unitCode: "DAY" },
    },
  }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name,
    image: [seoImage],
    description: product?.shortDescription || product?.fullDescription || seoDescription,
    brand: { "@type": "Brand", name: product?.brand || SITE_NAME },
    ...(product?.sku ? { sku: product.sku } : {}),
    ...(product?.category ? { category: product.category } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product?.discountPrice || product?.price || undefined,
      ...(priceValidUntil ? { priceValidUntil } : {}),
      itemCondition: "https://schema.org/NewCondition",
      availability: product?.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product?._id}`,
      seller: { "@type": "MobilePhoneStore", "@id": `${SITE_URL}/#store`, name: SITE_NAME },
      shippingDetails,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(product?.category
        ? [{ "@type": "ListItem", position: 2, name: product.category, item: `${SITE_URL}/products?category=${encodeURIComponent(product.category)}` }]
        : []),
      { "@type": "ListItem", position: product?.category ? 3 : 2, name: product?.name, item: `${SITE_URL}/products/${product?._id}` },
    ],
  };

  const infoRows = [
    { label: "Brand", value: product.brand },
    { label: "Category", value: product.category },
    { label: "Warranty", value: product.warrantyPeriod || "1 year" },
    { label: "Availability", value: product.inStock ? "In stock" : "Out of stock", color: product.inStock ? "text-green-600" : "text-red-600" },
  ];

  const badges = [
    { icon: <FaTruck className="text-brand-700 text-lg" />, title: "Delivery", sub: `${DELIVERY_ZONES[0].priceDisplay} in Mombasa, Kilifi & Kwale · ${DELIVERY_ZONES[1].priceDisplay} to Nairobi & Machakos` },
    ...(product.returnPolicyDays ? [{ icon: <FaUndoAlt className="text-brand-700 text-lg" />, title: `${product.returnPolicyDays}-Day Returns`, sub: "See our returns policy" }] : []),
    ...(product.warrantyPeriod ? [{ icon: <FaShieldAlt className="text-brand-700 text-lg" />, title: "Warranty", sub: `${product.warrantyPeriod} warranty` }] : []),
  ];

  const tabs = ["Description", "Specifications", "Reviews"];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="mx-auto max-w-[1200px] px-1.5 py-2 md:px-3 md:py-4">
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="robots" content="index,follow" />
          <link rel="canonical" href={`${SITE_URL}/products/${product?._id}`} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:type" content="product" />
          <meta property="og:url" content={`${SITE_URL}/products/${product?._id}`} />
          <meta property="og:locale" content="en_KE" />
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:image" content={seoImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImage} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        </Head>

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-2 flex flex-wrap items-center gap-1.5 text-[0.8rem] text-gray-600 md:text-[0.875rem]">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category || "")}`} className="hover:underline">{product.category}</Link>
          <span aria-hidden>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Image + info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {/* LEFT: images */}
          <div className="md:sticky md:top-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#fafafa]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage} alt={`${product.name} - main`} loading="eager" className="h-full w-full object-contain" />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto py-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded transition md:h-[70px] md:w-[70px] ${
                    selectedImage === index ? "border-2 border-brand-700 opacity-100" : "border border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getOptimizedCloudinaryUrl(image, { width: 100 }) || FALLBACK_IMAGE} alt={`${product.name} — view ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: info */}
          <div>
            <h1 className="mb-1 font-bold text-[1.4rem] md:text-[2rem]">{product.name}</h1>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-bold text-brand-700 text-[1.3rem] md:text-[1.8rem]">{formatPrice(product.discountPrice || product.price)}</span>
              {product.discountPrice && (
                <span className="text-gray-500 line-through text-[0.85rem] md:text-base">{formatPrice(product.price)}</span>
              )}
              {product.discountPrice && (
                <Chip className="bg-red-600 px-2 py-0.5 text-[0.7rem] font-semibold text-white">Save {formatPrice(product.price - product.discountPrice)}</Chip>
              )}
            </div>

            <p className="mb-4 text-[0.9rem] md:text-base">{product.shortDescription}</p>

            <dl className="mb-1">
              {infoRows.map((row) => (
                <div key={row.label} className="flex flex-col py-0.5">
                  <dt className="text-[0.8rem] text-gray-500 md:text-[0.875rem]">{row.label}</dt>
                  <dd className={`text-[0.8rem] font-semibold md:text-[0.875rem] ${row.color || "text-gray-900"}`}>{row.value}</dd>
                </div>
              ))}
            </dl>

            <hr className="my-4 border-gray-200" />

            {/* Quantity + buy */}
            <p className="mb-1 font-semibold text-[0.9rem] md:text-base">Quantity</p>
            <div className="mb-2 flex items-center gap-4">
              <div className="flex overflow-hidden rounded border border-gray-300">
                <button onClick={decrementQuantity} disabled={quantity <= 1} className="min-w-9 px-2 py-1 disabled:opacity-40">−</button>
                <input type="number" value={quantity} min={1} max={product.inStock ? 10 : 0} onChange={handleQuantityChange} className="w-11 border-0 text-center text-[0.95rem] outline-none" />
                <button onClick={incrementQuantity} disabled={quantity >= (product.inStock ? 10 : 0)} className="min-w-9 px-2 py-1 disabled:opacity-40">+</button>
              </div>
              <span className="text-[0.85rem] text-gray-500">{product.inStock ? "In stock" : "Out of stock"}</span>
            </div>

            <button
              onClick={handleWhatsAppBuy}
              disabled={!product.inStock}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 text-[0.95rem] md:py-3.5 md:text-[1.1rem]"
            >
              <FaWhatsapp /> Buy on WhatsApp
            </button>

            <div className="mt-3 flex gap-2">
              <button aria-label="add to wishlist" onClick={() => toggleWishlist(product._id)} className="grid h-10 w-10 place-items-center rounded-full border border-gray-300">
                {wishlist.includes(product._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </button>
              <button
                aria-label="share"
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Product link copied!"); }}
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-300"
              >
                <FaShareAlt />
              </button>
            </div>

            {product.lipaMdogoMdogoEligible && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="flex items-center gap-2 font-semibold text-brand-600 text-[0.9rem]">
                  <FaMoneyBillWave aria-hidden="true" /> Lipa Mdogo Mdogo available
                </p>
                {product.lipaMdogoMdogoSummary && (
                  <p className="mt-1 text-[0.82rem] text-gray-700">{product.lipaMdogoMdogoSummary}</p>
                )}
                <p className="mt-1 text-[0.78rem] text-gray-500">
                  Terms for this device are in the description below. Message us for the details.
                </p>
                <button
                  onClick={handleLipaWhatsApp}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.82rem] font-semibold text-brand-600 ring-1 ring-brand-600 transition hover:bg-brand-600 hover:text-white"
                >
                  <FaWhatsapp /> Ask about Lipa Mdogo Mdogo
                </button>
              </div>
            )}

            <hr className="my-4 border-gray-200" />

            {/* Trust badges */}
            <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {badges.map((badge) => (
                <div key={badge.title} className="flex items-center gap-2">
                  {badge.icon}
                  <div>
                    <p className="font-semibold text-[0.78rem] md:text-[0.875rem]">{badge.title}</p>
                    <p className="text-gray-500 text-[0.68rem] md:text-[0.75rem]">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 md:mt-12">
          <div className="mb-4 flex border-b border-gray-200">
            {tabs.map((label, i) => (
              <button
                key={label}
                onClick={() => setTabValue(i)}
                className={`-mb-px flex-1 border-b-[3px] py-2 font-medium text-[0.78rem] md:text-[0.875rem] ${
                  tabValue === i ? "border-brand-700 text-brand-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-white p-3 md:p-6">
            {tabValue === 0 && (
              <p className="whitespace-pre-line text-[0.88rem] md:text-base">{product.fullDescription || "No description available"}</p>
            )}
            {tabValue === 1 && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {product.specs &&
                  Object.entries(product.specs)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-100 py-2.5">
                        <span className="text-[0.875rem] text-gray-500">{key.replace(/^[a-z]/, (c) => c.toUpperCase())}</span>
                        <span className="text-[0.875rem] font-medium">{value}</span>
                      </div>
                    ))}
              </div>
            )}
            {tabValue === 2 && (
              <div>
                <h2 className="mb-4 font-semibold text-base md:text-xl">Customer Reviews</h2>
                <ReviewSection productId={product._id} />
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8 md:mt-16">
            <h2 className="mb-4 font-semibold text-[1.1rem] md:text-[1.5rem]">You may also like</h2>
            <ProductGrid items={related} eagerCount={4} size="compact" showWhatsApp showViewBtn />
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  // Rolling ~1-year Offer validity (date-only, so SSR and client render identically).
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  try {
    const res = await Api.get(`/products/${params.id}`);
    const product = res.data?.product || null;

    let related = [];
    if (product?.category) {
      try {
        const relRes = await Api.get("/products", { params: { category: product.category, limit: 4 } });
        related = (relRes.data?.products || []).filter((p) => p._id !== params.id);
      } catch {
        related = [];
      }
    }

    return { props: { product, related, priceValidUntil } };
  } catch (e) {
    return { props: { product: null, related: [], priceValidUntil: null } };
  }
}
