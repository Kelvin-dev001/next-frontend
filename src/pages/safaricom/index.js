import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp, FaChevronRight } from "react-icons/fa";
import ServiceIcon from "@/components/safaricomIcons";
import SafaricomDevices from "@/components/SafaricomDevices";
import { SAFARICOM_SERVICES, SERVICE_SLUGS } from "@/constants/safaricomServices";
import { fetchSafaricomShelves } from "@/utils/safaricomDevices";
import { SITE_URL, BUSINESS_NAME, HOURS_DISPLAY, ADDRESS, waLink } from "@/constants/business";

const PATH = "/safaricom";
const URL = `${SITE_URL}${PATH}`;
const OG_IMAGE = `${SITE_URL}/snaap-logo.jpeg`;

const PAGE_TITLE = "Safaricom Corner — Services & Devices in Mombasa | Snaap Connections";
const PAGE_DESCRIPTION =
  "M-PESA, SIM and line services, airtime and data, home internet and business services at our Digo Road shop in Mombasa — plus Safaricom smartphones, routers and MiFi. Order on WhatsApp.";

const WA_MESSAGE =
  "Hello Snaap Connections, I'd like help with a Safaricom service or device. Here's what I need: ______.";

/**
 * The Safaricom Corner hub.
 *
 * This route did not exist before P9: the homepage section and every
 * breadcrumb said "Safaricom Corner" while /safaricom itself was a 404, so the
 * section had twelve destinations and no front door. It is now the front door
 * — the devices we stock first, then all twelve services.
 */
export default function SafaricomHub({ shelves = [] }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Safaricom Corner", item: URL },
    ],
  };

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={BUSINESS_NAME} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>

      {/* Green band. saf-700 because this carries white text at body size —
          the identity green (saf-500) is only 2.85:1 against white. */}
      <div className="bg-saf-700 text-white">
        <div className="mx-auto max-w-[1000px] px-4 py-8 md:py-12">
          <nav aria-label="breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-[0.8rem] text-white/70">
            <Link href="/" className="text-white/90 hover:underline">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-white">Safaricom Corner</span>
          </nav>

          <h1 className="mb-2 text-[1.9rem] font-extrabold leading-tight md:text-[2.4rem]">
            Safaricom Corner
          </h1>
          <p className="mb-4 max-w-[760px] text-[1.05rem] font-semibold text-saf-100">
            Safaricom services and devices, over the counter at {ADDRESS.street}.
          </p>
          <p className="mb-5 max-w-[760px] text-white/90">
            M-PESA and business services, SIM and line help, airtime and data, home internet — and the
            smartphones, routers and portable internet devices we have in the shop. Tell us what you
            need on WhatsApp and we will sort it, or walk in during opening hours ({HOURS_DISPLAY}).
          </p>

          <a
            href={waLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-bold text-saf-700 no-underline transition hover:bg-saf-50"
          >
            <FaWhatsapp className="text-lg" /> Ask on WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-4 py-8 md:py-10">
        {/* Devices we actually stock, ahead of the services: this is a shop. */}
        {shelves.length > 0 ? (
          <>
            <h2 className="mb-1 text-[1.4rem] font-extrabold text-saf-700 md:text-[1.7rem]">
              Safaricom devices in stock
            </h2>
            <p className="mb-5 max-w-[760px] text-gray-600">
              Every price below is the price in the shop, and every device is ordered the same way —
              on WhatsApp.{" "}
              <Link href="/safaricom/devices" className="font-semibold text-saf-700 hover:underline">
                See the full device shop
              </Link>
              .
            </p>
            <SafaricomDevices shelves={shelves} variant="rail" />
          </>
        ) : (
          <p className="mb-8 max-w-[760px] rounded-2xl border border-saf-100 bg-saf-50 p-5 text-gray-700">
            Looking for a phone, router or MiFi?{" "}
            <Link href="/safaricom/devices" className="font-semibold text-saf-700 hover:underline">
              Tell us what you need
            </Link>{" "}
            and we will check what is available.
          </p>
        )}

        <h2 className="mb-1 mt-2 text-[1.4rem] font-extrabold text-saf-700 md:text-[1.7rem]">
          Services at the counter
        </h2>
        <p className="mb-5 max-w-[760px] text-gray-600">
          Twelve things we handle in the shop. Each one explains what it covers and what to bring.
        </p>

        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SLUGS.map((slug) => {
            const service = SAFARICOM_SERVICES[slug];
            return (
              <li key={slug}>
                <Link
                  href={`/safaricom/${slug}`}
                  className="flex h-full items-start gap-3 rounded-2xl border border-gray-200 p-4 no-underline transition hover:border-saf-300 hover:bg-saf-50"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-saf-50 text-saf-700">
                    <ServiceIcon iconKey={service.iconKey} className="text-xl" />
                  </span>
                  <span>
                    <span className="block font-bold text-gray-900">{service.cardTitle}</span>
                    {service.cardSubtitle && (
                      <span className="block text-[0.85rem] text-gray-500">{service.cardSubtitle}</span>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-saf-700">
                      Open <FaChevronRight className="text-[0.65rem]" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-8 rounded-2xl border border-saf-100 bg-saf-50 p-6">
          <h2 className="mb-2 text-[1.2rem] font-bold text-saf-700">Not sure which one you need?</h2>
          <p className="mb-3 max-w-[760px] text-gray-600">
            Describe what you are trying to do and we will point you at the right service — or handle
            it for you at the counter.
          </p>
          <a
            href={waLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-lg bg-saf-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-saf-700"
          >
            <FaWhatsapp className="text-lg" /> Ask on WhatsApp
          </a>
          <p className="mt-3 text-[0.82rem] text-gray-500">
            We reply on WhatsApp during opening hours ({HOURS_DISPLAY}).
          </p>
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

export async function getStaticProps() {
  const shelves = await fetchSafaricomShelves();
  return { props: { shelves }, revalidate: 300 };
}
