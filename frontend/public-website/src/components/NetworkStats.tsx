'use client'

import { useEffect, useState } from 'react'
import { Activity, Users, Coins, Clock } from 'lucide-react'

interface NetworkStat {
  label: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
}

export default function NetworkStats() {
  const [stats, setStats] = useState<NetworkStat[]>([
    {
      label: 'Active Validators',
      value: '87',
      change: '+3 today',
      icon: <Users className="w-6 h-6" />,
      color: 'primary'
    },
    {
      label: 'Total Staked',
      value: '2.4B VNC',
      change: '24% of supply',
      icon: <Coins className="w-6 h-6" />,
      color: 'quantum'
    },
    {
      label: 'Network Uptime',
      value: '99.98%',
      change: '365 days',
      icon: <Activity className="w-6 h-6" />,
      color: 'green'
    },
    {
      label: 'Avg Block Time',
      value: '2.3s',
      change: 'Sub-second finality',
      icon: <Clock className="w-6 h-6" />,
      color: 'blue'
    }
  ])

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                  <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
