'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Layers, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-quantum-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center space-x-2 bg-quantum-100 dark:bg-quantum-900/30 text-quantum-700 dark:text-quantum-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>Quantum-Ready Security</span>
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            The Next-Generation{' '}
            <span className="gradient-text">Blockchain</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            High-performance, EVM-compatible blockchain with{' '}
            <strong className="text-primary-600 dark:text-primary-400">400,000+ TPS</strong>,{' '}
            <strong className="text-primary-600 dark:text-primary-400">sub-second finality</strong>, and{' '}
            <strong className="text-quantum-600 dark:text-quantum-400">post-quantum security</strong>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/docs/whitepaper"
              className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
            >
              <span>Read Whitepaper</span>
              <TrendingUp className="w-5 h-5" />
            </Link>
            <Link
              href="/testnet"
              className="btn-secondary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
            >
              <span>Try Testnet</span>
              <Zap className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Key features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">400K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">TPS</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-quantum-100 dark:bg-quantum-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-quantum-600 dark:text-quantum-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">&lt;1s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Finality</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">EVM Compatible</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-white dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  )
}
