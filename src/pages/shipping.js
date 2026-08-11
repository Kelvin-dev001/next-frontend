import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_URL, DELIVERY_ZONES, waLink } from "@/constants/business";

const PATH = "/shipping";
const TITLE = "Shipping & Delivery in Kenya | Snaap Connections";
const DESCRIPTION =
  "Delivery rates and times from Snaap Connections: KSh 300 same-day across Mombasa, Kilifi and Kwale; KSh 500–1,500 within 24 hours to Nairobi and Machakos.";

export default function ShippingPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${SITE_URL}${PATH}`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}${PATH}`} />
      </Head>

      <div className="mx-auto max-w-[900px] px-4 py-10 md:py-16">
        <h1 className="mb-2 text-[2.125rem] font-extrabold leading-tight text-brand-700">
          Shipping &amp; Delivery
        </h1>
        <p className="mb-8 text-gray-500">
          We deliver to five counties. The rates and times below are fixed — the price you see is
          the price you pay. There is no free-delivery threshold and no hidden courier fee.
        </p>

        <div className="mb-6 overflow-x-auto rounded-3xl border border-gray-200">
          <table className="w-full text-left" aria-label="Delivery rates and times by county">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-bold">Counties</th>
                <th className="px-4 py-3 font-bold">Delivery cost</th>
                <th className="px-4 py-3 font-bold">Delivery time</th>
              </tr>
            </thead>
            <tbody>
              {DELIVERY_ZONES.map((zone) => (
                <tr key={zone.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">{zone.counties.join(", ")}</td>
                  <td className="px-4 py-3">{zone.priceDisplay}</td>
                  <td className="px-4 py-3">{zone.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-8 text-sm text-gray-500">
          These five counties are the complete list of areas we currently deliver to. Orders are
          placed and confirmed on WhatsApp, where we agree the delivery details with you before
          dispatch.
        </p>

        <a
          href={waLink("Hi Snaap Connections, I'd like to ask about delivery to my area.")}
          target="_blank"
          rel="noopener"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-lg" /> Ask about delivery on WhatsApp
        </a>

        <p className="text-sm text-gray-500">
          <Link href="/products" className="font-semibold">Browse all products</Link>
          {"  ·  "}
          <Link href="/faqs" className="font-semibold">FAQs</Link>
          {"  ·  "}
          <Link href="/contact" className="font-semibold">Contact us</Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
