import Head from "next/head";
import Link from "next/link";
import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";
import {
  SITE_URL, ADDRESS, EMAIL, PHONE_DISPLAY, HOURS_DISPLAY, waLink,
} from "@/constants/business";

const PATH = "/contact";
const TITLE = "Contact Snaap Connections | Mombasa Phone Shop";
const DESCRIPTION =
  "Reach Snaap Connections in Mombasa on WhatsApp, phone or email. Digo Rd, Opp Baroda Mall. Open 8:00 AM – 7:00 PM, every day.";

export default function ContactPage() {
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
          Contact Us
        </h1>
        <p className="mb-8 text-gray-500">
          Questions about a phone, a price or a delivery? Message us on WhatsApp — it&apos;s the
          fastest way to reach us, and it&apos;s how we take every order.
        </p>

        <a
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-lg font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-xl" /> Chat with us on WhatsApp
        </a>

        <div className="mb-8 rounded-3xl border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-brand-700" />
              <p>{ADDRESS.full}</p>
            </div>
            <div className="flex items-center gap-4">
              <FaWhatsapp className="flex-shrink-0 text-brand-700" />
              <p>
                <a href={waLink()} target="_blank" rel="noopener" className="text-inherit no-underline">
                  {PHONE_DISPLAY}
                </a>{" "}
                — WhatsApp &amp; calls
              </p>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="flex-shrink-0 text-brand-700" />
              <p>
                <a href={`mailto:${EMAIL}`} className="text-inherit no-underline">{EMAIL}</a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <FaClock className="flex-shrink-0 text-brand-700" />
              <p>{HOURS_DISPLAY}</p>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />
        <p className="text-sm text-gray-500">
          Looking for something?{" "}
          <Link href="/products" className="font-semibold">Browse all products</Link>, or read our{" "}
          <Link href="/shipping" className="font-semibold">delivery information</Link> and{" "}
          <Link href="/faqs" className="font-semibold">FAQs</Link>.
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
