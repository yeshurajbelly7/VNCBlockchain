'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Zap, Clock } from 'lucide-react'

export default function LiveMetrics() {
  const [tpsData, setTpsData] = useState([
    { time: '00:00', tps: 45000 },
    { time: '00:05', tps: 52000 },
    { time: '00:10', tps: 48000 },
    { time: '00:15', tps: 61000 },
    { time: '00:20', tps: 58000 },
    { time: '00:25', tps: 67000 },
    { time: '00:30', tps: 72000 },
  ])

  const [currentTPS, setCurrentTPS] = useState(72453)
  const [currentGas, setCurrentGas] = useState(0.00012)
  const [blockTime, setBlockTime] = useState(2.3)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTPS(prev => Math.floor(prev + (Math.random() - 0.5) * 5000))
      setCurrentGas(prev => Math.max(0.00001, prev + (Math.random() - 0.5) * 0.00005))
      setBlockTime(prev => Math.max(1.5, Math.min(3.0, prev + (Math.random() - 0.5) * 0.2)))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Live Network Metrics
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real-time performance data from the VNC-20 blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current TPS */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current TPS
              </h3>
              <Zap className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">
              {currentTPS.toLocaleString()}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from average
            </p>
          </div>

          {/* Gas Price */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gas Price
              </h3>
              <Zap className="w-5 h-5 text-quantum-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${currentGas.toFixed(5)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ultra-low transaction fees
            </p>
          </div>

          {/* Block Time */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Block Time
              </h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {blockTime.toFixed(1)}s
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sub-second finality
            </p>
          </div>
        </div>

        {/* TPS Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Transactions Per Second (Last 30 Minutes)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tpsData}>
              <defs>
                <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="tps" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorTps)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
