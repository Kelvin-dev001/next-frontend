/**
 * Per-county content for the five location landing pages (P5).
 *
 * These five counties are the complete service area — never add a sixth. Delivery
 * COST and TIME are NOT stored here: they come from DELIVERY_ZONES in business.js
 * (the single source of truth), resolved per county on the page. This file holds
 * only the genuinely-different editorial content per county.
 *
 * Town lists are county geography (verifiable), not market facts. Worth an owner
 * sanity-check, but they are standard place names within each county.
 */

export const LOCATIONS = {
  mombasa: {
    slug: "mombasa",
    county: "Mombasa",
    region: "Coast",
    isShop: true,
    titleSeo: "Buy Phones in Mombasa — Visit Our Digo Road Shop | Snaap Connections",
    metaDescription:
      "Snaap Connections is a phone shop on Digo Road, opposite Baroda Mall, Mombasa. Walk in or order on WhatsApp for same-day delivery across Mombasa County.",
    h1: "Phones & Accessories in Mombasa",
    introParas: [
      "Snaap Connections is a physical phone shop in the heart of Mombasa, on Digo Road opposite Baroda Mall. Come in to see and compare phones in person, or order on WhatsApp and we'll deliver the same day anywhere in Mombasa County.",
      "We stock smartphones, tablets, audio and accessories from the brands Kenyans actually buy, with genuine warranties and honest pricing. If you're looking for a phone shop near you in Mombasa, walk in during opening hours or message us any time.",
    ],
    towns: ["Mombasa Island / CBD", "Nyali", "Bamburi", "Kisauni", "Likoni", "Changamwe"],
    localFaqs: [
      { q: "Where is your shop in Mombasa?", a: "We're on Digo Road, opposite Baroda Mall, in central Mombasa. You're welcome to walk in during opening hours." },
      { q: "Can I buy in person instead of ordering online?", a: "Yes. Visit the shop to see phones in person, ask questions and buy on the spot. You can also order on WhatsApp if you'd prefer delivery." },
    ],
  },

  kilifi: {
    slug: "kilifi",
    county: "Kilifi",
    region: "Coast",
    isShop: false,
    titleSeo: "Phone Delivery to Kilifi — Same-Day from Mombasa | Snaap Connections",
    metaDescription:
      "Order phones and accessories for delivery across Kilifi County — Kilifi town, Malindi, Watamu and Mtwapa — same-day from our Mombasa shop. Order on WhatsApp.",
    h1: "Phone Delivery to Kilifi County",
    introParas: [
      "We deliver phones and accessories across Kilifi County from our shop in neighbouring Mombasa. Because Kilifi is in the Coast region, orders arrive the same day — just message us on WhatsApp with the phone you want.",
      "Our Kilifi delivery reaches the main coastal towns, including Kilifi town, Malindi, Watamu and Mtwapa. Malindi is a town within Kilifi County, so it's covered by the same Kilifi delivery.",
    ],
    towns: ["Kilifi town", "Malindi", "Watamu", "Mtwapa", "Mariakani", "Kaloleni"],
    localFaqs: [
      { q: "Do you deliver to Malindi?", a: "Yes. Malindi is a town in Kilifi County, so it's covered by our Kilifi delivery." },
      { q: "How do I order for delivery to Kilifi?", a: "Browse the phone you want and tap the WhatsApp button, or message us directly. We confirm the phone, price and delivery with you before dispatch." },
    ],
  },

  kwale: {
    slug: "kwale",
    county: "Kwale",
    region: "Coast",
    isShop: false,
    titleSeo: "Phone Delivery to Kwale — Same-Day from Mombasa | Snaap Connections",
    metaDescription:
      "Order phones for same-day delivery across Kwale County — Diani, Ukunda, Msambweni and Kwale town — from our Mombasa shop. Order on WhatsApp.",
    h1: "Phone Delivery to Kwale County",
    introParas: [
      "Kwale County sits just south of our Mombasa shop, so we deliver there the same day. Order the phone you want on WhatsApp and we'll get it to you across Kwale.",
      "Our Kwale delivery covers the south-coast towns, including Diani, Ukunda, Msambweni and Kwale town.",
    ],
    towns: ["Diani", "Ukunda", "Msambweni", "Kwale town", "Kinango", "Lunga Lunga"],
    localFaqs: [
      { q: "Do you deliver to Diani and Ukunda?", a: "Yes. Both are in Kwale County and covered by our same-day Kwale delivery." },
      { q: "How do I order for delivery to Kwale?", a: "Message us on WhatsApp with the phone you want. We confirm availability, price and delivery before dispatch." },
    ],
  },

  nairobi: {
    slug: "nairobi",
    county: "Nairobi",
    region: "Outside the Coast region",
    isShop: false,
    titleSeo: "Phone Delivery to Nairobi — Within 24 Hours | Snaap Connections",
    metaDescription:
      "Buy phones from Mombasa with delivery to Nairobi within 24 hours. Genuine phones with warranty, honest prices. Order on WhatsApp.",
    h1: "Phone Delivery to Nairobi",
    introParas: [
      "We deliver phones and accessories from our Mombasa shop to Nairobi. Orders to Nairobi arrive within 24 hours — message us on WhatsApp with the phone you want.",
      "Every phone is genuine and comes with the warranty shown on its product page. We confirm the price and delivery with you on WhatsApp before anything is dispatched, so there are no surprises.",
    ],
    towns: ["Nairobi CBD", "Westlands", "Eastlands", "Kasarani", "Embakasi", "Karen"],
    localFaqs: [
      { q: "Are the phones genuine and do they have a warranty?", a: "Yes. Every phone is genuine, with the warranty shown on its product page. Ask us on WhatsApp for the details of a specific model." },
      { q: "How do I pay for a Nairobi delivery?", a: "You order and confirm on WhatsApp and pay directly — M-Pesa (Lipa Na Mpesa) is supported. We agree the payment method with you when you order." },
    ],
  },

  machakos: {
    slug: "machakos",
    county: "Machakos",
    region: "Outside the Coast region",
    isShop: false,
    titleSeo: "Phone Delivery to Machakos — Within 24 Hours | Snaap Connections",
    metaDescription:
      "Order phones from Mombasa for delivery to Machakos County — Machakos town, Athi River and Mavoko — within 24 hours. Order on WhatsApp.",
    h1: "Phone Delivery to Machakos",
    introParas: [
      "We deliver from our Mombasa shop to Machakos County within 24 hours. Order the phone you want on WhatsApp and we'll arrange delivery to your area.",
      "Our Machakos delivery covers Machakos town, Athi River and Mavoko. Every phone is genuine, with the warranty shown on its product page.",
    ],
    towns: ["Machakos town", "Athi River", "Mavoko", "Kangundo", "Matuu", "Kathiani"],
    localFaqs: [
      { q: "Do you deliver to Athi River and Mavoko?", a: "Yes. Both are in Machakos County and covered by our Machakos delivery." },
      { q: "How do I order for delivery to Machakos?", a: "Message us on WhatsApp with the phone you want; we confirm availability, price and delivery before dispatch." },
    ],
  },
};

export const LOCATION_SLUGS = Object.keys(LOCATIONS);
