import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  SITE_URL, BUSINESS_NAME, ADDRESS, HOURS_DISPLAY, DELIVERY_ZONES, waLink,
} from "@/constants/business";

const PATH = "/about";
const TITLE = "About Snaap Connections | Phone Shop in Mombasa";
const DESCRIPTION =
  "Snaap Connections is a smartphone and accessories shop on Digo Rd, Opp Baroda Mall, Mombasa, delivering to five counties across Kenya. Order on WhatsApp.";

export default function AboutPage() {
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
        <h1 className="mb-4 text-[2.125rem] font-extrabold leading-tight text-[#1e3c72]">
          About {BUSINESS_NAME}
        </h1>

        <p className="mb-4 text-gray-500">
          {BUSINESS_NAME} is a smartphone and accessories retailer based in Mombasa, with a
          physical shop at {ADDRESS.full}. We sell the latest phones, tablets, laptops, earbuds,
          power banks and accessories, and deliver across five counties in Kenya.
        </p>

        <p className="mb-6 text-gray-500">
          Ordering is simple: browse the catalogue, then send us the item on WhatsApp. We confirm
          availability, the price and the delivery details with you before anything is dispatched —
          WhatsApp is our checkout, and it&apos;s where you&apos;ll always reach a real person.
        </p>

        <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-500">
          <li>
            Delivery to {DELIVERY_ZONES.flatMap((z) => z.counties).join(", ")} — see{" "}
            <Link href="/shipping" className="font-semibold">shipping &amp; delivery</Link> for
            rates and times.
          </li>
          <li>Open {HOURS_DISPLAY}.</li>
          <li>Selected phones are available on Lipa Mdogo Mdogo — terms vary by phone and are shown on each product page.</li>
        </ul>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3c72] px-5 py-2.5 font-bold text-white no-underline transition hover:bg-[#152c56]"
          >
            Browse all products
          </Link>
          <a
            href={waLink("Hi Snaap Connections, I'd like to know more.")}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#2e7d32] px-5 py-2.5 font-bold text-[#2e7d32] no-underline transition hover:bg-[#2e7d32]/10"
          >
            <FaWhatsapp className="text-lg" /> Talk to us on WhatsApp
          </a>
        </div>

        <p className="text-sm text-gray-500">
          <Link href="/contact" className="font-semibold">Contact us</Link>
          {"  ·  "}
          <Link href="/faqs" className="font-semibold">FAQs</Link>
        </p>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
