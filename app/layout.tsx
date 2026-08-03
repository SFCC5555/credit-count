import type { Metadata } from 'next'
import { Geist, Barlow_Condensed } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Footer } from '@/components/footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Credit Count',
  description: 'Track every rollercoaster you\'ve ever ridden.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
