import Head from "next/head";
import Link from "next/link";
import { BUSINESS_NAME, ADDRESS, EMAIL, PHONE_DISPLAY } from "@/constants/business";

// PLACEHOLDER COPY — drafted 27 Oct 2026 at the owner's request (P10-3) and NOT
// yet reviewed by the owner or a lawyer. It describes only what the site
// actually does. Kept noindex until approved; CI gate 3 enforces that while
// this marker is here. Open points for review: the registered legal entity
// name, ODPC registration status, and a concrete retention period.

const TITLE = "Privacy Policy | Snaap Connections";
const DESCRIPTION = "How Snaap Connections collects, uses and protects the personal details you give us when you order or write a review.";

const H2 = "mb-2 mt-8 text-xl font-bold text-brand-700";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="robots" content="noindex,follow" />
      </Head>

      <article className="mx-auto max-w-[800px] px-4 py-10 text-[0.95rem] leading-relaxed text-gray-800 md:py-16">
        <h1 className="mb-1 text-[2rem] font-extrabold leading-tight text-brand-700">Privacy Policy</h1>
        <p className="mb-6 text-sm text-gray-600">Last updated 27 October 2026</p>

        <p>
          This policy explains what personal details {BUSINESS_NAME} (&ldquo;we&rdquo;) collects when you use
          this website, why, and what you can ask us to do with them. We are a phone and accessories shop at{" "}
          {ADDRESS.full}.
        </p>

        <h2 className={H2}>What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>When you place an order:</strong> your name, mobile number, email address if you give one,
            your delivery county, town and street or landmark (not needed for pickup), any notes you add, the
            products you order, and any M-Pesa confirmation codes you send us.
          </li>
          <li>
            <strong>When you write a review:</strong> the name you enter, your rating and review, and a phone
            number if you choose to give one. The phone number is never shown on the site.
          </li>
          <li>
            <strong>If you create an account:</strong> your name, email address, phone number if you give one,
            the delivery address you save, your wishlist, and when you last signed in. Your password is stored
            only in a scrambled form that nobody, including us, can read back.
          </li>
          <li>
            <strong>On your own device:</strong> your cart is saved in your browser, not on our servers, until
            you place an order. Your wishlist is saved in your browser too, and also to your account if you
            are signed in.
          </li>
        </ul>

        <h2 className={H2}>Cookies</h2>
        <p>
          If you sign in, we set one cookie that keeps you signed in for up to 30 days. It cannot be read by
          the page&apos;s own scripts and is not used for advertising or tracking. We set no advertising
          cookies.
        </p>

        <h2 className={H2}>How we use it</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>To confirm, prepare and deliver your order, or have it ready for pickup.</li>
          <li>To contact you about your order, including confirming a delivery fee.</li>
          <li>To match the M-Pesa codes you send us to payments into our Till.</li>
          <li>To handle warranty questions and queries about your order.</li>
          <li>To check reviews before they are published.</li>
        </ul>
        <p className="mt-2">
          We do not sell your personal details. We will ask before sending you promotional messages.
        </p>

        <h2 className={H2}>Payments</h2>
        <p>
          You pay us through M-Pesa, which is run by Safaricom. We never see your M-Pesa PIN and{" "}
          <strong>we will never ask you for it</strong> — not on this site, by phone or on WhatsApp.
        </p>

        <h2 className={H2}>Who else sees your details</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>The person delivering your order receives your name, phone number and delivery location.</li>
          <li>
            Companies that host this website and its database for us store your details on our behalf. Their
            servers may be outside Kenya.
          </li>
          <li>We will share details where the law requires us to.</li>
        </ul>

        <h2 className={H2}>How long we keep it</h2>
        <p>
          We keep order records for as long as we need them for your order, its warranty, and our legal and
          tax obligations.
        </p>

        <h2 className={H2}>Your rights</h2>
        <p>
          Under Kenya&apos;s Data Protection Act, 2019 you can ask what personal details we hold about you,
          ask us to correct or delete them (including closing your account), and object to how we use them.
          You can update your own account details at any time from My account. Contact us using the details
          below.
          If you are not satisfied with our answer, you can complain to the Office of the Data Protection
          Commissioner.
        </p>

        <h2 className={H2}>Keeping it safe</h2>
        <p>
          Only our staff can see orders, through a password-protected admin area. Order tracking on this site
          needs both your order number and your phone number, and does not show your street address.
        </p>

        <h2 className={H2}>Contact us</h2>
        <p>
          {BUSINESS_NAME}, {ADDRESS.full} · {EMAIL} · {PHONE_DISPLAY} (WhatsApp)
        </p>
        <p className="mt-6 text-sm">
          <Link href="/contact" className="font-semibold text-brand-700">Contact page</Link>
          {"  ·  "}
          <Link href="/track-order" className="font-semibold text-brand-700">Track your order</Link>
        </p>
      </article>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
