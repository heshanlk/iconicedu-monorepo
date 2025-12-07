/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile shared UI package from source instead of relying on a prebuilt bundle.
  transpilePackages: ['@iconicedu/ui-web'],
};

export default nextConfig;
