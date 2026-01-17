'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
}

export default function LatestTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      hash: '0x8f2a9b7c3d5e1f6a...',
      from: '0x742d...89aB',
      to: '0x1e3c...45Df',
      amount: '125.50',
      timestamp: '3 secs ago',
      status: 'success'
    },
    {
      hash: '0x3c5e7d9f1a2b4c6e...',
      from: '0x9a8b...12cD',
      to: '0x4f6e...78Ef',
      amount: '2,450.00',
      timestamp: '7 secs ago',
      status: 'success'
    },
    {
      hash: '0x1d4f6a8c2e5b7d9f...',
      from: '0x5c7d...34Gh',
      to: '0x8a9b...56Ij',
      amount: '89.25',
      timestamp: '9 secs ago',
      status: 'success'
    },
    {
      hash: '0x7b9d1f3e5a6c8e2f...',
      from: '0x3e5f...78Kl',
      to: '0x6d8e...90Mn',
      amount: '1,850.75',
      timestamp: '12 secs ago',
      status: 'success'
    },
    {
      hash: '0x2e6a8c1d4f7b9e3a...',
      from: '0x1f3e...12Op',
      to: '0x9c8d...34Qr',
      amount: '345.00',
      timestamp: '14 secs ago',
      status: 'success'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400'
      case 'pending': return 'text-yellow-600 dark:text-yellow-400'
      case 'failed': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Latest Transactions
        </h3>
        <Link 
          href="/explorer/transactions" 
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-quantum-100 dark:bg-quantum-900/30 rounded">
                  <span className="text-quantum-600 dark:text-quantum-400 text-xs font-bold">
                    TX
                  </span>
                </div>
                <Link 
                  href={`/explorer/tx/${tx.hash}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-mono text-sm truncate"
                >
                  {tx.hash}
                </Link>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">From</span>
                <code className="text-gray-900 dark:text-white font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {tx.from}
                </code>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <code className="text-gray-900 dark:text-white font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {tx.to}
                </code>
              </div>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                {tx.timestamp}
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {tx.amount} VNC
              </div>
              <div className={`text-xs font-medium ${getStatusColor(tx.status)}`}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link 
          href="/explorer/transactions" 
          className="btn-secondary inline-flex items-center"
        >
          View All Transactions
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}
