import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_URL, BUSINESS_NAME, waLink } from "@/constants/business";

const PATH = "/our-story";
const TITLE = "Our Story | Snaap Connections";
const DESCRIPTION = "The story behind Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner supplies an approved brand story. Do NOT publish a founding year,
// customer counts or sponsorships until confirmed — the dead CRA copy invented "founded 2018"
// and "thousands of customers". Registered in the repo-root CONTENT-VERIFY.md.

export default function OurStoryPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href={`${SITE_URL}${PATH}`} />
      </Head>

      <div className="mx-auto max-w-[900px] px-4 py-10 md:py-16">
        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH -->" }} />

        <div role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Placeholder content — not approved for publication. This page is <strong>noindex</strong>{" "}
          until an approved brand story is supplied.
        </div>

        <h1 className="mb-4 text-[2.125rem] font-extrabold leading-tight text-[#1e3c72]">
          Our Story
        </h1>

        <p className="mb-6 text-gray-500">
          The full {BUSINESS_NAME} story is coming soon. The short version, and everything we can
          state for certain today: we&apos;re a smartphone and accessories shop based in Mombasa,
          serving customers across Kenya, with WhatsApp as our checkout.
        </p>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3c72] px-5 py-2.5 font-bold text-white no-underline transition hover:bg-[#152c56]"
          >
            About Snaap Connections
          </Link>
          <a
            href={waLink("Hi Snaap Connections, I'd like to know more about you.")}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#2e7d32] px-5 py-2.5 font-bold text-[#2e7d32] no-underline transition hover:bg-[#2e7d32]/10"
          >
            <FaWhatsapp className="text-lg" /> Talk to us on WhatsApp
          </a>
        </div>

        <p className="text-sm text-gray-500">
          <Link href="/products" className="font-semibold">Browse all products</Link>
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
