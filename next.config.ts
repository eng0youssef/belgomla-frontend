import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IP addresses to access the dev server
  // @ts-ignore
  allowedDevOrigins: ["192.168.1.6", "26.155.55.215", "localhost"],
};

export default nextConfig;
