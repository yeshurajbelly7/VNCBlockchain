'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import NetworkStats from '@/components/NetworkStats'
import LiveMetrics from '@/components/LiveMetrics'
import LatestBlocks from '@/components/LatestBlocks'
import LatestTransactions from '@/components/LatestTransactions'
import Features from '@/components/Features'
import Tokenomics from '@/components/Tokenomics'
import Roadmap from '@/components/Roadmap'
import Footer from '@/components/Footer'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <Header />
      <Hero />
      <NetworkStats />
      <LiveMetrics />
      
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LatestBlocks />
        <LatestTransactions />
      </div>

      <Features />
      <Tokenomics />
      <Roadmap />
      <Footer />
    </main>
  )
}
