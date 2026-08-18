import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['italic', 'normal'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: false
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  adjustFontFallback: false
})

export const metadata: Metadata = {
  metadataBase: new URL('https://trendyscents.ng'),
  title: {
    default: 'Trendy Scents — Premier Decant Perfume Bar in Yenagoa, Bayelsa',
    template: '%s | Trendy Scents Yenagoa'
  },
  description: 'Yenagoa premier decant perfume lounge & oil bar on Isaac Boro Expressway. Sample 40+ authentic concentrated perfume oils decanted to the exact millilitre. Fast delivery across Bayelsa State.',
  keywords: [
    'perfume shop in bayelsa',
    'perfume shop in yenagoa',
    'trendy scents bayelsa',
    'decant perfume bar yenagoa',
    'isaac boro expressway perfume shop',
    'buy perfume oil in yenagoa',
    'designer perfume decants bayelsa',
    'luxury perfume store yenagoa',
    'oil concentrated perfumes bayelsa',
    'fragrance bar yenagoa',
    'best perfume shop in yenagoa',
    'decant oil perfume nigeria',
    'caramello velvet perfume',
    'oud royale yenagoa'
  ],
  authors: [{ name: 'Trendy Scents Yenagoa', url: 'https://trendyscents.ng' }],
  creator: 'Trendy Scents',
  publisher: 'Trendy Scents Fragrance Bar',
  category: 'Perfume Store & Fragrance Bar',
  alternates: {
    canonical: 'https://trendyscents.ng'
  },
  openGraph: {
    title: 'Trendy Scents — Premier Decant Perfume Bar in Yenagoa, Bayelsa',
    description: 'Explore over 40+ fine concentrated perfume oils, decanted live in front of you at our luxury lounge on Isaac Boro Expressway, Yenagoa.',
    url: 'https://trendyscents.ng',
    siteName: 'Trendy Scents',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/images/shop-checkout-lounge.jpg',
        width: 1200,
        height: 630,
        alt: 'Trendy Scents Fragrance Lounge on Isaac Boro Expressway, Yenagoa'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trendy Scents — Premier Decant Perfume Bar in Yenagoa',
    description: 'Yenagoa premier decant perfume bar on Isaac Boro Expressway. 40+ authentic oil concentrated perfumes.',
    images: ['/images/shop-checkout-lounge.jpg']
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
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' }
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark',
  themeColor: '#0A0908',
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': 'https://trendyscents.ng/#store',
  'name': 'Trendy Scents Fragrance Bar',
  'alternateName': 'Trendy Scents Yenagoa',
  'url': 'https://trendyscents.ng',
  'logo': 'https://trendyscents.ng/icon.svg',
  'image': 'https://trendyscents.ng/images/shop-checkout-lounge.jpg',
  'description': "Yenagoa's premier decant perfume lounge and oil bar on Isaac Boro Expressway. Over 40+ authentic concentrated perfume oils poured to the exact millilitre.",
  'telephone': '+2348012345678',
  'priceRange': '₦6,000 - ₦35,000',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Isaac Boro Expressway',
    'addressLocality': 'Yenagoa',
    'addressRegion': 'Bayelsa State',
    'postalCode': '560211',
    'addressCountry': 'NG'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 4.9163329,
    'longitude': 6.3059421
  },
  'hasMap': 'https://www.google.com/maps/place/Trendy+Scents/@4.7805902,6.2431559,16z/data=!4m6!3m5!1s0x106a050048eccd6f:0xf339d05ae6a61279!8m2!3d4.9163329!4d6.3059421!16s%2Fg%2F11ykgp551w',
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '10:00',
      'closes': '20:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': 'Saturday',
      'opens': '10:00',
      'closes': '19:00'
    }
  ],
  'sameAs': [
    'https://instagram.com/trendyscents',
    'https://wa.me/2348012345678'
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

