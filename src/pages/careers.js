import Head from "next/head";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_URL, EMAIL, waLink } from "@/constants/business";

const PATH = "/careers";
const TITLE = "Careers | Snaap Connections";
const DESCRIPTION = "Working with Snaap Connections.";

// PLACEHOLDER COPY — NOT APPROVED — DO NOT PUBLISH
// noindex until the owner confirms whether they are hiring and for what.
// No real openings are listed. Registered in the repo-root CONTENT-VERIFY.md.

export default function CareersPage() {
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
          until openings are confirmed.
        </div>

        <h1 className="mb-4 text-[2.125rem] font-extrabold leading-tight text-[#1e3c72]">
          Careers
        </h1>

        <p className="mb-6 text-gray-500">
          We&apos;re not advertising specific roles right now. If you&apos;d like to be considered
          for a future opening, email{" "}
          <a href={`mailto:${EMAIL}?subject=Expression%20of%20interest`} className="font-semibold text-inherit">
            {EMAIL}
          </a>{" "}
          or send us a message on WhatsApp.
        </p>

        <div aria-hidden dangerouslySetInnerHTML={{ __html: "<!-- END PLACEHOLDER COPY -->" }} />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={waLink("Hi Snaap Connections, I'm interested in working with you.")}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-5 py-2.5 font-bold text-white no-underline transition hover:bg-[#256628]"
          >
            <FaWhatsapp className="text-lg" /> Message us on WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}?subject=Expression%20of%20interest`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#1e3c72] px-5 py-2.5 font-bold text-[#1e3c72] no-underline transition hover:bg-[#1e3c72]/10"
          >
            Email us
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
