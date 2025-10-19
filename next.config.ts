/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true, // ✅ reemplaza ppr: true
  },
};

export default nextConfig;
