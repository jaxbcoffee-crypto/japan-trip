import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: { disableDevLogs: true },
});

const nextConfig = {
  reactStrictMode: true,
  viewTransition: true,
} satisfies NextConfig & { viewTransition?: boolean };

export default withPWA(nextConfig);
