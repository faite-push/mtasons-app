import React from "react"
import type { Metadata, Viewport } from 'next'
import { Onest } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MTA Sons - Sua Música, Seu Ritmo',
  description: 'Ouça e baixe suas músicas favoritas com qualidade. Bass boost, volume aumentado e muito mais.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon.ico',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon.ico',
        type: 'image/png',
      },
    ],
    apple: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#ff8c00',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${onest.className} antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
