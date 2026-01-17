'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet, Shield, Zap, Download, Smartphone, Chrome, Lock, ArrowRight } from 'lucide-react'

export default function WalletPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('extension')

  const wallets = [
    {
      id: 'extension',
      name: 'Browser Extension',
      icon: Chrome,
      description: 'Use VNC Wallet directly in your browser',
      features: ['One-click transactions', 'Hardware wallet support', 'Multi-account management'],
      link: '#',
      badge: 'Most Popular'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: Smartphone,
      description: 'Take your wallet anywhere with our mobile app',
      features: ['Biometric security', 'QR code scanning', 'Push notifications'],
      link: '#',
      badge: 'Coming Soon'
    },
    {
      id: 'desktop',
      name: 'Desktop App',
      icon: Download,
      description: 'Full-featured desktop application for power users',
      features: ['Advanced features', 'Local key storage', 'Offline signing'],
      link: '#',
      badge: null
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Quantum-Resistant Security',
      description: 'Your assets are protected with post-quantum cryptography'
    },
    {
      icon: Lock,
      title: 'Non-Custodial',
      description: 'You own your keys, you own your crypto. We never have access.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute transactions in milliseconds with minimal fees'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Wallet className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">VNC Wallet</h1>
            <p className="text-xl text-primary-100 mb-8">
              The secure, quantum-ready wallet for managing your VNC-20 assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <Download className="w-5 h-5 mr-2" />
                Download Wallet
              </button>
              <Link href="/docs/wallet" className="btn-secondary border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Options */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Wallet
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Access your VNC assets from any device, anywhere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`card-gradient rounded-xl p-8 cursor-pointer transition-all hover:scale-105 ${
                  selectedWallet === wallet.id ? 'ring-4 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedWallet(wallet.id)}
              >
                {wallet.badge && (
                  <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full mb-4">
                    {wallet.badge}
                  </div>
                )}
                <wallet.icon className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {wallet.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {wallet.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {wallet.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <ArrowRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary w-full">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Security & Speed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Industry-leading security meets lightning-fast performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-quantum-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Download VNC Wallet and start managing your assets securely
            </p>
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Download className="w-5 h-5 mr-2" />
              Download Now
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
