/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/outlet",
        destination: "/",
        permanent: true,
      },
      {
        source: "/outlet/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
