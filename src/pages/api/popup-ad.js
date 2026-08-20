import { filterActiveSections } from "@/utils/sections";

const API = process.env.NEXT_PUBLIC_API_URL;
const SECTION_KEY = "popup_ads";
const UPSTREAM_TIMEOUT_MS = 5000;

// Only what the pop-up renders. The rest of the stored card (icon keys, badge
// tones, priority, search terms) would be dead weight on a metered connection.
function trim(ad) {
  return {
    _id: String(ad._id || ""),
    title: ad.title || "",
    subtitle: ad.subtitle || "",
    ctaLabel: ad.ctaLabel || "",
    ctaType: ad.ctaType || "",
    ctaLink: ad.ctaLink || "",
    productId: ad.productId ? String(ad.productId) : "",
    image: ad.image || "",
    imageMobile: ad.imageMobile || "",
    alt: ad.alt || "",
  };
}

/**
 * The one advert currently live, or null.
 *
 * Why this exists rather than passing the advert through getStaticProps: the
 * pop-up is site-wide, and half the storefront's routes fetch nothing at all.
 * Threading it through every page would put an advert nobody has scrolled to
 * into every served HTML document, on a connection the customer pays for.
 *
 * Scheduling is applied HERE, on the server clock, exactly as P3 requires —
 * `filterActiveSections` is the same function the homepage uses. Doing it in
 * the browser would let a wrong device clock resurrect an expired campaign.
 *
 * Any failure answers 200 with `{ ad: null }`: to the visitor, "the advert
 * service is down" and "there is no advert" are the same thing, and the client
 * then has no error path to get wrong.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ad: null });
  }

  if (!API) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ad: null });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(`${API}/homepage-sections`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);

    const payload = await upstream.json();
    const live = filterActiveSections(Array.isArray(payload) ? payload : []);
    const section = live.find((s) => s && s.sectionKey === SECTION_KEY);
    // First live advert with artwork wins. A queue of pop-ups is a queue of
    // interruptions; the cap in the admin says three, the visitor sees one.
    const ad = (section?.items || []).find((item) => item && item.image) || null;

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ ad: ad ? trim(ad) : null });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ad: null });
  } finally {
    clearTimeout(timer);
  }
}
