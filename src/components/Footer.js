import Link from "next/link";
import { SiTiktok } from "react-icons/si";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_E164, waLink } from "@/constants/business";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Smartphones", href: "/products?category=Smartphones" },
  { label: "Laptops", href: "/products?category=Laptops" },
  { label: "Earbuds", href: "/products?category=Earbuds" },
  { label: "Tablets", href: "/products?category=Tablets" },
  { label: "Smart Watches", href: "/products?category=Smart Watches" },
];

const footerLinks = [
  { title: "Shop", links: shopLinks },
  { title: "About", links: [
    { label: "Our Story", href: "/our-story" },
    { label: "Why Choose Us", href: "/why-us" },
    { label: "Careers", href: "/careers" },
  ] },
  { title: "Support", links: [
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Returns", href: "/returns" },
    { label: "Shipping", href: "/shipping" },
  ] },
];

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/share/1BF9FWk1w7/", label: "Facebook" },
  { icon: <SiTiktok />, href: "https://www.tiktok.com/@snaap_connections?_t=ZM-8yavm2c5wJC&_r=1", label: "TikTok" },
  { icon: <FaInstagram />, href: "https://www.instagram.com/snaap_connections1?igsh=Yzc2dDkyejVqeDZl", label: "Instagram" },
  { icon: <FaWhatsapp />, href: waLink(), label: "WhatsApp" },
];

const locationLinks = [
  { label: "Mombasa", href: "/locations/mombasa" },
  { label: "Kilifi", href: "/locations/kilifi" },
  { label: "Kwale", href: "/locations/kwale" },
  { label: "Nairobi", href: "/locations/nairobi" },
  { label: "Machakos", href: "/locations/machakos" },
];

export default function Footer() {
  return (
    <footer
      className="border-t-2 border-brand-700 pb-2 pt-8 text-white"
      style={{ background: "linear-gradient(135deg, #075985 0%, #0179ab 60%, #6fd0f2 100%)" }}
    >
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Branding */}
          <div className="col-span-2">
            <div className="mb-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/snaap-logo.jpeg" alt="Snaap Connections" width={48} height={48} className="rounded" />
              <span className="text-lg font-bold text-white">Snaap Connections</span>
            </div>
            <p className="mb-3 max-w-[350px] text-sm text-white/90">
              Your one-stop shop for the latest tech gadgets, unbeatable deals, and exceptional customer service across Kenya.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/35 hover:text-brand-600"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="mb-3 font-bold tracking-wide text-brand-100">{section.title}</p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[0.95rem] font-medium text-white/90 transition hover:text-brand-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-3 font-bold tracking-wide text-brand-100">Contact Us</p>
            <div className="mb-1 flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-brand-300" />
              <span className="text-sm text-brand-50/90">{ADDRESS.full}</span>
            </div>
            <a href={`mailto:${EMAIL}`} className="mb-1 flex items-center gap-2 text-sm text-brand-50/90 hover:underline">
              <FaEnvelope className="flex-shrink-0 text-brand-300" /> {EMAIL}
            </a>
            <a href={`tel:${PHONE_E164}`} className="mb-1 flex items-center gap-2 text-sm text-brand-50/90 hover:underline">
              <FaPhoneAlt className="flex-shrink-0 text-brand-300" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-4">
          <p className="mb-2 text-sm font-semibold text-brand-100">Phone delivery across Kenya</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/85">
            {locationLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-200">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-4 border-white/25" />
        <p className="text-center text-sm text-brand-50/70">
          &copy; {new Date().getFullYear()} Snaap Connections. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
