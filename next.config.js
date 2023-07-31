/** @type {import('next').NextConfig} */

  const path=require('path')
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    config.resolve.alias['@pages'] = path.join(__dirname, 'pages');
    return config;},
  eslint: {
    ignoreDuringBuilds: true,
  },

}
module.exports = nextConfig


