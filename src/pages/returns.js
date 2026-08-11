import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_URL, waLink } from "@/constants/business";

const PATH = "/returns";
const TITLE = "Returns & Exchanges | Snaap Connections";
const DESCRIPTION = "How returns and exchanges work at Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// This page is served noindex until the owner supplies an approved returns policy.
// Registered in the repo-root CONTENT-VERIFY.md. A P6 CI gate must fail the build if this
// page becomes indexable while the PLACEHOLDER COPY marker is still present.

export default function ReturnsPage() {
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
          until a real returns policy is supplied.
        </div>

        <h1 className="mb-4 text-[2.125rem] font-extrabold leading-tight text-brand-700">
          Returns &amp; Exchanges
        </h1>

        <p className="mb-4 text-gray-500">
          Our full returns and exchange policy is being finalised and will appear here once
          approved.
        </p>
        <p className="mb-6 text-gray-500">
          In the meantime: return terms vary by product and are shown on each product&apos;s page.
          To ask about a return or exchange today, message us on WhatsApp and we&apos;ll help you
          directly.
        </p>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <a
          href={waLink("Hi Snaap Connections, I'd like to ask about a return.")}
          target="_blank"
          rel="noopener"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white no-underline transition hover:bg-brand-700"
        >
          <FaWhatsapp className="text-lg" /> Ask about a return on WhatsApp
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
