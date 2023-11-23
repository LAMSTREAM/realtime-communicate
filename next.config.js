const {config} = require("./project-meta-config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For custom server
  basePath: config.basePath,
  //assetPrefix: process.env.NEXT_PUBLIC_BASEPATH || '',
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose' // For auth0 middleware edge runtime
  },
  webpack: (config, {isServer}) => {
    // Nextjs optimizing process cause socketio-client can not emit event with big data
    isServer && (config.externals = [...config.externals, 'socket.io-client']);
    return config
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: '**',
    //     port: '',
    //     pathname: '**',
    //   },
    //   {
    //     protocol: 'http',
    //     hostname: '**',
    //     port: '',
    //     pathname: '**',
    //   },
    // ],
  },

}

module.exports = nextConfig
