import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zcbmvhjkharfmmiqslls.supabase.co',
      },
    ],
  },
};

export default nextConfig;
