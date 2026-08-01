import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_URL, waLink } from "@/constants/business";

const PATH = "/why-us";
const TITLE = "Why Choose Us | Snaap Connections";
const DESCRIPTION = "Why shop with Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner supplies approved differentiators (verifiable claims only).
// Registered in the repo-root CONTENT-VERIFY.md.

export default function WhyUsPage() {
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
          until approved copy is supplied.
        </div>

        <h1 className="mb-4 text-[2.125rem] font-extrabold leading-tight text-[#1e3c72]">
          Why Choose Us
        </h1>

        <p className="mb-6 text-gray-500">
          Approved copy for this page is on the way. For the concrete facts about how we operate —
          where we are, what delivery costs and how long it takes — see{" "}
          <Link href="/about" className="font-semibold">About</Link> and{" "}
          <Link href="/shipping" className="font-semibold">Shipping &amp; Delivery</Link>.
        </p>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <a
          href={waLink("Hi Snaap Connections, I have a question.")}
          target="_blank"
          rel="noopener"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[#2e7d32] px-5 py-2.5 font-bold text-white no-underline transition hover:bg-[#256628]"
        >
          <FaWhatsapp className="text-lg" /> Talk to us on WhatsApp
        </a>

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
