/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

    if (!backendUrl) {
      console.warn("NEXT_PUBLIC_API_BASE_URL is not set — API rewrites disabled.");
      return [];
    }

    return [
      {
        // Browser calls /api/auth/register/initiate
        // Proxied to https://ekobuja-be.onrender.com/auth/register/initiate
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "c8ee67ec3fc21d54244624b8dcb6ec4f.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ekobujamedia.com.ng",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
