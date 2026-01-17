'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function Tokenomics() {
  const allocationData = [
    { name: 'Public Presale', value: 20, color: '#0ea5e9' },
    { name: 'Ecosystem & Grants', value: 25, color: '#a855f7' },
    { name: 'Validator Rewards', value: 20, color: '#10b981' },
    { name: 'Team (4yr vesting)', value: 15, color: '#f59e0b' },
    { name: 'Treasury', value: 20, color: '#6366f1' }
  ]

  const tokenUtilities = [
    { title: 'Gas Fees', description: 'Pay for transaction execution and smart contract deployment' },
    { title: 'Staking', description: 'Stake VNC to become a validator or delegate to earn rewards' },
    { title: 'Governance', description: 'Vote on protocol upgrades and parameter changes' },
    { title: 'Network Security', description: 'Validator collateral ensures network integrity' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            VNC Token Economics
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Designed for long-term sustainability and fair distribution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Token Allocation Chart */}
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Token Allocation
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Token Info */}
          <div>
            <div className="card mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Token Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Token Name</span>
                  <span className="font-semibold text-gray-900 dark:text-white">VNC Token</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Token Symbol</span>
                  <span className="font-semibold text-gray-900 dark:text-white">VNC</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total Supply</span>
                  <span className="font-semibold text-gray-900 dark:text-white">10,000,000,000 VNC</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Initial Circulating</span>
                  <span className="font-semibold text-gray-900 dark:text-white">30% (3B VNC)</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 dark:text-gray-400">Token Standard</span>
                  <span className="font-semibold text-gray-900 dark:text-white">VNC-20 (Native)</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Token Utility
              </h3>
              <div className="space-y-3">
                {tokenUtilities.map((utility, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{utility.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{utility.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
