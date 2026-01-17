'use client';

import React, { useState } from 'react';
import { Wallet, DollarSign, Search, Filter, Download, Eye, Lock, Unlock, RefreshCw, Bitcoin, Coins, CheckCircle, TrendingUp, Plus, Minus, History, Mail, Phone } from 'lucide-react';

export default function WalletsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');

  const wallets = [
    { id: 1, name: 'Yeshuraj Belly', email: 'yeshurajbelly7@gmail.com', phone: '+91 9876543210', status: 'active', inrBalance: 125500, cryptoBalances: { VNC: 10000, BTC: 0.5, ETH: 2.5, USDT: 5000 }, totalValueINR: 1850000 },
    { id: 2, name: 'John Doe', email: 'john.doe@example.com', phone: '+91 9876543211', status: 'active', inrBalance: 50000, cryptoBalances: { VNC: 5000, BTC: 0.2, ETH: 1.0 }, totalValueINR: 680000 },
    { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+91 9876543212', status: 'active', inrBalance: 75000, cryptoBalances: { VNC: 7500, ETH: 1.5 }, totalValueINR: 520000 },
    { id: 4, name: 'Mike Wilson', email: 'mike.wilson@example.com', phone: '+91 9876543213', status: 'suspended', inrBalance: 0, cryptoBalances: {}, totalValueINR: 0 },
  ];

  const stats = {
    totalINR: wallets.reduce((sum, w) => sum + w.inrBalance, 0),
    totalVNC: wallets.reduce((sum, w) => sum + (w.cryptoBalances.VNC || 0), 0),
    activeWallets: wallets.filter(w => w.status === 'active').length,
    totalWallets: wallets.length,
    inrOnlyWallets: wallets.filter(w => w.inrBalance > 0).length,
    cryptoOnlyWallets: wallets.filter(w => Object.keys(w.cryptoBalances).length > 0).length
  };

  const filteredWallets = wallets.filter(wallet => {
    const matchesSearch = wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) || wallet.email.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesViewMode = true;
    if (viewMode === 'inr') matchesViewMode = wallet.inrBalance > 0;
    else if (viewMode === 'crypto') matchesViewMode = Object.keys(wallet.cryptoBalances).length > 0;
    return matchesSearch && matchesViewMode;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Wallet className="w-8 h-8 text-green-400" />Wallet Management</h1>
          <p className="text-gray-400">Control INR & Crypto wallets</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3"><Filter className="w-5 h-5 text-purple-400" /><h3 className="text-lg font-semibold text-white">View Mode</h3></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setViewMode('all')} className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${viewMode === 'all' ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}><Wallet className="w-4 h-4" />All Wallets<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${viewMode === 'all' ? 'bg-white/20' : 'bg-gray-600'}`}>{stats.totalWallets}</span></button>
          <button onClick={() => setViewMode('inr')} className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${viewMode === 'inr' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}><DollarSign className="w-4 h-4" />INR Wallets<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${viewMode === 'inr' ? 'bg-white/20' : 'bg-gray-600'}`}>{stats.inrOnlyWallets}</span></button>
          <button onClick={() => setViewMode('crypto')} className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 ${viewMode === 'crypto' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}><Bitcoin className="w-4 h-4" />Crypto Wallets<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${viewMode === 'crypto' ? 'bg-white/20' : 'bg-gray-600'}`}>{stats.cryptoOnlyWallets}</span></button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20"><DollarSign className="w-8 h-8 text-green-400 mb-2" /><div className="text-2xl font-bold text-white">?{(stats.totalINR / 1000000).toFixed(2)}M</div><div className="text-sm text-gray-400">Total INR</div></div>
        <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/20"><Coins className="w-8 h-8 text-purple-400 mb-2" /><div className="text-2xl font-bold text-white">{(stats.totalVNC / 1000000).toFixed(2)}M</div><div className="text-sm text-gray-400">VNC Tokens</div></div>
        <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/20"><CheckCircle className="w-8 h-8 text-blue-400 mb-2" /><div className="text-2xl font-bold text-white">{stats.activeWallets}</div><div className="text-sm text-gray-400">Active</div></div>
        <div className="bg-gray-800 rounded-xl p-4 border border-orange-500/20"><TrendingUp className="w-8 h-8 text-orange-400 mb-2" /><div className="text-2xl font-bold text-white">{stats.totalWallets}</div><div className="text-sm text-gray-400">Total</div></div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/20">
        <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" /></div>
      </div>

      <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700"><div className="text-white">Showing <span className="font-bold">{filteredWallets.length}</span> {viewMode === 'all' ? 'Total' : viewMode === 'inr' ? 'INR' : 'Crypto'} Wallets</div></div>

      <div className="space-y-4">
        {filteredWallets.map((wallet) => (
          <div key={wallet.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">{wallet.name.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2"><h3 className="text-xl font-bold text-white">{wallet.name}</h3><span className={`px-3 py-1 rounded-full text-xs font-semibold ${wallet.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{wallet.status.toUpperCase()}</span></div>
                  <div className="flex gap-4 text-sm text-gray-400"><div className="flex items-center gap-2"><Mail className="w-4 h-4" />{wallet.email}</div><div className="flex items-center gap-2"><Phone className="w-4 h-4" />{wallet.phone}</div></div>
                </div>
              </div>
              <div className="text-right"><div className="text-2xl font-bold text-green-400">?{wallet.inrBalance.toLocaleString()}</div><div className="text-sm text-gray-400">INR Balance</div></div>
            </div>
            {Object.keys(wallet.cryptoBalances).length > 0 && (
              <div className="border-t border-gray-700 pt-4 mt-4"><div className="text-sm text-gray-400 mb-2">Crypto Holdings:</div><div className="grid grid-cols-4 gap-3">{Object.entries(wallet.cryptoBalances).map(([symbol, amount]) => (<div key={symbol} className="bg-gray-900 rounded-lg p-3"><div className="text-xs text-gray-400">{symbol}</div><div className="text-sm font-bold text-white">{(amount as number).toLocaleString()}</div></div>))}</div></div>
            )}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
              <button className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-semibold flex items-center gap-2 text-sm hover:bg-blue-500/30"><Eye className="w-4 h-4" />View</button>
              <button className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-semibold flex items-center gap-2 text-sm hover:bg-green-500/30"><Plus className="w-4 h-4" />Add</button>
              <button className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 font-semibold flex items-center gap-2 text-sm hover:bg-orange-500/30"><Minus className="w-4 h-4" />Deduct</button>
              {wallet.status === 'active' ? (<button className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold flex items-center gap-2 text-sm hover:bg-red-500/30"><Lock className="w-4 h-4" />Freeze</button>) : (<button className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-semibold flex items-center gap-2 text-sm hover:bg-green-500/30"><Unlock className="w-4 h-4" />Unfreeze</button>)}
              <button className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-semibold flex items-center gap-2 text-sm hover:bg-purple-500/30"><History className="w-4 h-4" />History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
