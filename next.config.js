/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './app/lib/image-loader.ts',
  },
}

module.exports = nextConfig
