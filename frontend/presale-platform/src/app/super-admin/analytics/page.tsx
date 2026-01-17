'use client';

import React, { useState } from 'react';
import { 
   Users, DollarSign, Activity, 
  Eye, CreditCard, Target, BarChart3,
  ArrowUpRight,
  Download, RefreshCw, Globe, Smartphone, Monitor,
  Clock, AlertCircle, CheckCircle, XCircle, Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const analytics = {
    overview: {
      totalRevenue: 12500000,
      totalUsers: 15234,
      totalTransactions: 45678,
      activeUsers: 8456,
      conversionRate: 34.5,
      averageOrderValue: 7850,
      bounceRate: 23.4,
      sessionDuration: 425
    },
    revenue: {
      today: 145000,
      yesterday: 132000,
      thisWeek: 890000,
      lastWeek: 756000,
      thisMonth: 3200000,
      lastMonth: 2800000,
      growth: 14.3
    },
    users: {
      newUsers: 234,
      returningUsers: 456,
      activeNow: 89,
      byCountry: [
        { country: 'India', users: 8500, percentage: 55.8 },
        { country: 'USA', users: 2300, percentage: 15.1 },
        { country: 'UK', users: 1200, percentage: 7.9 },
        { country: 'Canada', users: 890, percentage: 5.8 },
        { country: 'Others', users: 2344, percentage: 15.4 }
      ]
    },
    transactions: {
      successful: 43210,
      failed: 1234,
      pending: 234,
      refunded: 500,
      totalVolume: 12500000,
      byMethod: [
        { method: 'UPI', count: 25000, volume: 6250000, percentage: 54.7 },
        { method: 'Credit Card', count: 12000, volume: 3600000, percentage: 26.3 },
        { method: 'Debit Card', count: 5678, volume: 1703400, percentage: 12.4 },
        { method: 'Net Banking', count: 3000, volume: 946600, percentage: 6.6 }
      ]
    },
    traffic: {
      totalPageViews: 125000,
      uniqueVisitors: 45000,
      byDevice: [
        { device: 'Mobile', users: 28000, percentage: 62.2 },
        { device: 'Desktop', users: 14500, percentage: 32.2 },
        { device: 'Tablet', users: 2500, percentage: 5.6 }
      ],
      topPages: [
        { page: '/presale', views: 45000, avgTime: '3:24' },
        { page: '/wallet', views: 32000, avgTime: '2:15' },
        { page: '/explorer', views: 28000, avgTime: '4:45' },
        { page: '/home', views: 20000, avgTime: '1:30' }
      ]
    },
    blockchain: {
      totalBlocks: 1250000,
      totalValidators: 21,
      networkTPS: 2500,
      avgBlockTime: 3.2,
      totalTransactions: 5234567,
      activeWallets: 15234,
      tokenCirculation: 50000000,
      stakingRate: 45.6
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            Advanced Analytics Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Real-time platform insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-green-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              +{analytics.revenue.growth}%
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            ${(analytics.overview.totalRevenue / 1000000).toFixed(2)}M
          </div>
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-xs text-gray-500 mt-1">vs last period</div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-blue-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            {analytics.overview.activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Active Users</div>
          <div className="text-xs text-gray-500 mt-1">{analytics.users.activeNow} online now</div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              +8.3%
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            {analytics.overview.totalTransactions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Transactions</div>
          <div className="text-xs text-gray-500 mt-1">{analytics.transactions.pending} pending</div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-orange-500/20">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              +2.1%
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">
            {analytics.overview.conversionRate}%
          </div>
          <div className="text-sm text-gray-400">Conversion Rate</div>
          <div className="text-xs text-gray-500 mt-1">improved</div>
        </div>
      </div>

      {/* Revenue & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              Revenue Breakdown
            </h2>
            <span className="text-green-400 text-sm font-semibold bg-green-500/20 px-3 py-1 rounded-full">
              +{analytics.revenue.growth}%
            </span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Today', value: analytics.revenue.today, highlight: true },
              { label: 'Yesterday', value: analytics.revenue.yesterday },
              { label: 'This Week', value: analytics.revenue.thisWeek },
              { label: 'Last Week', value: analytics.revenue.lastWeek },
              { label: 'This Month', value: analytics.revenue.thisMonth },
              { label: 'Last Month', value: analytics.revenue.lastMonth }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${item.highlight ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-900'}`}>
                <span className={`text-sm ${item.highlight ? 'text-white font-semibold' : 'text-gray-400'}`}>{item.label}</span>
                <span className={`font-bold ${item.highlight ? 'text-green-400 text-lg' : 'text-white'}`}>
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              User Analytics
            </h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">New Users</div>
                <div className="text-2xl font-bold text-white">{analytics.users.newUsers}</div>
                <div className="text-green-400 text-xs mt-1">+15.3%</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Returning</div>
                <div className="text-2xl font-bold text-white">{analytics.users.returningUsers}</div>
                <div className="text-blue-400 text-xs mt-1">+8.7%</div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Users by Country</span>
              </div>
              <div className="space-y-3">
                {analytics.users.byCountry.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{item.country}</span>
                      <span className="text-gray-400">{item.users.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Analytics */}
      <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Transaction Analytics
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Total Volume:</span>
            <span className="text-xl font-bold text-white">${(analytics.transactions.totalVolume / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-xs font-semibold">94.6%</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.transactions.successful.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Successful</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">2.7%</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.transactions.failed.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Failed</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-xs font-semibold">0.5%</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.transactions.pending.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 text-xs font-semibold">1.1%</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.transactions.refunded.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Refunded</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods Distribution</h3>
          <div className="space-y-3">
            {analytics.transactions.byMethod.map((method, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">{method.method}</span>
                  <div className="text-right">
                    <span className="text-white">{method.count.toLocaleString()} txns</span>
                    <span className="text-gray-400 ml-3">${(method.volume / 1000000).toFixed(2)}M</span>
                    <span className="text-purple-400 ml-2">({method.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic & Blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-orange-500/20">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Globe className="w-6 h-6 text-orange-400" />
            Traffic Analytics
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-xl p-4">
                <Eye className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.traffic.totalPageViews.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Page Views</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <Users className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.traffic.uniqueVisitors.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Unique Visitors</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Device Distribution</h3>
              <div className="space-y-3">
                {analytics.traffic.byDevice.map((device, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.device === 'Mobile' && <Smartphone className="w-4 h-4 text-orange-400" />}
                      {device.device === 'Desktop' && <Monitor className="w-4 h-4 text-blue-400" />}
                      {device.device === 'Tablet' && <Monitor className="w-4 h-4 text-purple-400" />}
                      <span className="text-white text-sm">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">{device.users.toLocaleString()}</span>
                      <span className="text-orange-400 text-sm font-semibold">{device.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Top Pages</h3>
              <div className="space-y-2">
                {analytics.traffic.topPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                    <span className="text-white text-sm font-mono">{page.page}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{page.views.toLocaleString()} views</span>
                      <span className="text-orange-400 text-sm">{page.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-cyan-500/20">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-cyan-400" />
            Blockchain Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Total Blocks</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.totalBlocks.toLocaleString()}</div>
              <div className="text-cyan-400 text-xs mt-1">+0.8% today</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Active Validators</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.totalValidators}</div>
              <div className="text-green-400 text-xs mt-1">100% uptime</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Network TPS</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.networkTPS.toLocaleString()}</div>
              <div className="text-cyan-400 text-xs mt-1">Peak: 3,200</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Avg Block Time</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.avgBlockTime}s</div>
              <div className="text-green-400 text-xs mt-1">Optimal</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Total Transactions</div>
              <div className="text-xl font-bold text-white">{(analytics.blockchain.totalTransactions / 1000000).toFixed(2)}M</div>
              <div className="text-cyan-400 text-xs mt-1">+12.3% this week</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Active Wallets</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.activeWallets.toLocaleString()}</div>
              <div className="text-green-400 text-xs mt-1">+456 today</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Token Circulation</div>
              <div className="text-xl font-bold text-white">{(analytics.blockchain.tokenCirculation / 1000000).toFixed(0)}M</div>
              <div className="text-cyan-400 text-xs mt-1">VNC Tokens</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Staking Rate</div>
              <div className="text-xl font-bold text-white">{analytics.blockchain.stakingRate}%</div>
              <div className="text-purple-400 text-xs mt-1">Healthy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Health Summary */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-6 border border-purple-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Platform Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">94.6%</div>
            <div className="text-gray-300 text-sm mt-1">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">${analytics.overview.averageOrderValue.toLocaleString()}</div>
            <div className="text-gray-300 text-sm mt-1">Avg Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{Math.floor(analytics.overview.sessionDuration / 60)}:{(analytics.overview.sessionDuration % 60).toString().padStart(2, '0')}</div>
            <div className="text-gray-300 text-sm mt-1">Avg Session</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{analytics.overview.bounceRate}%</div>
            <div className="text-gray-300 text-sm mt-1">Bounce Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
