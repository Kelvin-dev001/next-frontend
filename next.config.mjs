/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.snaapconnections.co.ke' },
      { protocol: 'https', hostname: 'snaapconnections.co.ke' }
    ]
  }
};
module.exports = nextConfig;