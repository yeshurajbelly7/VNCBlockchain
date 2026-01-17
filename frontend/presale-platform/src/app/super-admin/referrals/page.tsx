'use client';

import React, { useState } from 'react';
import {
  Award,
  Users,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Settings,
  BarChart3,
  Eye,
  Ban,
  Gift,
  Target,
  Calendar,
  Activity,
} from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  activeReferrers: number;
  totalRewards: number;
  pendingRewards: number;
  qualifiedPurchases: number;
  averageReward: number;
  conversionRate: number;
}

interface ReferralUser {
  id: string;
  userId: string;
  userName: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  qualifiedReferrals: number;
  totalEarned: number;
  pendingRewards: number;
  claimedRewards: number;
  joinedDate: string;
  lastActivity: string;
  status: 'active' | 'suspended' | 'banned';
  suspiciousActivity: boolean;
}

interface ReferralTransaction {
  id: string;
  referrerId: string;
  referrerName: string;
  referredUserId: string;
  referredUserName: string;
  purchaseAmount: number;
  rewardAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  timestamp: string;
  kycVerified: boolean;
}

export default function ReferralManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'referrers' | 'transactions' | 'config'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');

  // Referral System Stats
  const stats: ReferralStats = {
    totalReferrals: 125000,
    activeReferrers: 18500,
    totalRewards: 25000000, // 25M VNC from 150M pool
    pendingRewards: 2500000,
    qualifiedPurchases: 125000,
    averageReward: 200,
    conversionRate: 78.5,
  };

  // Top Referrers
  const topReferrers: ReferralUser[] = [
    {
      id: '1',
      userId: 'USR001',
      userName: 'CryptoWhale_2024',
      email: 'whale@example.com',
      referralCode: 'WHALE2024',
      totalReferrals: 2500,
      qualifiedReferrals: 2350,
      totalEarned: 470000,
      pendingRewards: 15000,
      claimedRewards: 455000,
      joinedDate: '2025-01-05',
      lastActivity: '2025-01-16',
      status: 'active',
      suspiciousActivity: false,
    },
    {
      id: '2',
      userId: 'USR002',
      userName: 'BlockchainGuru',
      email: 'guru@example.com',
      referralCode: 'GURU2025',
      totalReferrals: 1850,
      qualifiedReferrals: 1720,
      totalEarned: 344000,
      pendingRewards: 8000,
      claimedRewards: 336000,
      joinedDate: '2025-01-08',
      lastActivity: '2025-01-16',
      status: 'active',
      suspiciousActivity: false,
    },
    {
      id: '3',
      userId: 'USR003',
      userName: 'VNC_Ambassador',
      email: 'ambassador@example.com',
      referralCode: 'VNCAMB',
      totalReferrals: 1500,
      qualifiedReferrals: 1425,
      totalEarned: 285000,
      pendingRewards: 6000,
      claimedRewards: 279000,
      joinedDate: '2025-01-10',
      lastActivity: '2025-01-16',
      status: 'active',
      suspiciousActivity: false,
    },
    {
      id: '4',
      userId: 'USR004',
      userName: 'SuspiciousUser',
      email: 'suspect@example.com',
      referralCode: 'SUSP123',
      totalReferrals: 850,
      qualifiedReferrals: 120,
      totalEarned: 24000,
      pendingRewards: 12000,
      claimedRewards: 12000,
      joinedDate: '2025-01-12',
      lastActivity: '2025-01-15',
      status: 'suspended',
      suspiciousActivity: true,
    },
  ];

  // Recent Transactions
  const recentTransactions: ReferralTransaction[] = [
    {
      id: 'TXN001',
      referrerId: 'USR001',
      referrerName: 'CryptoWhale_2024',
      referredUserId: 'USR1001',
      referredUserName: 'NewUser_1001',
      purchaseAmount: 50000,
      rewardAmount: 200,
      status: 'paid',
      timestamp: '2025-01-16 14:30:00',
      kycVerified: true,
    },
    {
      id: 'TXN002',
      referrerId: 'USR002',
      referrerName: 'BlockchainGuru',
      referredUserId: 'USR1002',
      referredUserName: 'NewUser_1002',
      purchaseAmount: 25000,
      rewardAmount: 200,
      status: 'paid',
      timestamp: '2025-01-16 14:15:00',
      kycVerified: true,
    },
    {
      id: 'TXN003',
      referrerId: 'USR003',
      referrerName: 'VNC_Ambassador',
      referredUserId: 'USR1003',
      referredUserName: 'NewUser_1003',
      purchaseAmount: 15000,
      rewardAmount: 200,
      status: 'approved',
      timestamp: '2025-01-16 14:00:00',
      kycVerified: true,
    },
    {
      id: 'TXN004',
      referrerId: 'USR004',
      referrerName: 'SuspiciousUser',
      referredUserId: 'USR1004',
      referredUserName: 'FakeUser_1004',
      purchaseAmount: 10000,
      rewardAmount: 200,
      status: 'rejected',
      timestamp: '2025-01-16 13:45:00',
      kycVerified: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'suspended':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'banned':
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Award className="w-10 h-10 text-purple-400" />
            Referral System Management
          </h1>
          <p className="text-gray-400">200 VNC Reward per Qualified Referral (10k+ VNC Purchase)</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total Referrals</div>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalReferrals.toLocaleString()}
            </div>
            <div className="text-xs text-green-400">↑ {stats.qualifiedPurchases.toLocaleString()} qualified</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total Rewards Paid</div>
              <Gift className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {(stats.totalRewards / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500">VNC Tokens</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Pending Rewards</div>
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {(stats.pendingRewards / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500">Awaiting approval</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Active Referrers</div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {stats.activeReferrers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">{stats.conversionRate}% conversion</div>
          </div>
        </div>

        {/* Referral Pool Status */}
        <div className="bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Referral Reward Pool Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">Total Pool</div>
              <div className="text-2xl font-bold text-white">150,000,000 VNC</div>
              <div className="text-xs text-gray-500 mt-1">From 500M airdrop allocation</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Distributed</div>
              <div className="text-2xl font-bold text-green-400">
                {(stats.totalRewards / 1000000).toFixed(1)}M VNC
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((stats.totalRewards / 150000000) * 100).toFixed(1)}% of pool
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Remaining</div>
              <div className="text-2xl font-bold text-blue-400">
                {((150000000 - stats.totalRewards) / 1000000).toFixed(1)}M VNC
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(((150000000 - stats.totalRewards) / 150000000) * 100).toFixed(1)}% remaining
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3"
                style={{ width: `${(stats.totalRewards / 150000000) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'referrers', label: 'Top Referrers', icon: Users },
            { id: 'transactions', label: 'Transactions', icon: Activity },
            { id: 'config', label: 'Configuration', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Referral System Rules
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Reward Amount:</strong> 200 VNC per qualified referral
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Minimum Purchase:</strong> New user must buy ≥ 10,000 VNC
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">KYC Requirement:</strong> Both referrer and referred user must complete KYC
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Vesting:</strong> 50% instant unlock, 50% vested over 3 months
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Fraud Prevention:</strong> Self-referrals blocked via wallet & device tracking
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Anti-Fraud Measures Active</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Automatic device fingerprinting and IP tracking</li>
                    <li>• Machine learning fraud detection algorithms</li>
                    <li>• Manual review for suspicious patterns (low conversion, same devices)</li>
                    <li>• Instant suspension for confirmed fraud attempts</li>
                    <li>• All actions logged on blockchain for audit trail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Referrers Tab */}
        {activeTab === 'referrers' && (
          <div>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search referrers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <button className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white hover:border-purple-500 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {/* Referrers List */}
            <div className="space-y-4">
              {topReferrers.map((referrer, index) => (
                <div
                  key={referrer.id}
                  className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{referrer.userName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(referrer.status)}`}>
                            {referrer.status}
                          </span>
                          {referrer.suspiciousActivity && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Suspicious
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mb-3">
                          Code: <span className="text-purple-400 font-mono">{referrer.referralCode}</span> • {referrer.email}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Total Referrals</div>
                            <div className="text-lg font-semibold text-white">{referrer.totalReferrals.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Qualified</div>
                            <div className="text-lg font-semibold text-green-400">{referrer.qualifiedReferrals.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Total Earned</div>
                            <div className="text-lg font-semibold text-purple-400">{referrer.totalEarned.toLocaleString()} VNC</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Conversion Rate</div>
                            <div className="text-lg font-semibold text-blue-400">
                              {((referrer.qualifiedReferrals / referrer.totalReferrals) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Joined: {referrer.joinedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            Last: {referrer.lastActivity}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      {referrer.status === 'active' && referrer.suspiciousActivity && (
                        <button className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Review
                        </button>
                      )}
                      {referrer.status === 'active' && (
                        <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2">
                          <Ban className="w-4 h-4" />
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Referrer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Referred User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Purchase</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reward</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-purple-400">{txn.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{txn.referrerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{txn.referredUserName}</div>
                        {txn.kycVerified && (
                          <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            KYC Verified
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-white">{txn.purchaseAmount.toLocaleString()} VNC</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-purple-400">{txn.rewardAmount} VNC</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(txn.status)}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-400">{txn.timestamp}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Referral System Configuration</h3>
            <p className="text-gray-400 mb-6">Adjust referral rules and reward parameters (affects future referrals only).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Reward Amount (VNC)</label>
                <input
                  type="number"
                  defaultValue={200}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Minimum Purchase (VNC)</label>
                <input
                  type="number"
                  defaultValue={10000}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Save Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
