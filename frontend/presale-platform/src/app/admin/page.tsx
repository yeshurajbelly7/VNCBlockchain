'use client';

import { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, Settings, 
  Activity, CheckCircle, XCircle, Clock, Search,
  BarChart3, Shield, Download
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'presale' | 'users' | 'payments' | 'tokens'>('overview');

  const adminData = {
    stats: {
      totalUsers: '2,847',
      totalSales: 'â‚¹1.2Cr',
      activePresale: 'Stage 2',
      pendingKYC: '47',
    },
    presaleStages: [
      { stage: 1, price: 'â‚¹0.50', supply: '15B', sold: '15B', status: 'completed', revenue: 'â‚¹75Cr' },
      { stage: 2, price: 'â‚¹0.60', supply: '10B', sold: '4.5B', status: 'active', revenue: 'â‚¹27Cr' },
      { stage: 3, price: 'â‚¹0.70', supply: '10B', sold: '0', status: 'upcoming', revenue: 'â‚¹0' },
    ],
    recentUsers: [
      { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', joined: '2 hours ago', kyc: 'pending', invested: 'â‚¹50,000' },
      { id: 2, name: 'Priya Patel', email: 'priya@example.com', joined: '5 hours ago', kyc: 'verified', invested: 'â‚¹1,25,000' },
      { id: 3, name: 'Amit Kumar', email: 'amit@example.com', joined: '1 day ago', kyc: 'verified', invested: 'â‚¹75,000' },
      { id: 4, name: 'Neha Singh', email: 'neha@example.com', joined: '2 days ago', kyc: 'rejected', invested: 'â‚¹0' },
    ],
    recentPayments: [
      { id: 'TXN001', user: 'Rahul Sharma', amount: 'â‚¹50,000', method: 'Razorpay', status: 'completed', time: '2 hours ago' },
      { id: 'TXN002', user: 'Priya Patel', amount: 'â‚¹1,25,000', method: 'USDT', status: 'completed', time: '5 hours ago' },
      { id: 'TXN003', user: 'Vikram Das', amount: 'â‚¹25,000', method: 'PhonePe', status: 'pending', time: '1 day ago' },
      { id: 'TXN004', user: 'Sneha Reddy', amount: 'â‚¹2,00,000', method: 'Cashfree', status: 'failed', time: '2 days ago' },
    ],
    tokenDistribution: [
      { user: 'Priya Patel', tokens: '2,50,000 VNC', schedule: '30-35-35', status: 'active', claimed: '75,000 VNC' },
      { user: 'Amit Kumar', tokens: '1,50,000 VNC', schedule: '30-35-35', status: 'active', claimed: '45,000 VNC' },
      { user: 'Rahul Sharma', tokens: '1,00,000 VNC', schedule: '30-35-35', status: 'pending', claimed: '0 VNC' },
    ],
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage presale, users, and platform operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="px-4 py-2 bg-card-bg border border-border-color hover:border-primary rounded-xl transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-card-bg border border-border-color hover:border-primary rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border-2 border-primary/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">+12%</span>
            </div>
            <div className="text-3xl font-bold mb-2">{adminData.stats.totalUsers}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-quantum" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">+28%</span>
            </div>
            <div className="text-3xl font-bold mb-2">{adminData.stats.totalSales}</div>
            <div className="text-sm text-gray-400">Total Sales</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-primary" />
              <span className="text-xs bg-quantum/20 text-quantum px-2 py-1 rounded-full font-semibold">Live</span>
            </div>
            <div className="text-3xl font-bold mb-2">{adminData.stats.activePresale}</div>
            <div className="text-sm text-gray-400">Active Stage</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-quantum" />
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-semibold">Action</span>
            </div>
            <div className="text-3xl font-bold mb-2">{adminData.stats.pendingKYC}</div>
            <div className="text-sm text-gray-400">Pending KYC</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border-color overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'presale', label: 'Presale', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'payments', label: 'Payments', icon: DollarSign },
            { id: 'tokens', label: 'Tokens', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'presale' | 'users' | 'payments' | 'tokens')}
                className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 inline-block mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sales Chart Placeholder */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Sales Overview (Last 30 Days)</h3>
              <div className="h-64 bg-gradient-to-t from-primary/20 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold gradient-text mb-2">â‚¹1.2Cr</div>
                  <div className="text-gray-400">Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-primary/10 border border-primary/30 hover:border-primary rounded-xl font-semibold transition-colors text-left flex items-center justify-between">
                  <span>Pause Presale</span>
                  <Activity className="w-5 h-5 text-primary" />
                </button>
                <button className="w-full px-6 py-4 bg-quantum/10 border border-quantum/30 hover:border-quantum rounded-xl font-semibold transition-colors text-left flex items-center justify-between">
                  <span>Start Next Stage</span>
                  <TrendingUp className="w-5 h-5 text-quantum" />
                </button>
                <button className="w-full px-6 py-4 bg-primary/10 border border-primary/30 hover:border-primary rounded-xl font-semibold transition-colors text-left flex items-center justify-between">
                  <span>Export Users Data</span>
                  <Download className="w-5 h-5 text-primary" />
                </button>
                <button className="w-full px-6 py-4 bg-quantum/10 border border-quantum/30 hover:border-quantum rounded-xl font-semibold transition-colors text-left flex items-center justify-between">
                  <span>Distribution Report</span>
                  <BarChart3 className="w-5 h-5 text-quantum" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presale' && (
          <div className="space-y-8">
            {/* Presale Stages */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Presale Stages</h3>
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-semibold">
                  Add New Stage
                </button>
              </div>
              
              <div className="space-y-4">
                {adminData.presaleStages.map((stage) => (
                  <div
                    key={stage.stage}
                    className="p-6 bg-primary/5 border border-primary/20 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold">Stage {stage.stage}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            stage.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            stage.status === 'active' ? 'bg-quantum/20 text-quantum' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {stage.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Price: <span className="text-white font-semibold">{stage.price}</span> per VNC
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text mb-1">{stage.revenue}</div>
                        <div className="text-sm text-gray-400">Revenue</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-semibold">{stage.sold} / {stage.supply} VNC</span>
                      </div>
                      <div className="h-3 bg-bg-darker rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-quantum transition-all"
                          style={{ width: `${(parseFloat(stage.sold) / parseFloat(stage.supply)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {stage.status === 'active' && (
                      <div className="flex gap-3 mt-4">
                        <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg font-semibold transition-colors">
                          Pause Stage
                        </button>
                        <button className="px-4 py-2 border border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                          Edit Price
                        </button>
                        <button className="px-4 py-2 border border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                          Settings
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Search & Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or wallet address..."
                  className="w-full pl-12 pr-4 py-3 bg-card-bg border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                />
              </div>
              <select className="px-4 py-3 bg-card-bg border border-border-color rounded-xl text-white focus:border-primary focus:outline-none">
                <option>All Users</option>
                <option>KYC Verified</option>
                <option>KYC Pending</option>
                <option>KYC Rejected</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/10 border-b border-border-color">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">KYC Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Invested</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border-color hover:bg-primary/5">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-400">ID: {user.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                        <td className="px-6 py-4 text-sm">{user.joined}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.kyc === 'verified' ? 'bg-green-500/20 text-green-400' :
                            user.kyc === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {user.kyc.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{user.invested}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded font-semibold">
                              View
                            </button>
                            <button className="px-3 py-1 text-xs bg-quantum/20 text-quantum hover:bg-quantum/30 rounded font-semibold">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Payment Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">INR Payments</div>
                <div className="text-3xl font-bold mb-2">â‚¹1.05Cr</div>
                <div className="text-sm text-green-400">87% of total</div>
              </div>
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Crypto Payments</div>
                <div className="text-3xl font-bold mb-2">â‚¹15L</div>
                <div className="text-sm text-green-400">13% of total</div>
              </div>
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Pending</div>
                <div className="text-3xl font-bold mb-2">â‚¹2.5L</div>
                <div className="text-sm text-yellow-400">3 transactions</div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/10 border-b border-border-color">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.recentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border-color hover:bg-primary/5">
                        <td className="px-6 py-4 font-mono text-sm">{payment.id}</td>
                        <td className="px-6 py-4">{payment.user}</td>
                        <td className="px-6 py-4 font-semibold">{payment.amount}</td>
                        <td className="px-6 py-4 text-sm">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {payment.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                             payment.status === 'pending' ? <Clock className="w-3 h-3" /> :
                             <XCircle className="w-3 h-3" />}
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{payment.time}</td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1 text-xs bg-primary/20 text-primary hover:bg-primary/30 rounded font-semibold">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-8">
            {/* Token Distribution Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Total Distributed</div>
                <div className="text-3xl font-bold mb-2">5.5B VNC</div>
                <div className="text-sm text-green-400">45.8% of presale</div>
              </div>
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Tokens Claimed</div>
                <div className="text-3xl font-bold mb-2">1.65B VNC</div>
                <div className="text-sm text-green-400">30% vesting</div>
              </div>
              <div className="bg-card-bg border border-border-color rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Pending Claims</div>
                <div className="text-3xl font-bold mb-2">3.85B VNC</div>
                <div className="text-sm text-yellow-400">70% locked</div>
              </div>
            </div>

            {/* Distribution Table */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Token Distribution</h3>
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-semibold">
                  Manual Allocation
                </button>
              </div>
              
              <div className="space-y-4">
                {adminData.tokenDistribution.map((dist, index) => (
                  <div
                    key={index}
                    className="p-6 bg-primary/5 border border-primary/20 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold mb-1">{dist.user}</div>
                        <div className="text-sm text-gray-400">
                          Total: <span className="text-white font-semibold">{dist.tokens}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        dist.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {dist.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-card-bg p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Vesting Schedule</div>
                        <div className="font-semibold">{dist.schedule}</div>
                      </div>
                      <div className="bg-card-bg p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Claimed</div>
                        <div className="font-semibold text-green-400">{dist.claimed}</div>
                      </div>
                      <div className="bg-card-bg p-3 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Remaining</div>
                        <div className="font-semibold text-yellow-400">
                          {(parseFloat(dist.tokens) - parseFloat(dist.claimed)).toLocaleString()} VNC
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg font-semibold transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                        Adjust Vesting
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
