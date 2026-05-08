import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Planet Canopy | Jungle Safari Experiences Across India',
  description: 'Discover India\'s most breathtaking wildlife sanctuaries with Planet Canopy. Premium jungle safari experiences across Jim Corbett, Ranthambore, Kaziranga, and more.',
  keywords: 'jungle safari, wildlife tour, India safari, tiger safari, national parks India, Jim Corbett, Ranthambore, Kaziranga',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${cormorant.variable} ${outfit.variable} font-serif antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
