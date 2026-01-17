'use client';

import { useState } from 'react';
import { TrendingUp, Activity, Box, Zap } from 'lucide-react';

export default function NetworkStats() {
  const [stats, _setStats] = useState({
    validators: 87,
    totalStaked: '2.4B',
    uptime: '99.98%',
    blockTime: '2.3s',
  });

  return (
    <section className="py-16 bg-card-bg/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Network <span className="gradient-text">Statistics</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-card-bg border border-border-color rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.validators}</div>
            <div className="text-gray-400 text-sm">Active Validators</div>
            <div className="text-green-400 text-xs mt-2">+3 today</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-quantum" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.totalStaked}</div>
            <div className="text-gray-400 text-sm">Total Staked</div>
            <div className="text-green-400 text-xs mt-2">24% of supply</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <Box className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.uptime}</div>
            <div className="text-gray-400 text-sm">Network Uptime</div>
            <div className="text-green-400 text-xs mt-2">365 days</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-quantum" />
            </div>
            <div className="text-3xl font-bold mb-2">{stats.blockTime}</div>
            <div className="text-gray-400 text-sm">Avg Block Time</div>
            <div className="text-green-400 text-xs mt-2">Sub-second finality</div>
          </div>
        </div>
      </div>
    </section>
  );
}


