import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { BackToTop } from './components/back-to-top'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Indragie Karunaratne',
    template: '%s | Indragie Karunaratne',
  },
  description: "I'm a Director of Engineering at Sentry working on observability tools. I started my career as an independent iOS and macOS developer, then worked on mobile infrastructure at Meta before co-founding Specto, a mobile application performance monitoring startup (acquired by Sentry). Lately, I've been exploring AI developer tools and building Context, a macOS app for debugging MCP servers.",
  openGraph: {
    title: 'Indragie Karunaratne',
    description: "I'm a Director of Engineering at Sentry working on observability tools. I started my career as an independent iOS and macOS developer, then worked on mobile infrastructure at Meta before co-founding Specto, a mobile application performance monitoring startup (acquired by Sentry). Lately, I've been exploring AI developer tools and building Context, a macOS app for debugging MCP servers.",
    url: baseUrl,
    siteName: 'Indragie Karunaratne',
    images: [
      {
        url: `${baseUrl}/og`,
        width: 1200,
        height: 630,
        alt: 'Indragie Karunaratne - Director of Engineering at Sentry',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indragie Karunaratne',
    description: "I'm a Director of Engineering at Sentry working on observability tools. I started my career as an independent iOS and macOS developer, then worked on mobile infrastructure at Meta before co-founding Specto, a mobile application performance monitoring startup (acquired by Sentry). Lately, I've been exploring AI developer tools and building Context, a macOS app for debugging MCP servers.",
    images: [`${baseUrl}/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
        <BackToTop />
      </body>
    </html>
  )
}
