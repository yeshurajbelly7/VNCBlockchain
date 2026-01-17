'use client';

import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Search, Filter, Download, RefreshCw, Eye, CheckCircle, Clock, XCircle, AlertTriangle, TrendingUp, Bitcoin, DollarSign, Calendar, Hash, User, ChevronDown, ExternalLink, Copy } from 'lucide-react';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, deposit, withdrawal, token-purchase, transfer
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending, failed
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d'); // 24h, 7d, 30d, 90d, all
  const [showFilters, setShowFilters] = useState(false);

  // Comprehensive transaction data
  const transactions = [
    {
      id: 'TXN-2026-001234',
      hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
      type: 'token-purchase',
      from: { name: 'Yeshuraj Belly', wallet: '0x8f3Cf7ad23Cd3CaDbD9735Af...' },
      to: { name: 'Presale Contract', wallet: '0x1234567890abcdef1234567890...' },
      amount: { value: 125500, currency: 'INR' },
      tokens: { value: 10000, symbol: 'VNC' },
      status: 'completed',
      timestamp: '2026-01-14 11:30:45',
      fee: 125.50,
      confirmations: 24,
      blockNumber: 15678923
    },
    {
      id: 'TXN-2026-001233',
      hash: '0x9a3d42Bc7735D0643236b4c955Ca6e8706c1fCd5',
      type: 'withdrawal',
      from: { name: 'John Doe', wallet: '0x9b4Af8cd34De4DcEfD0846Ca...' },
      to: { name: 'External Wallet', wallet: '0xabcdef1234567890abcdef12...' },
      amount: { value: 2.5, currency: 'ETH' },
      tokens: null,
      status: 'pending',
      timestamp: '2026-01-14 11:15:22',
      fee: 0.002,
      confirmations: 8,
      blockNumber: 15678899
    },
    {
      id: 'TXN-2026-001232',
      hash: '0x5e7b93Fc8846E1754347c2d966Db9f9817d2aCe6',
      type: 'deposit',
      from: { name: 'Jane Smith', wallet: '0x7c5Be9af45Ef5FgHi1234567...' },
      to: { name: 'Platform Wallet', wallet: '0x1111222233334444555566667...' },
      amount: { value: 75000, currency: 'INR' },
      tokens: null,
      status: 'completed',
      timestamp: '2026-01-14 10:45:18',
      fee: 75.00,
      confirmations: 42,
      blockNumber: 15678850
    },
    {
      id: 'TXN-2026-001231',
      hash: '0x3f9c84Ed9957F2865458d3e877Ec0a0928e3bDf7',
      type: 'transfer',
      from: { name: 'Mike Wilson', wallet: '0x6d4Cf7be56Gh7HiJk7890123...' },
      to: { name: 'Sarah Johnson', wallet: '0x8888999900001111222233334...' },
      amount: { value: 5000, currency: 'VNC' },
      tokens: null,
      status: 'completed',
      timestamp: '2026-01-14 09:22:35',
      fee: 50.00,
      confirmations: 68,
      blockNumber: 15678780
    },
    {
      id: 'TXN-2026-001230',
      hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      type: 'token-purchase',
      from: { name: 'Robert Chen', wallet: '0x2a3b4c5d6e7f8g9h0i1j2k3l...' },
      to: { name: 'Presale Contract', wallet: '0x1234567890abcdef1234567890...' },
      amount: { value: 50000, currency: 'INR' },
      tokens: { value: 4000, symbol: 'VNC' },
      status: 'failed',
      timestamp: '2026-01-14 08:10:50',
      fee: 0,
      confirmations: 0,
      blockNumber: null,
      failureReason: 'Insufficient gas fee'
    },
    {
      id: 'TXN-2026-001229',
      hash: '0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a',
      type: 'deposit',
      from: { name: 'Emily Davis', wallet: '0x5f6g7h8i9j0k1l2m3n4o5p6q...' },
      to: { name: 'Platform Wallet', wallet: '0x1111222233334444555566667...' },
      amount: { value: 0.5, currency: 'BTC' },
      tokens: null,
      status: 'completed',
      timestamp: '2026-01-13 22:35:12',
      fee: 0.0001,
      confirmations: 156,
      blockNumber: 15678456
    },
    {
      id: 'TXN-2026-001228',
      hash: '0x9c8b7a6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t',
      type: 'withdrawal',
      from: { name: 'David Kumar', wallet: '0x3g4h5i6j7k8l9m0n1o2p3q4r...' },
      to: { name: 'Bank Account', wallet: 'BANK-TRANSFER-XXXXXX1234' },
      amount: { value: 30000, currency: 'INR' },
      tokens: null,
      status: 'pending',
      timestamp: '2026-01-13 20:15:44',
      fee: 300.00,
      confirmations: null,
      blockNumber: null
    },
    {
      id: 'TXN-2026-001227',
      hash: '0x7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y',
      type: 'token-purchase',
      from: { name: 'Lisa Martinez', wallet: '0x4h5i6j7k8l9m0n1o2p3q4r5s...' },
      to: { name: 'Presale Contract', wallet: '0x1234567890abcdef1234567890...' },
      amount: { value: 200000, currency: 'INR' },
      tokens: { value: 16000, symbol: 'VNC' },
      status: 'completed',
      timestamp: '2026-01-13 18:45:28',
      fee: 200.00,
      confirmations: 245,
      blockNumber: 15678234
    }
  ];

  // Calculate comprehensive statistics
  const stats = {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === 'completed').length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    failedTransactions: transactions.filter(t => t.status === 'failed').length,
    totalReceived: transactions.filter(t => (t.type === 'deposit' || t.type === 'token-purchase') && t.status === 'completed').reduce((sum, t) => {
      if (t.amount.currency === 'INR') return sum + t.amount.value;
      return sum;
    }, 0),
    totalSent: transactions.filter(t => (t.type === 'withdrawal' || t.type === 'transfer') && t.status === 'completed').reduce((sum, t) => {
      if (t.amount.currency === 'INR') return sum + t.amount.value;
      return sum;
    }, 0),
    totalFees: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.fee, 0),
    tokensSold: transactions.filter(t => t.type === 'token-purchase' && t.status === 'completed').reduce((sum, t) => sum + (t.tokens?.value || 0), 0),
    todayTransactions: transactions.filter(t => t.timestamp.includes('2026-01-14')).length,
    averageTransactionValue: transactions.filter(t => t.amount.currency === 'INR' && t.status === 'completed').reduce((sum, t) => sum + t.amount.value, 0) / transactions.filter(t => t.amount.currency === 'INR' && t.status === 'completed').length
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Get type styling
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-500/20 text-green-400';
      case 'withdrawal':
        return 'bg-orange-500/20 text-orange-400';
      case 'token-purchase':
        return 'bg-purple-500/20 text-purple-400';
      case 'transfer':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-400" />
            Transaction Management
          </h1>
          <p className="text-gray-400 mt-1">Real-time blockchain & payment transaction monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Comprehensive Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-7 h-7 text-blue-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalTransactions.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Transactions</div>
          <div className="text-xs text-green-400 mt-1">+{stats.todayTransactions} today</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <ArrowUpRight className="w-7 h-7 text-green-400" />
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">${(stats.totalReceived / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-gray-400">Total Received</div>
          <div className="text-xs text-green-400 mt-1">{stats.completedTransactions} completed</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <ArrowDownRight className="w-7 h-7 text-orange-400" />
            <DollarSign className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">${(stats.totalSent / 1000000).toFixed(2)}M</div>
          <div className="text-xs text-gray-400">Total Sent</div>
          <div className="text-xs text-orange-400 mt-1">Avg: ${(stats.averageTransactionValue / 1000).toFixed(1)}K</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Bitcoin className="w-7 h-7 text-purple-400" />
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{(stats.tokensSold / 1000).toFixed(1)}K</div>
          <div className="text-xs text-gray-400">VNC Tokens Sold</div>
          <div className="text-xs text-purple-400 mt-1">${(stats.totalFees / 1000).toFixed(1)}K fees</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-7 h-7 text-yellow-400" />
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.pendingTransactions}</div>
          <div className="text-xs text-gray-400">Pending</div>
          <div className="text-xs text-red-400 mt-1">{stats.failedTransactions} failed</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-800 rounded-xl border border-purple-500/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Filters & Search</h3>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            {showFilters ? 'Hide' : 'Show'} Advanced
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by transaction ID, hash, user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'all'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('deposit')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'deposit'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'withdrawal'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setFilterType('token-purchase')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'token-purchase'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Token Purchases
            </button>
            <button
              onClick={() => setFilterType('transfer')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterType === 'transfer'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Transfers
            </button>
          </div>

          <div className="w-px bg-gray-700"></div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterStatus === 'all'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                filterStatus === 'completed'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                filterStatus === 'failed'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Failed
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Time Range</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount Range</label>
              <select className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                <option>All Amounts</option>
                <option>Under $10K</option>
                <option>$10K - $50K</option>
                <option>$50K - $100K</option>
                <option>Above $100K</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Currency</label>
              <select className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                <option>All Currencies</option>
                <option>INR</option>
                <option>BTC</option>
                <option>ETH</option>
                <option>USDT</option>
                <option>VNC</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700 flex items-center justify-between">
        <div className="text-white">
          Showing <span className="font-bold text-purple-400">{filteredTransactions.length}</span> of <span className="font-bold">{transactions.length}</span> transactions
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-gray-400">Sort by:</span>
          <button className="text-purple-400 hover:text-purple-300 font-semibold">Latest First</button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">From / To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm">{transaction.id}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs font-mono">{transaction.hash.substring(0, 12)}...</span>
                        <button
                          onClick={() => copyToClipboard(transaction.hash)}
                          className="text-gray-500 hover:text-purple-400 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeStyle(transaction.type)}`}>
                      {transaction.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-500" />
                        <span className="text-white text-sm">{transaction.from.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400 text-sm">{transaction.to.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">
                        {transaction.amount.currency === 'INR' && '$'}
                        {transaction.amount.value.toLocaleString()} {transaction.amount.currency !== 'INR' && transaction.amount.currency}
                      </span>
                      {transaction.tokens && (
                        <span className="text-purple-400 text-xs mt-1">
                          +{transaction.tokens.value.toLocaleString()} {transaction.tokens.symbol}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs mt-1">Fee: {transaction.amount.currency === 'INR' ? '$' : ''}{transaction.fee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 w-fit border ${getStatusStyle(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                      {transaction.confirmations !== null && transaction.confirmations > 0 && (
                        <span className="text-gray-500 text-xs">{transaction.confirmations} confirmations</span>
                      )}
                      {transaction.failureReason && (
                        <span className="text-red-400 text-xs">{transaction.failureReason}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {transaction.timestamp.split(' ')[0]}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{transaction.timestamp.split(' ')[1]}</div>
                      {transaction.blockNumber && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <Hash className="w-3 h-3" />
                          {transaction.blockNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-semibold text-xs hover:bg-purple-500/30 transition-colors flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Explore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-gray-800 rounded-lg px-6 py-4 border border-gray-700">
        <div className="text-sm text-gray-400">
          Showing 1-{filteredTransactions.length} of {transactions.length} transactions
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold text-sm">
            1
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors">
            3
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

