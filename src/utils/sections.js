// Server-authoritative homepage-section scheduling.
//
// These run in getStaticProps with the SERVER clock — never the browser's. An
// expired card must not reach the HTML even if the device clock is wrong (P3
// requirement). Africa/Nairobi has no DST and times are stored/compared as UTC,
// so no timezone library is needed here.

// Active when now is within [startsAt, endsAt): start inclusive, end exclusive.
function withinWindow(entity, now) {
  if (!entity) return false;
  const startOk = !entity.startsAt || new Date(entity.startsAt).getTime() <= now;
  const endOk = !entity.endsAt || new Date(entity.endsAt).getTime() > now;
  return startOk && endOk;
}

// Keep enabled, in-window sections; within each, keep only in-window items.
export function filterActiveSections(sections = [], now = Date.now()) {
  return (Array.isArray(sections) ? sections : [])
    .filter((s) => s && s.enabled !== false && withinWindow(s, now))
    .map((s) => ({
      ...s,
      items: (Array.isArray(s.items) ? s.items : []).filter((it) => withinWindow(it, now)),
    }));
}

export function getSection(sections, sectionKey) {
  return (Array.isArray(sections) ? sections : []).find((s) => s && s.sectionKey === sectionKey) || null;
}

// Split a promo section into its single announcement (which owns the homepage <h1>)
// and the ordered offer cards (highest priority first).
export function splitPromo(section) {
  const items = section && Array.isArray(section.items) ? section.items : [];
  const announcement = items.find((it) => it && it.type === "announcement") || null;
  const offers = items
    .filter((it) => it && it.type !== "announcement")
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  return { announcement, offers };
}

// True when a live promo section carries an active announcement card. The homepage
// uses this to decide whether the announcement or the evergreen heading is the <h1>.
export function hasActiveAnnouncement(sections, sectionKey = "promo_cards") {
  const { announcement } = splitPromo(getSection(sections, sectionKey) || { items: [] });
  return Boolean(announcement);
}
