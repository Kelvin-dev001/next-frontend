// On-demand ISR: refresh the homepage immediately when a homepage section is
// published or expires, instead of waiting for the 60s revalidate window (P3 —
// "publishing or expiring must trigger revalidation").
//
// Guarded by REVALIDATE_TOKEN (server-only env — never NEXT_PUBLIC). Called
// server-to-server by the backend after a successful section write.
export default async function handler(req, res) {
  const token = req.headers["x-revalidate-token"] || req.query.secret;
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  try {
    await res.revalidate("/");
    return res.json({ revalidated: true, path: "/", at: new Date().toISOString() });
  } catch (err) {
    console.error("Revalidate error:", err);
    return res.status(500).json({ message: "Error revalidating" });
  }
}
