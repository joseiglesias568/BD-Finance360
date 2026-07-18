import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './layout-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://cvs-health-sooty.vercel.app'),
  title: {
    default: 'BD Finance360 - AI-Powered Management Reporting',
    template: '%s | BD Finance360'
  },
  description: 'AI-powered management reporting platform for Becton, Dickinson and Company. Real-time financial insights, health care analytics, and comprehensive enterprise reporting.',
  keywords: [
    'financial reporting',
    'management reporting',
    'business intelligence',
    'financial analytics',
    'BD',
    'CVS',
    'Aetna',
    'Caremark',
    'health care finance',
    'FP&A platform',
    'financial planning',
    'business performance',
    'enterprise finance',
    'AI financial insights'
  ],
  authors: [{ name: 'Becton, Dickinson and Company' }],
  creator: 'Becton, Dickinson and Company',
  publisher: 'Becton, Dickinson and Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'BD Finance360 - AI-Powered Management Reporting',
    description: 'AI-powered management reporting platform for Becton, Dickinson and Company.',
    siteName: 'BD Finance360',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BD Finance360 Management Reporting Platform'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BD Finance360 - AI-Powered Management Reporting',
    description: 'AI-powered management reporting platform for Becton, Dickinson and Company.',
    images: ['/twitter-image.png'],
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-icon.svg', sizes: '32x32', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/logo-icon.svg' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#CC0000',
      }
    ]
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'BD Finance360',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              description: 'AI-powered management reporting platform for Becton, Dickinson and Company. Real-time financial insights, health care analytics, and comprehensive enterprise reporting.',
              author: {
                '@type': 'Organization',
                name: 'Becton, Dickinson and Company',
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
