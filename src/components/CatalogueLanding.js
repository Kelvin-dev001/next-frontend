import Head from "next/head";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { SITE_URL, BUSINESS_NAME } from "@/constants/business";

const OG_IMAGE = `${SITE_URL}/snaap-logo.jpeg`;

// Shared renderer for /category/[slug] and /brand/[slug] (P5-5). A page is indexable
// ONLY once it has approved intro copy — otherwise it's a bare filtered grid that
// would duplicate /products?category= / ?brand=, so it stays noindex.
export default function CatalogueLanding({ type, name, slug, copy = null, products = [], total = 0 }) {
  const base = type === "brand" ? "/brand" : "/category";
  const url = `${SITE_URL}${base}/${slug}`;
  const indexable = Boolean(copy?.intro);

  const title = copy?.title || `${name} — Buy in Mombasa & Kenya | ${BUSINESS_NAME}`;
  const description =
    copy?.description ||
    `Shop ${name} at ${BUSINESS_NAME}, Mombasa. ${total} product${total === 1 ? "" : "s"} with fast delivery across Kenya. Order on WhatsApp.`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    inLanguage: "en-KE",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={indexable ? "index,follow" : "noindex,follow"} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={BUSINESS_NAME} />
        <meta property="og:image" content={OG_IMAGE} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </Head>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 md:py-12">
        <nav aria-label="breadcrumb" className="mb-3 text-[0.8rem] text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden> / </span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <h1 className="mb-3 text-[1.7rem] font-extrabold leading-tight text-brand-700 md:text-[2.2rem]">
          {name}
          <span className="ml-2 align-middle text-sm font-normal text-gray-500">
            ({total} product{total === 1 ? "" : "s"})
          </span>
        </h1>

        {copy?.intro ? (
          <div className="mb-6 max-w-[820px] space-y-3 text-gray-600">
            {copy.intro.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          // No approved copy yet → the page is noindex; a minimal factual line only.
          <p className="mb-6 max-w-[820px] text-gray-600">
            Browse our {name} range and order on WhatsApp for fast delivery across Kenya.
          </p>
        )}

        {products.length > 0 ? (
          <ProductGrid items={products} eagerCount={6} size="compact" showWhatsApp showViewBtn />
        ) : (
          <p className="text-gray-500">
            No {name} products in stock right now.{" "}
            <Link href="/products" className="font-semibold">Browse all products</Link>.
          </p>
        )}

        <p className="mt-8 text-sm text-gray-500">
          <Link href="/products" className="font-semibold">All products</Link>
          {"  ·  "}
          <Link href="/shipping" className="font-semibold">Delivery</Link>
          {"  ·  "}
          <Link href="/faqs" className="font-semibold">FAQs</Link>
        </p>
      </div>
    </>
  );
}
