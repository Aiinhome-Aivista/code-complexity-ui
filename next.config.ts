import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ MNC Standard: This is the "Proxy"
  // It tells Next.js: "If you see /api, send it to Python quietly."
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*", // Your Python Backend URL
      },
    ];
  },
};

export default nextConfig;
