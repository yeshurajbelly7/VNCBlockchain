import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VNC-20 Blockchain | Quantum-Ready High-Performance Blockchain',
  description: 'Next-generation blockchain platform with 400,000+ TPS, sub-second finality, and post-quantum security. Built for global scale.',
  keywords: 'blockchain, cryptocurrency, VNC-20, quantum-secure, high-performance, EVM-compatible, DeFi',
  authors: [{ name: 'VNC-20 Foundation' }],
  openGraph: {
    title: 'VNC-20 Blockchain',
    description: 'Quantum-Ready High-Performance Blockchain',
    url: 'https://vnc20.io',
    siteName: 'VNC-20',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VNC-20 Blockchain',
    description: 'Quantum-Ready High-Performance Blockchain',
    creator: '@vnc20chain',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
