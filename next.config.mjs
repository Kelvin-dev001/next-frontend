/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // P1-13 duplicate merges — owner-approved 2026-07-29. Each retired duplicate
  // product URL 301s to its surviving record so shared/indexed links keep their
  // equity instead of 404ing. The DB soft-delete + price corrections run
  // separately (see ../P1-13-apply-migration.js); these redirects are safe to
  // ship before or alongside it.
  async redirects() {
    return [
      // D1 — Itel A100c 64/2GB (3 → 1)
      { source: "/products/690b9c5294166453cc1a0986", destination: "/products/691493c47d0055637803eceb", permanent: true },
      { source: "/products/690b9bf894166453cc1a0984", destination: "/products/691493c47d0055637803eceb", permanent: true },
      // D2 — Floating Ark USB-A To Micro
      { source: "/products/692c47297d0055637803f5f1", destination: "/products/692c49ec7d0055637803f612", permanent: true },
      // D3 — Floating Ark Dual USB-A Charger
      { source: "/products/6929eb7a7d0055637803f57c", destination: "/products/6929ef697d0055637803f57f", permanent: true },
      // D4 — itel S26 ultra 256/8GB
      { source: "/products/69149aa27d0055637803ed33", destination: "/products/69149b3e7d0055637803ed35", permanent: true },
      // D5 — Tecno Spark Slim 256/8GB
      { source: "/products/6914617c7d0055637803ec92", destination: "/products/691461c57d0055637803ec94", permanent: true },
      // P1 — Itel S24 128/4GB
      { source: "/products/68a5a77a65492b5b215d5290", destination: "/products/68a5a52765492b5b215d528d", permanent: true },
      // P2 — Itel A70 128/3GB
      { source: "/products/68a49ce1a46b1d70c0d94a9a", destination: "/products/68a49977a46b1d70c0d94a93", permanent: true },
      // P3 — Itel A60s 64/4GB
      { source: "/products/68a45797a46b1d70c0d94a73", destination: "/products/68a458cfa46b1d70c0d94a76", permanent: true },
      // P7 — Tecno Camon 40 Pro 4G 256/8GB
      { source: "/products/687eb4daa2f0fde8dbb4f4fa", destination: "/products/688b5385de43e4b4ab950a86", permanent: true },
      // P4 — Redmi Pad SE (bare duplicate → 128/4GB)
      { source: "/products/68a04221a46b1d70c0d949aa", destination: "/products/68a04369a46b1d70c0d949ad", permanent: true },
    ];
  },
};

export default nextConfig;
