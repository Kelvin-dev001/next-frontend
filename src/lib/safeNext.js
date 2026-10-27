// Where to go after signing in (P10-4). Only a path on this site is accepted —
// "?next=https://evil.example" or "//evil.example" must never redirect away.
export default function safeNext(value, fallback = "/account") {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
