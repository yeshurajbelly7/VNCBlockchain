'use client';

import './globals.css'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/super-admin') || 
                        pathname?.startsWith('/admin') || 
                        pathname?.startsWith('/presale-admin') ||
                        pathname?.startsWith('/wallet-system-admin') ||
                        pathname?.startsWith('/validator-dashboard');

  return (
    <html lang="en">
      <head>
        {/* Cashfree Payment Gateway SDK */}
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async></script>
      </head>
      <body>
        {!isAdminRoute && <Header />}
        {children}
      </body>
    </html>
  )
}
