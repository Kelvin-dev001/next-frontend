/**
 * Single source of truth for Snaap Connections business facts.
 *
 * RULE: never hardcode a phone number, address, opening hour or delivery price
 * anywhere else in this codebase. Import from here. A CI check in P6 fails the
 * build if either retired number reappears anywhere in the repo, so this file
 * deliberately does not spell them out.
 *
 * Confirmed by the owner 27 Jul 2026.
 */

export const BUSINESS_NAME = "Snaap Connections";
export const SITE_URL = "https://www.snaapconnections.co.ke";

// ── Contact ────────────────────────────────────────────────────────────────
// The ONLY number. Two older numbers were in circulation and are now retired.
// Since P10-3 (owner, 27 Oct 2026) WhatsApp is for SUPPORT only: orders are
// placed on the site through the cart and checkout, never "Buy on WhatsApp".
export const WHATSAPP_NUMBER = "254117000900";
export const PHONE_E164 = "+254117000900";
export const PHONE_DISPLAY = "+254 117 000 900";
// Changed 2026-08-20 from info@snaapconnections.com. Note the domain is
// snaapkenya.co.ke, not the site's own snaapconnections.co.ke — that is what
// the owner specified. Every mailto:, the footer, the contact and careers
// pages, /llms.txt and the MobilePhoneStore schema read this one constant.
export const EMAIL = "info@snaapkenya.co.ke";

export const waLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

// ── Location ───────────────────────────────────────────────────────────────
export const ADDRESS = {
  street: "Digo Rd, Opp Baroda Mall",
  locality: "Mombasa",
  region: "Mombasa County",
  country: "KE",
  full: "Digo Rd, Opp Baroda Mall, Mombasa, Kenya",
};

// Deliberately NOT set. The old -4.0435, 39.6682 was a generic Mombasa centroid
// inherited from the dead CRA build, not this shop. Populate only from the
// verified Google Business Profile pin. A wrong pin is worse than no pin.
export const GEO = null;

// ── Hours: 08:00–19:00, every day ──────────────────────────────────────────
export const HOURS = { opens: "08:00", closes: "19:00", days: "Every day" };
export const HOURS_DISPLAY = "8:00 AM – 7:00 PM, every day";

export const OPENING_HOURS_SPEC = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: HOURS.opens,
    closes: HOURS.closes,
  },
];

// ── Delivery ───────────────────────────────────────────────────────────────
// Five counties. There is NO free-delivery threshold at any order value.
export const FREE_DELIVERY_THRESHOLD = null;

export const DELIVERY_ZONES = [
  {
    id: "coast",
    label: "Coast region",
    counties: ["Mombasa", "Kilifi", "Kwale"],
    priceKES: 300,
    priceDisplay: "KSh 300",
    time: "Same day",
    transitDays: 0,
  },
  {
    id: "upcountry",
    label: "Outside the Coast region",
    counties: ["Nairobi", "Machakos"],
    priceKESMin: 500,
    priceKESMax: 1500,
    priceDisplay: "KSh 500 – 1,500",
    time: "Within 24 hours",
    transitDays: 1,
  },
];

export const SERVED_COUNTIES = DELIVERY_ZONES.flatMap((z) => z.counties);

// Counties that get same-day delivery, derived from the matrix above rather
// than listed again — the homepage and the top info bar both read this, and a
// second hand-written list is a second thing to get wrong.
export const SAME_DAY_COUNTIES =
  DELIVERY_ZONES.find((z) => /same day/i.test(z.time))?.counties || [];

export const deliveryForCounty = (county) =>
  DELIVERY_ZONES.find((z) =>
    z.counties.some((c) => c.toLowerCase() === String(county).toLowerCase())
  ) || null;

// ── Checkout & payment (P10-3) ─────────────────────────────────────────────
// Owner-confirmed 27 Oct 2026. M-Pesa Buy Goods is the ONLY payment method; the
// customer types the confirmation code and the shop checks it against the Till
// statement. The API prices orders from snaap-backend/config/business.js, which
// mirrors these values; scripts/ci/check-live-data.js fails if they drift.
export const MPESA_TILL = "9478805";
// The business name M-Pesa shows for this Till, which customers should check
// before entering their PIN. null until the owner confirms the exact spelling —
// the checkout only prints the line once it is set.
export const MPESA_TILL_NAME = null;

// Nairobi/Machakos: the order goes in with the delivery fee "to be confirmed".
// The customer pays for the items at checkout and the delivery fee separately,
// after the shop calls with it.
export const deliveryIsToBeConfirmed = (zone) => Boolean(zone) && zone.priceKES == null;

// Pickup from the shop. No delivery fee because nothing is delivered — never
// present it as free delivery.
export const PICKUP = {
  label: "Pick up from our shop",
  address: ADDRESS.full,
};

export const MAX_QTY_PER_PRODUCT = 10;

// ── Social ─────────────────────────────────────────────────────────────────
export const SOCIAL = {
  facebook: "https://www.facebook.com/share/1BF9FWk1w7/",
  tiktok: "https://www.tiktok.com/@snaap_connections",
  instagram: "https://www.instagram.com/snaap_connections1",
};

export const SAME_AS = [SOCIAL.facebook, SOCIAL.tiktok, SOCIAL.instagram];

// ── Money ──────────────────────────────────────────────────────────────────
// "KSh 12,999" — no decimals, ever.
export const formatKES = (value) =>
  typeof value === "number"
    ? `KSh ${value.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
    : "—";
