/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // incoming request
        destination: "https://faadevops.cloud/ekobuja/api/:path*", // testing
      },
    ];
  },
  images: {
    qualities: [100, 75],
    // formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
