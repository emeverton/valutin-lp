/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
