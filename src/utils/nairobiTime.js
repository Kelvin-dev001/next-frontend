// Africa/Nairobi is UTC+3 with no DST. The admin types wall-clock Nairobi time in
// a naive datetime-local input; anchor it to +03:00 so the stored instant is right
// regardless of the (UTC) server's timezone.
//
// Extracted from HomepageSectionForm in P9 so the pop-up scheduler uses exactly
// the same conversion — two admin screens writing the same field must not
// disagree about what "6pm" means.
export const NAIROBI_OFFSET = "+03:00";

export function nairobiInputToISO(v) {
  if (!v) return null;
  const withSeconds = v.length === 16 ? `${v}:00` : v;
  const d = new Date(`${withSeconds}${NAIROBI_OFFSET}`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function isoToNairobiInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const nairobi = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  return nairobi.toISOString().slice(0, 16);
}
