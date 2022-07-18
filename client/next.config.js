/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  publicRuntimeConfig:{

    APP_NAME: 'gitNode',
    API:'http://localhost:8080',
    PRODUCTION: false,
    DOMAIN: 'http://localhost:3000',
    FB_APP_ID: 'HDHJSUHN'
  }
}

module.exports = nextConfig
