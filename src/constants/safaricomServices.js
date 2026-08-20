/**
 * Safaricom Corner — the 12 service landing pages (P7).
 *
 * A finite, editorial set (mirrors constants/locations.js): fixed slugs, copy +
 * SEO fields live here, the page at pages/safaricom/[service].js renders them and
 * getStaticPaths builds exactly these slugs (fallback:false).
 *
 * COPY RULES baked in (see ../../CLAUDE.md):
 *   - No prices anywhere. Home Fibre / packages -> "ask on WhatsApp". Safaricom
 *     terms stay in the owner-approved, hedged wording ("subject to the current
 *     offering", "depending on availability") — never invent a figure or term.
 *   - WhatsApp is the only checkout: every CTA is a wa.me link built by waLink()
 *     on the page, from the prefilled `message` here.
 *
 * Content model — each service is:
 *   { slug, iconKey, cardTitle, cardSubtitle, badge?,
 *     titleSeo, metaDescription, h1, tagline, intro: [para,...],
 *     blocks: [ ...content blocks... ],
 *     cta: { heading?, label, message } }   // primary WhatsApp CTA
 *
 * Block types the page renders:
 *   { type: "section", heading?, paras?: [], bullets?: [] }
 *   { type: "grid",    heading?, items: [{ title, body }] }
 *   { type: "links",   heading?, items: [{ label, href }] }
 */

export const SAFARICOM_SERVICES = {
  // 1 ─────────────────────────────────────────────────────────────────────────
  mpesa: {
    slug: "mpesa",
    iconKey: "mpesa",
    cardTitle: "M-PESA Services",
    cardSubtitle: "Deposit, withdraw, send, pay",
    titleSeo: "M-PESA Services in Mombasa — Deposit, Withdraw, Send & Pay | Snaap Connections",
    metaDescription:
      "Access M-PESA services at Snaap Connections in Mombasa — cash deposit and withdrawal, send money, Lipa na M-PESA, registration and support. Get help on WhatsApp.",
    h1: "M-PESA Services",
    tagline: "Send. Receive. Pay. Access Your Money.",
    intro: [
      "M-PESA makes it easier to manage your everyday money from your mobile phone. Whether you need to deposit or withdraw cash, send money, pay for goods and services or get assistance with an M-PESA service, our team is here to help.",
      "As a Safaricom service outlet, we provide convenient access to available M-PESA services and guide customers through the processes where assistance is required.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Cash Deposit",
        paras: [
          "Need to put money into your M-PESA account?",
          "Visit our outlet and deposit cash into your M-PESA account conveniently and securely.",
          "Suitable for:",
        ],
        bullets: [
          "Everyday personal transactions",
          "Sending money to family and friends",
          "Paying bills",
          "Buying goods and services",
          "Funding your M-PESA account",
        ],
      },
      {
        type: "section",
        heading: "Cash Withdrawal",
        paras: [
          "Need cash from your M-PESA account?",
          "You can withdraw cash at our M-PESA service point, subject to applicable transaction requirements and limits.",
        ],
      },
      {
        type: "section",
        heading: "Send Money",
        paras: [
          "M-PESA allows registered customers to send money to other registered mobile-money users.",
          "Whether you are sending money to family, paying someone or making a personal transfer, our team can assist you with available M-PESA services.",
        ],
      },
      {
        type: "section",
        heading: "Lipa na M-PESA",
        paras: [
          "M-PESA allows customers to pay businesses using Buy Goods/Till and PayBill services.",
          "Pay for goods, services, bills and other transactions conveniently from your phone.",
        ],
      },
      {
        type: "section",
        heading: "M-PESA Registration",
        paras: [
          "Not yet registered for M-PESA?",
          "Customers can register for M-PESA through authorized Safaricom service channels. Registration requires identification and verification in accordance with applicable requirements.",
        ],
      },
      {
        type: "section",
        heading: "M-PESA Support",
        paras: [
          "Having difficulty with an M-PESA service?",
          "Talk to our team and we'll help you understand the available options and the next steps.",
        ],
      },
      {
        type: "grid",
        heading: "Why Use Our M-PESA Service Point?",
        items: [
          { title: "Convenience", body: "Access essential M-PESA services from a convenient local location." },
          { title: "Professional Assistance", body: "Our team can guide you when you're unsure about a service or process." },
          { title: "Secure Transactions", body: "Always protect your M-PESA PIN and personal information. Never share your PIN with anyone." },
        ],
      },
    ],
    cta: {
      heading: "Ready to Get M-PESA Assistance?",
      label: "Get M-PESA assistance on WhatsApp",
      message: "Hello, I need assistance with an M-PESA service. Please help me with my request.",
    },
  },

  // 2 ─────────────────────────────────────────────────────────────────────────
  sim: {
    slug: "sim",
    iconKey: "sim",
    cardTitle: "SIM & Line Services",
    cardSubtitle: "New SIM, replacement, registration",
    titleSeo: "Safaricom SIM Cards & Line Services in Mombasa | Snaap Connections",
    metaDescription:
      "New Safaricom SIM cards, SIM replacement, registration and line services in Mombasa. Talk to our team on WhatsApp about the requirements and verification.",
    h1: "SIM Cards & Safaricom Line Services",
    tagline: "Get Connected. Stay Connected.",
    intro: [
      "Whether you're joining the Safaricom network, replacing a lost or damaged SIM card, or need help with a Safaricom line service, our team can guide you through the available options.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Get a New SIM Card",
        paras: [
          "Looking for a new Safaricom line?",
          "Get a Safaricom SIM card and access mobile voice, SMS, data and M-PESA services.",
          "Our team can guide you through the registration process and requirements.",
        ],
      },
      {
        type: "section",
        heading: "SIM Replacement",
        paras: [
          "Lost your SIM card?",
          "A damaged or lost SIM can interrupt your communication, mobile payments and access to important services.",
          "Ask our team about SIM replacement and the applicable verification requirements.",
        ],
      },
      {
        type: "section",
        heading: "SIM-Related Assistance",
        paras: ["We can assist with enquiries relating to:"],
        bullets: [
          "New SIM cards",
          "SIM replacement",
          "SIM registration",
          "Line-related services",
          "SIM activation",
          "Mobile connectivity enquiries",
        ],
      },
      {
        type: "section",
        heading: "What You May Need",
        paras: [
          "Certain SIM-related services require identification and customer verification.",
          "Our team will advise you on the documents and information required for your specific request.",
        ],
      },
    ],
    cta: {
      heading: "Get Your SIM",
      label: "Get a SIM on WhatsApp",
      message: "Hello, I would like to get a Safaricom SIM card. Please guide me on the requirements and process.",
    },
  },

  // 3 ─────────────────────────────────────────────────────────────────────────
  "airtime-data": {
    slug: "airtime-data",
    iconKey: "data",
    cardTitle: "Airtime & Data",
    cardSubtitle: "Bundles for every need",
    titleSeo: "Safaricom Airtime & Data Bundles in Mombasa | Snaap Connections",
    metaDescription:
      "Get Safaricom airtime, voice offers and data bundles in Mombasa. Not sure how much data you need? Tell us how you use your phone and we'll help — on WhatsApp.",
    h1: "Airtime & Data Bundles",
    tagline: "Stay Connected Wherever You Go",
    intro: [
      "From calls and messaging to social media, streaming, online work and business, mobile connectivity has become part of everyday life.",
      "Get assistance accessing available Safaricom airtime, voice and data services that match your needs.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Airtime",
        paras: [
          "Need airtime?",
          "Get airtime for your Safaricom number or purchase airtime for another number where supported.",
        ],
      },
      {
        type: "section",
        heading: "Voice Services",
        paras: [
          "Stay connected with voice services and available voice offers.",
          "Whether you make occasional calls or communicate throughout the day, our team can help you identify available options.",
        ],
      },
      {
        type: "section",
        heading: "Data Bundles",
        paras: [
          "Need internet on your phone?",
          "Safaricom offers a range of mobile data options for different usage needs.",
          "Use your data for:",
        ],
        bullets: [
          "WhatsApp",
          "Social media",
          "Online meetings",
          "Email",
          "Research",
          "Online learning",
          "Streaming",
          "Browsing",
          "Business operations",
        ],
      },
      {
        type: "section",
        heading: "Choosing a Data Bundle",
        paras: [
          "Not sure how much data you need?",
          "Tell us how you use your phone and how frequently you need internet access. We can help you identify the available options.",
        ],
      },
      {
        type: "section",
        heading: "Stay Connected",
        paras: [
          "Whether you need a quick data bundle for the day or a longer-term connectivity option, we're ready to assist.",
        ],
      },
    ],
    cta: {
      label: "Get a data bundle on WhatsApp",
      message: "Hello, I would like to get a Safaricom data bundle. Please show me the available options.",
    },
  },

  // 4 ─────────────────────────────────────────────────────────────────────────
  "home-fibre": {
    slug: "home-fibre",
    iconKey: "fibre",
    cardTitle: "Home Internet",
    cardSubtitle: "Safaricom Home Fibre",
    titleSeo: "Safaricom Home Fibre & Home Internet in Mombasa | Snaap Connections",
    metaDescription:
      "Safaricom Home Fibre and home internet — Wi-Fi for work, streaming and learning. Availability depends on your area; message us on WhatsApp to check and for current packages.",
    h1: "Safaricom Home Internet",
    tagline: "Fast, Reliable Internet for Your Home",
    intro: [
      "Bring reliable internet connectivity into your home for work, entertainment, education and everyday communication.",
      "Safaricom Home Fibre provides home internet connectivity through a Wi-Fi router, with available packages depending on the current Safaricom offering and your location.",
    ],
    blocks: [
      {
        type: "grid",
        heading: "Perfect For",
        items: [
          { title: "Work From Home", body: "Connect laptops, phones and other devices for remote work, meetings, email and cloud-based applications." },
          { title: "Entertainment", body: "Enjoy online entertainment, streaming and browsing across your connected devices." },
          { title: "Online Learning", body: "Support online classes, research, digital learning platforms and educational content." },
          { title: "Families", body: "Connect multiple household devices to the internet for work, communication and entertainment." },
        ],
      },
      {
        type: "section",
        heading: "Home Fibre Availability",
        paras: [
          "Home Fibre availability depends on coverage in your area.",
          "Tell us your location and we'll guide you on checking whether the service is available in your area.",
        ],
      },
      {
        type: "section",
        heading: "Home Fibre Packages",
        paras: [
          "Safaricom's current Home Fibre information includes multiple speed tiers, with packages and pricing subject to the current offering. Customers can also access bulk-payment options for eligible plans.",
          "For the latest available packages, message us on WhatsApp and we'll share the current options.",
        ],
      },
      {
        type: "section",
        heading: "Other Home Connectivity Options",
        paras: ["Depending on availability, customers may also explore:"],
        bullets: [
          "4G Home Internet",
          "5G Home Internet",
          "4G/5G routers",
          "Wi-Fi connectivity solutions",
        ],
      },
      {
        type: "section",
        paras: [
          "Safaricom's current router journey includes both 4G and 5G devices, with activation involving the router, SIM registration and purchase of an applicable bundle/package.",
        ],
      },
    ],
    cta: {
      heading: "Ready to Get Connected?",
      label: "Check fibre availability on WhatsApp",
      message: "Hello, I would like to check Safaricom Home Internet/Fibre availability at my location. My location is ______.",
    },
  },

  // 5 ─────────────────────────────────────────────────────────────────────────
  "mpesa-business": {
    slug: "mpesa-business",
    iconKey: "business",
    cardTitle: "M-PESA for Business",
    cardSubtitle: "Till, PayBill & more",
    titleSeo: "M-PESA for Business in Mombasa — Business Till, PayBill & More | Snaap Connections",
    metaDescription:
      "Set up M-PESA for Business in Mombasa — Business Till, PayBill, Pochi la Biashara and Bulk Payments. We help businesses access available M-PESA solutions on WhatsApp.",
    h1: "M-PESA for Business",
    tagline: "Give Your Customers an Easier Way to Pay",
    intro: [
      "Accepting digital payments can make everyday business transactions faster, more convenient and easier to manage.",
      "We help businesses access available M-PESA business solutions, including Business Till, PayBill, Pochi la Biashara and other business payment services. Safaricom positions its M-PESA for Business offering around services including PayBill, Business Till and Bulk Payments.",
    ],
    blocks: [
      {
        type: "section",
        heading: "M-PESA Business Till",
        paras: [
          "Receive customer payments directly through your Business Till.",
          "A Business Till is designed for businesses that regularly receive payments from customers.",
          "It can be suitable for:",
        ],
        bullets: [
          "Retail shops",
          "Supermarkets",
          "Restaurants",
          "Pharmacies",
          "Hardware stores",
          "Salons",
          "Boutiques",
          "Service businesses",
          "Other merchants",
        ],
      },
      {
        type: "section",
        paras: [
          "Safaricom specifically identifies retail businesses such as supermarkets, restaurants, hardware stores, pharmacies, boutiques and salons as examples of businesses that can use a Business Till.",
        ],
      },
      {
        type: "grid",
        heading: "Business Till Benefits",
        items: [
          { title: "Convenient payments", body: "Customers can pay directly through M-PESA." },
          { title: "Business transaction management", body: "Eligible merchants can use the M-PESA Business App and other channels to manage transactions." },
          { title: "Multiple business functions", body: "Depending on the product and merchant setup, available functions can include receiving payments, withdrawals, payments, statements and airtime sales." },
        ],
      },
      {
        type: "links",
        heading: "Explore business services",
        items: [
          { label: "M-PESA PayBill", href: "/safaricom/paybill" },
          { label: "Pochi la Biashara", href: "/safaricom/pochi-la-biashara" },
          { label: "Business App & management", href: "/safaricom/business-app" },
          { label: "Business connectivity", href: "/safaricom/business-connectivity" },
          { label: "Devices", href: "/safaricom/devices" },
          { label: "Bulk payments", href: "/safaricom/bulk-payments" },
        ],
      },
    ],
    cta: {
      heading: "Need Help Setting Up Your Business?",
      label: "Set up my business on WhatsApp",
      message: "Hello, I would like to set up an M-PESA business solution. Please guide me through the options and requirements.",
    },
  },

  // 6 ─────────────────────────────────────────────────────────────────────────
  paybill: {
    slug: "paybill",
    iconKey: "paybill",
    cardTitle: "M-PESA PayBill",
    cardSubtitle: "Collect customer payments",
    titleSeo: "M-PESA PayBill Setup in Mombasa — Collect Customer Payments | Snaap Connections",
    metaDescription:
      "Set up an M-PESA PayBill to collect payments from your customers — ideal for schools, organizations and subscription businesses. Get guided setup on WhatsApp.",
    h1: "M-PESA PayBill",
    tagline: "Collect Payments From Your Customers",
    intro: [
      "PayBill provides businesses and organizations with a way to collect payments from customers through M-PESA.",
      "It can be useful for organizations that receive recurring or account-based payments.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Ideal For",
        bullets: [
          "Schools",
          "Organizations",
          "Utility-related collections",
          "Subscription businesses",
          "Membership organizations",
          "Service providers",
          "Businesses collecting customer accounts",
        ],
      },
      {
        type: "section",
        paras: [
          "Customers can make PayBill payments through the M-PESA App, USSD or the M-PESA SIM Toolkit.",
        ],
      },
      {
        type: "grid",
        heading: "Why PayBill?",
        items: [
          { title: "Easy collections", body: "Give customers a familiar way to make payments." },
          { title: "Account-based payments", body: "Customers can enter an account/reference number where applicable." },
          { title: "Convenient for recurring payments", body: "Useful for businesses and organizations collecting payments from multiple customers." },
        ],
      },
    ],
    cta: {
      label: "Set up my business on WhatsApp",
      message: "Hello, I would like to set up an M-PESA PayBill for my business/organization. Please guide me through the requirements.",
    },
  },

  // 7 ─────────────────────────────────────────────────────────────────────────
  "pochi-la-biashara": {
    slug: "pochi-la-biashara",
    iconKey: "pochi",
    cardTitle: "Pochi la Biashara",
    cardSubtitle: "Separate business money",
    titleSeo: "Pochi la Biashara Setup in Mombasa — Separate Business Money | Snaap Connections",
    metaDescription:
      "Set up Pochi la Biashara to receive business payments separately from personal funds — for kiosks, food vendors, boda-boda operators and small traders. Ask us on WhatsApp.",
    h1: "Pochi la Biashara",
    tagline: "Separate Your Business Money From Personal Money",
    intro: [
      "Pochi la Biashara is designed for small business owners who want to receive business payments separately from personal funds on their M-PESA line.",
      "Safaricom identifies users such as food vendors, small kiosk owners, boda-boda operators and second-hand clothing dealers among the target users.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Ideal For",
        bullets: [
          "Small kiosks",
          "Food vendors",
          "Boda-boda operators",
          "Market traders",
          "Second-hand clothing sellers",
          "Small retail businesses",
          "Independent service providers",
        ],
      },
      {
        type: "grid",
        heading: "Why Pochi?",
        items: [
          { title: "Separate business funds", body: "Keep business money distinct from personal funds." },
          { title: "Simple customer payments", body: "Customers can pay your business through M-PESA." },
          { title: "Designed for small businesses", body: "A practical option for entrepreneurs who need a simple way to manage business collections." },
        ],
      },
    ],
    cta: {
      label: "Set up Pochi on WhatsApp",
      message: "Hello, I would like to set up Pochi la Biashara. Please guide me through the process.",
    },
  },

  // 8 ─────────────────────────────────────────────────────────────────────────
  "business-app": {
    slug: "business-app",
    iconKey: "app",
    cardTitle: "Business App",
    cardSubtitle: "Manage your M-PESA business",
    titleSeo: "M-PESA Business App & Management in Mombasa | Snaap Connections",
    metaDescription:
      "Use the M-PESA Business App to transact and see your business income — view transactions, balances, statements and more. Get help setting up on WhatsApp.",
    h1: "Manage Your M-PESA Business",
    tagline: "More Visibility. Better Control.",
    intro: [
      "Eligible M-PESA Business Till merchants can use the M-PESA Business App to transact and better visualize their business income.",
      "Safaricom says the app supports functions such as withdrawals, payments to PayBill/Buy Goods, sending money to customers, rolling up from child accounts and airtime sales.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Business Management Features",
        paras: ["Depending on your business setup, you may be able to:"],
        bullets: [
          "View transactions",
          "Check balances",
          "Access statements",
          "Make payments",
          "Manage multiple stores",
          "Perform business transactions",
          "Manage authorized users",
        ],
      },
      {
        type: "section",
        paras: [
          "For organizations using the M-PESA Business Portal, different user roles can also be configured, including operators, managers and auditors.",
        ],
      },
    ],
    cta: {
      heading: "Need Help Setting Up Your Business?",
      label: "Set up my business on WhatsApp",
      message: "Hello, I would like help setting up and managing my M-PESA Business. Please guide me.",
    },
  },

  // 9 ─────────────────────────────────────────────────────────────────────────
  "business-connectivity": {
    slug: "business-connectivity",
    iconKey: "connectivity",
    cardTitle: "Business Connectivity",
    cardSubtitle: "4G/5G, voice, data, SMS",
    titleSeo: "Safaricom Business Connectivity in Mombasa — 4G/5G, Voice, Data, SMS | Snaap Connections",
    metaDescription:
      "Explore Safaricom business connectivity — 4G/5G internet for business, business voice, data and Bulk SMS. Tell us your needs and talk to a consultant on WhatsApp.",
    h1: "Business Connectivity Solutions",
    tagline: "Keep Your Business Connected",
    intro: [
      "Your business depends on communication, internet access and reliable digital services.",
      "From a small shop to a growing organization, we can help you explore available Safaricom connectivity solutions based on your business requirements.",
      "Safaricom's current business portfolio includes connectivity, 4G/5G internet for business, business voice, data and SMS solutions, cloud, cybersecurity and other technology solutions.",
    ],
    blocks: [
      {
        type: "section",
        heading: "4G Internet for Business",
        paras: [
          "Flexible mobile connectivity for businesses that need reliable internet without depending exclusively on fixed connections.",
          "Suitable for:",
        ],
        bullets: [
          "Small offices",
          "Shops",
          "Temporary work locations",
          "Field operations",
          "Backup connectivity",
          "Businesses requiring mobile internet",
        ],
      },
      {
        type: "section",
        heading: "5G Internet for Business",
        paras: [
          "High-speed connectivity for businesses in supported coverage areas.",
          "Suitable for businesses that need strong internet performance for digital operations and connected devices.",
        ],
      },
      {
        type: "section",
        heading: "Business Voice",
        paras: ["Communication solutions designed to keep teams and customers connected."],
      },
      {
        type: "section",
        heading: "Business Data",
        paras: ["Data connectivity for employees, operations and digital services."],
      },
      {
        type: "section",
        heading: "Bulk SMS",
        paras: [
          "Useful for businesses and organizations communicating with groups of customers or members.",
          "Potential applications include:",
        ],
        bullets: [
          "Customer notifications",
          "Promotions",
          "Reminders",
          "Alerts",
          "Announcements",
          "Transactional communication",
        ],
      },
      {
        type: "section",
        heading: "Need a Business Connectivity Solution?",
        paras: [
          "Tell us about your business, location, number of users and what you need the internet for.",
          "Our team will help you explore the available options.",
        ],
      },
    ],
    cta: {
      label: "Talk to a consultant on WhatsApp",
      message: "Hello, I need a Safaricom connectivity solution for my business. I would like to speak with a consultant.",
    },
  },

  // 10 ────────────────────────────────────────────────────────────────────────
  devices: {
    slug: "devices",
    iconKey: "devices",
    cardTitle: "Devices",
    cardSubtitle: "Phones, routers & MiFi",
    titleSeo: "Phones, Routers & Connectivity Devices in Mombasa | Snaap Connections",
    metaDescription:
      "Smartphones, 4G/5G routers and portable MiFi in Mombasa. Tell us the device, your budget and how you'll use it, and we'll check the available options on WhatsApp.",
    h1: "Phones, Routers & Connectivity Devices",
    tagline: "Get Connected With the Right Device",
    intro: [
      "Looking for a smartphone, router or mobile internet device?",
      "We can help you check the availability of selected Safaricom devices and connectivity equipment.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Smartphones",
        paras: ["Choose from available smartphones for:"],
        bullets: [
          "Communication",
          "Social media",
          "Mobile banking",
          "Business",
          "Photography",
          "Entertainment",
          "Online learning",
        ],
      },
      {
        type: "section",
        heading: "4G Routers",
        paras: [
          "4G routers provide Wi-Fi connectivity for homes, offices and other locations where 4G coverage is available.",
        ],
      },
      {
        type: "section",
        heading: "5G Routers",
        paras: ["5G routers provide high-speed wireless connectivity in supported 5G coverage areas."],
      },
      {
        type: "section",
        heading: "MiFi & Portable Internet",
        paras: [
          "Portable Wi-Fi devices can provide internet connectivity while travelling, working remotely or operating away from a fixed internet connection.",
          "Safaricom's current 4G/5G router information shows that routers can be purchased through Safaricom Shops, Dealers and selected retail channels, subject to stock availability.",
        ],
      },
      {
        type: "section",
        heading: "Need a Device?",
        paras: ["Tell us:"],
        bullets: [
          "What device you need",
          "Your preferred budget",
          "How you intend to use it",
        ],
      },
      {
        type: "section",
        paras: ["We'll check the available options."],
      },
      {
        type: "links",
        heading: "In the meantime",
        items: [{ label: "Browse the phones in our shop", href: "/products" }],
      },
    ],
    cta: {
      label: "Check device availability on WhatsApp",
      message: "Hello, I am looking for a Safaricom device. Please let me know what is currently available.",
    },
  },

  // 11 ────────────────────────────────────────────────────────────────────────
  "bulk-payments": {
    slug: "bulk-payments",
    iconKey: "bulk",
    cardTitle: "Bulk Payments",
    cardSubtitle: "Pay many recipients",
    titleSeo: "M-PESA Bulk Payments in Mombasa — Pay Many Recipients | Snaap Connections",
    metaDescription:
      "M-PESA Bulk Payments for salaries, supplier payments, refunds and disbursements. Send business payments to multiple recipients efficiently. Set up on WhatsApp.",
    h1: "M-PESA Bulk Payments",
    tagline: "Send Business Payments Efficiently",
    intro: [
      "Businesses and organizations often need to make payments to multiple recipients.",
      "M-PESA Business solutions include Bulk Payments as part of Safaricom's business payment ecosystem.",
    ],
    blocks: [
      {
        type: "section",
        heading: "Useful For",
        bullets: [
          "Salaries and allowances",
          "Supplier payments",
          "Customer refunds",
          "Disbursements",
          "Field teams",
          "Organizations",
          "Promotions and campaigns",
        ],
      },
      {
        type: "grid",
        heading: "Why Bulk Payments?",
        items: [
          { title: "Efficiency", body: "Reduce the need to process numerous individual payments manually." },
          { title: "Convenience", body: "Manage business disbursements through available M-PESA business channels." },
          { title: "Business Visibility", body: "Eligible organizations can use business portals and associated tools to manage transactions and access statements." },
        ],
      },
    ],
    cta: {
      heading: "Interested in Bulk Payments?",
      label: "Set up my business on WhatsApp",
      message: "Hello, I would like to set up M-PESA Bulk Payments for my business/organization. Please guide me through the requirements.",
    },
  },

  // 12 ────────────────────────────────────────────────────────────────────────
  support: {
    slug: "support",
    iconKey: "support",
    cardTitle: "Get Help",
    cardSubtitle: "Not sure? Talk to us",
    titleSeo: "Need Help Choosing a Safaricom Service? | Snaap Connections, Mombasa",
    metaDescription:
      "Not sure which Safaricom service you need? Tell us what you're trying to do — M-PESA, SIM, data, Home Fibre, business solutions or devices — and we'll guide you on WhatsApp.",
    h1: "Need Help Choosing a Safaricom Service?",
    tagline: "Talk to Our Team",
    intro: [
      "Not sure which service is right for you?",
      "You don't need to know the product name before contacting us.",
      "Tell us what you're trying to accomplish and our team can guide you toward the appropriate available service.",
    ],
    blocks: [
      {
        type: "section",
        heading: "We Can Help With Enquiries About",
        bullets: [
          "M-PESA",
          "SIM cards",
          "SIM replacement",
          "Airtime",
          "Data",
          "Home Fibre",
          "4G/5G internet",
          "Routers",
          "M-PESA Business",
          "Till Numbers",
          "PayBill",
          "Pochi la Biashara",
          "Business connectivity",
          "Business communication solutions",
          "Devices",
        ],
      },
    ],
    cta: {
      label: "Chat with us on WhatsApp",
      message: "Hello, I'd like help choosing the right Safaricom service. Here's what I'm trying to do: ______.",
    },
  },
};

// Card display order on the homepage strip and the getStaticPaths build order.
export const SERVICE_SLUGS = Object.keys(SAFARICOM_SERVICES);

export const getService = (slug) => SAFARICOM_SERVICES[slug] || null;

/**
 * The shelves of the Safaricom device shop (P9), in display order.
 *
 * `type` matches Product.safaricomType on the API. The blurbs describe what WE
 * do — they deliberately say nothing about Safaricom's offers, terms or
 * financing, because those vary by device and belong in that product's own
 * description (see ../../CLAUDE.md).
 *
 * A shelf with no stock is not rendered at all: an empty shelf under a heading
 * reads as "sold out" when the truth is "we haven't listed any yet".
 */
export const SAFARICOM_DEVICE_SHELVES = [
  {
    type: "smartphone",
    title: "Smartphones",
    blurb: "Tap a phone for its price, full specification and what it comes with. Order on WhatsApp.",
  },
  {
    type: "router",
    title: "4G & 5G Routers",
    blurb: "Wi-Fi for a home, shop or office from a mobile network, with no fixed line to install.",
  },
  {
    type: "mifi",
    title: "MiFi & Portable Internet",
    blurb: "Pocket Wi-Fi you can carry — for travelling, working away from the office or a second connection.",
  },
  {
    type: "accessory",
    title: "Accessories",
    blurb: "Cables, chargers and add-ons for the devices above.",
  },
];
