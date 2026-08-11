import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp, FaChevronRight } from "react-icons/fa";
import { SAFARICOM_SERVICES, SERVICE_SLUGS, getService } from "@/constants/safaricomServices";
import { SITE_URL, BUSINESS_NAME, HOURS_DISPLAY, waLink } from "@/constants/business";

const OG_IMAGE = `${SITE_URL}/snaap-logo.jpeg`;
const H2 = "mb-2 mt-6 text-[1.2rem] font-bold text-brand-700";

function Block({ block }) {
  if (block.type === "grid") {
    return (
      <section className="mb-2">
        {block.heading && <h2 className={H2}>{block.heading}</h2>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-gray-200 p-4">
              <p className="font-bold text-brand-700">{it.title}</p>
              <p className="mt-1 text-[0.92rem] text-gray-600">{it.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "links") {
    return (
      <section className="mb-2">
        {block.heading && <h2 className={H2}>{block.heading}</h2>}
        <ul className="flex flex-wrap gap-2">
          {block.items.map((it) => (
            <li key={it.href + it.label}>
              <Link
                href={it.href}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-[0.85rem] font-semibold text-brand-700 no-underline transition hover:bg-brand-100"
              >
                {it.label} <FaChevronRight className="text-[0.7rem]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // default: "section"
  return (
    <section className="mb-2">
      {block.heading && <h2 className={H2}>{block.heading}</h2>}
      {(block.paras || []).map((p, i) => (
        <p key={i} className="mb-2 max-w-[760px] text-gray-600">{p}</p>
      ))}
      {block.bullets?.length > 0 && (
        <ul className="mb-2 max-w-[760px] list-disc space-y-1 pl-6 text-gray-600">
          {block.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
    </section>
  );
}

export default function SafaricomServicePage({ svc }) {
  if (!svc) return null;

  const path = `/safaricom/${svc.slug}`;
  const url = `${SITE_URL}${path}`;
  const others = SERVICE_SLUGS.filter((s) => s !== svc.slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: svc.cardTitle, item: url },
    ],
  };

  return (
    <>
      <Head>
        <title>{svc.titleSeo}</title>
        <meta name="description" content={svc.metaDescription} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={svc.titleSeo} />
        <meta property="og:description" content={svc.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={BUSINESS_NAME} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={svc.titleSeo} />
        <meta name="twitter:description" content={svc.metaDescription} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </Head>

      <div className="mx-auto max-w-[1000px] px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-[0.8rem] text-gray-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden>/</span>
          <span>Safaricom Corner</span>
          <span aria-hidden>/</span>
          <span className="text-gray-900">{svc.cardTitle}</span>
        </nav>

        <h1 className="mb-2 text-[1.9rem] font-extrabold leading-tight text-brand-700 md:text-[2.4rem]">
          {svc.h1}
        </h1>
        {svc.tagline && (
          <p className="mb-4 text-[1.05rem] font-semibold text-brand-600">{svc.tagline}</p>
        )}
        {(svc.intro || []).map((p, i) => (
          <p key={i} className="mb-3 max-w-[760px] text-gray-600">{p}</p>
        ))}

        {/* Top CTA — WhatsApp is the only checkout */}
        <a
          href={waLink(svc.cta.message)}
          target="_blank"
          rel="noopener"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-lg" /> {svc.cta.label}
        </a>

        {/* Content blocks */}
        {(svc.blocks || []).map((block, i) => <Block key={i} block={block} />)}

        {/* Primary CTA card */}
        <div className="my-8 rounded-2xl border border-gray-200 bg-brand-50 p-6">
          {svc.cta.heading && (
            <h2 className="mb-2 text-[1.2rem] font-bold text-brand-700">{svc.cta.heading}</h2>
          )}
          <a
            href={waLink(svc.cta.message)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
          >
            <FaWhatsapp className="text-lg" /> {svc.cta.label}
          </a>
          <p className="mt-3 text-[0.82rem] text-gray-500">
            We reply on WhatsApp during opening hours ({HOURS_DISPLAY}).
          </p>
        </div>

        {/* Other services */}
        <div className="mb-6">
          <h2 className="mb-3 text-[1.15rem] font-bold text-brand-700">Other Safaricom services</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((s) => (
              <li key={s}>
                <Link
                  href={`/safaricom/${s}`}
                  className="inline-block rounded-full bg-brand-50 px-3 py-1 text-[0.85rem] font-semibold text-brand-700 no-underline hover:bg-brand-100"
                >
                  {SAFARICOM_SERVICES[s].cardTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          <Link href="/products" className="font-semibold">Browse all products</Link>
          {"  ·  "}
          <Link href="/contact" className="font-semibold">Contact us</Link>
          {"  ·  "}
          <Link href="/" className="font-semibold">Back to home</Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: SERVICE_SLUGS.map((service) => ({ params: { service } })),
    fallback: false, // fixed, owner-approved set of services
  };
}

export async function getStaticProps({ params }) {
  const svc = getService(params.service);
  if (!svc) return { notFound: true };
  return { props: { svc }, revalidate: 600 };
}
