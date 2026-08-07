/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Required for src/instrumentation.ts (Sentry server/edge init) on Next 14.
  // Removed in Next 15+, where instrumentation is enabled by default.
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
