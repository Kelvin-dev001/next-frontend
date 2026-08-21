// On-demand ISR. Originally refreshed only the homepage when a homepage section
// was published or expired (P3 — "publishing or expiring must trigger
// revalidation"). It now takes a list of paths, because a product write also
// invalidates pages the product appears on. A newly flagged Safaricom device was
// invisible on /safaricom until someone happened to visit twice after the 300s
// window: ISR serves the stale copy on the first request and only rebuilds
// behind it, and these pages get little traffic.
//
// Guarded by REVALIDATE_TOKEN (server-only env — never NEXT_PUBLIC). Called
// server-to-server by the backend after a successful write.

const DEFAULT_PATHS = ["/"];
const MAX_PATHS = 20;

// Relative, same-origin, no scheme. The token already guards the endpoint; this
// only stops a malformed caller from spending the rebuild budget on junk.
function isSafePath(path) {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://") &&
    path.length <= 200
  );
}

export default async function handler(req, res) {
  const token = req.headers["x-revalidate-token"] || req.query.secret;
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  // No paths means the homepage, which is what every pre-existing caller sends.
  const requested = req.body?.paths ?? req.query.path ?? DEFAULT_PATHS;
  const paths = [...new Set([].concat(requested).filter(isSafePath))].slice(0, MAX_PATHS);

  if (!paths.length) {
    return res.status(400).json({ message: "No valid paths" });
  }

  // Each path is revalidated independently. res.revalidate() rejects for a route
  // that is not statically generated — /products/[id] is getServerSideProps, so
  // it always reports here as failed — and one such entry must not stop the
  // paths behind it from refreshing.
  const results = await Promise.all(
    paths.map((path) =>
      res
        .revalidate(path)
        .then(() => ({ path, revalidated: true }))
        .catch((err) => {
          console.error(`Revalidate failed for ${path}:`, err.message);
          return { path, revalidated: false, error: err.message };
        })
    )
  );

  return res.json({ results, at: new Date().toISOString() });
}
