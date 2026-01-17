'use client';

import { useState, useEffect } from 'react';
import { Search, Box, ArrowRight } from 'lucide-react';

interface Block {
  number: number;
  txCount: number;
  timestamp: number;
  validator: string;
  hash: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: string;
}

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('blocks');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    blockHeight: 12845792,
    tps: 72453,
    avgBlockTime: 2.3,
    totalTransactions: '1.2B',
  });

  const generateHash = (length: number = 64) => {
    return '0x' + Array.from({ length }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  useEffect(() => {
    const generateBlocks = () => {
      const newBlocks: Block[] = [];
      for (let i = 0; i < 20; i++) {
        newBlocks.push({
          number: stats.blockHeight - i,
          txCount: Math.floor(150 + Math.random() * 200),
          timestamp: Date.now() - (i * 3000),
          validator: generateHash(8),
          hash: generateHash(64),
        });
      }
      setBlocks(newBlocks);
    };

    const generateTransactions = () => {
      const newTxs: Transaction[] = [];
      for (let i = 0; i < 20; i++) {
        newTxs.push({
          hash: generateHash(64),
          from: generateHash(40),
          to: generateHash(40),
          amount: (Math.random() * 10000).toFixed(4),
          timestamp: Date.now() - (i * 2000),
          status: Math.random() > 0.05 ? 'Success' : 'Pending',
        });
      }
      setTransactions(newTxs);
    };

    generateBlocks();
    generateTransactions();
    const interval = setInterval(() => {
      generateBlocks();
      generateTransactions();
      setStats(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + 1,
        tps: Math.floor(65000 + Math.random() * 15000),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [stats.blockHeight]);

  const formatTimestamp = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Blockchain Explorer</span>
          </h1>
          <p className="text-xl text-gray-400">
            Explore blocks, transactions, and network activity in real-time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Block Height</div>
            <div className="text-2xl font-bold gradient-text">
              {stats.blockHeight.toLocaleString()}
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Current TPS</div>
            <div className="text-2xl font-bold gradient-text">
              {stats.tps.toLocaleString()}
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Avg Block Time</div>
            <div className="text-2xl font-bold gradient-text">
              {stats.avgBlockTime}s
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Total Transactions</div>
            <div className="text-2xl font-bold gradient-text">
              {stats.totalTransactions}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address, transaction hash, or block number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card-bg border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border-color">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'blocks'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Box className="w-5 h-5 inline-block mr-2" />
            Latest Blocks
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'transactions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowRight className="w-5 h-5 inline-block mr-2" />
            Latest Transactions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            {blocks.map((block) => (
              <div
                key={block.number}
                className="bg-card-bg border border-border-color rounded-xl p-6 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Box className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-mono text-primary font-semibold">
                          Block #{block.number.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatTimestamp(block.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 font-mono ml-13">
                      Hash: {block.hash.slice(0, 20)}...{block.hash.slice(-10)}
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-sm text-gray-400">Transactions</div>
                      <div className="text-lg font-semibold">{block.txCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Validator</div>
                      <div className="text-lg font-mono font-semibold">
                        {block.validator}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="bg-card-bg border border-border-color rounded-xl p-6 hover:border-quantum/40 transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-quantum/10 rounded-lg flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-quantum" />
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-quantum font-semibold text-sm">
                          {tx.hash.slice(0, 20)}...{tx.hash.slice(-10)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatTimestamp(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 font-mono ml-13">
                      From: {tx.from.slice(0, 15)}...{tx.from.slice(-8)}
                    </div>
                    <div className="text-sm text-gray-400 font-mono ml-13">
                      To: {tx.to.slice(0, 15)}...{tx.to.slice(-8)}
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-sm text-gray-400">Amount</div>
                      <div className="text-lg font-semibold text-green-400">
                        {tx.amount} VNC
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <div className={`text-lg font-semibold ${
                        tx.status === 'Success' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
