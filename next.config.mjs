/** @type {import('next').NextConfig} */

const nextConfig = {};

module.exports = {
    env: {
      GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
  };

export default nextConfig;
