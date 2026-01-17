'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Clock } from 'lucide-react'
import Link from 'next/link'

interface Block {
  number: number
  timestamp: string
  transactions: number
  validator: string
  hash: string
}

export default function LatestBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      number: 12845792,
      timestamp: '5 secs ago',
      transactions: 247,
      validator: 'Validator #42',
      hash: '0x7a8f9c2d...'
    },
    {
      number: 12845791,
      timestamp: '8 secs ago',
      transactions: 193,
      validator: 'Validator #17',
      hash: '0x3b5e6f1a...'
    },
    {
      number: 12845790,
      timestamp: '10 secs ago',
      transactions: 312,
      validator: 'Validator #89',
      hash: '0x9d2c4e7b...'
    },
    {
      number: 12845789,
      timestamp: '13 secs ago',
      transactions: 156,
      validator: 'Validator #33',
      hash: '0x4f8a2b9c...'
    },
    {
      number: 12845788,
      timestamp: '15 secs ago',
      transactions: 278,
      validator: 'Validator #65',
      hash: '0x1e6d3c8f...'
    }
  ])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Latest Blocks
        </h3>
        <Link 
          href="/explorer/blocks" 
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div 
            key={block.number}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">
                    {block.number.toString().slice(-2)}
                  </span>
                </div>
                <div>
                  <Link 
                    href={`/explorer/block/${block.number}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    Block #{block.number.toLocaleString()}
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {block.timestamp}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {block.transactions} txns
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {block.validator}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link 
          href="/explorer" 
          className="btn-secondary inline-flex items-center"
        >
          Open Block Explorer
          <ExternalLink className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  )
}
