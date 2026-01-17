'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Activity, Blocks, ArrowRight, Clock, Hash, User, TrendingUp } from 'lucide-react'

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const recentBlocks = [
    { height: 1234567, txCount: 145, validator: '0x1a2b...3c4d', time: '2 sec ago', size: '23.4 KB' },
    { height: 1234566, txCount: 198, validator: '0x5e6f...7g8h', time: '15 sec ago', size: '31.2 KB' },
    { height: 1234565, txCount: 167, validator: '0x9i0j...1k2l', time: '28 sec ago', size: '27.8 KB' },
  ]

  const recentTransactions = [
    { hash: '0xabc123...def456', from: '0x1a2b...3c4d', to: '0x5e6f...7g8h', value: '1,234.56', time: '5 sec ago' },
    { hash: '0x789ghi...012jkl', from: '0x9i0j...1k2l', to: '0x3m4n...5o6p', value: '567.89', time: '12 sec ago' },
    { hash: '0x345mno...678pqr', from: '0x7q8r...9s0t', to: '0x1u2v...3w4x', value: '890.12', time: '19 sec ago' },
  ]

  const stats = [
    { label: 'Total Transactions', value: '12,345,678', icon: Activity, change: '+2.5%' },
    { label: 'Total Blocks', value: '1,234,567', icon: Blocks, change: '+0.8%' },
    { label: 'Active Validators', value: '127', icon: User, change: '+3' },
    { label: 'Network TPS', value: '2,847', icon: TrendingUp, change: '+12%' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">VNC-20 Explorer</h1>
            <p className="text-xl text-primary-100">
              Explore blocks, transactions, and network activity in real-time
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Address / Txn Hash / Block / Token"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-transparent focus:border-quantum-400 outline-none transition-all"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="card-gradient p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Blocks */}
            <div className="card-gradient rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Blocks className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Blocks</h2>
                  </div>
                  <Link href="/explorer/blocks" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentBlocks.map((block) => (
                  <div key={block.height} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/explorer/block/${block.height}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                        #{block.height}
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {block.time}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Transactions:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{block.txCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Size:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{block.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-gradient rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-quantum-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                  </div>
                  <Link href="/explorer/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTransactions.map((tx) => (
                  <div key={tx.hash} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/explorer/tx/${tx.hash}`} className="text-primary-600 hover:text-primary-700 font-mono text-sm">
                        {tx.hash}
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tx.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">From:</span>
                        <span className="font-mono text-gray-900 dark:text-white">{tx.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-gray-900 dark:text-white">{tx.to}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{tx.value} VNC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
