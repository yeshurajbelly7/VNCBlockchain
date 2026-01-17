'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Server, Activity, TrendingUp, Award, AlertCircle, CheckCircle, DollarSign, Shield } from 'lucide-react';

export default function ValidatorDashboard() {
  const router = useRouter();
  const [nodeStatus, setNodeStatus] = useState('running');
  const [blocks, setBlocks] = useState(1250);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication and authorization
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Only validators, super-admins, and admins can access
    if (userRole !== 'validator' && userRole !== 'super-admin' && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setIsAuthorized(true);
  }, [router]);

  useEffect(() => {
    // Simulate block production
    if (!isAuthorized) return;
    
    const interval = setInterval(() => {
      if (nodeStatus === 'running') {
        setBlocks(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [nodeStatus, isAuthorized]);

  // Don&apos;t render until authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-xl font-semibold">Verifying Access...</div>
        </div>
      </div>
    );
  }

  const validatorData = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
    stake: 500000,
    commission: 5,
    delegators: 45,
    totalDelegated: 2500000,
    blocksProduced: blocks,
    blocksMissed: 5,
    rewards: 125430.50,
    uptime: 99.6,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ðŸ"· Validator Dashboard
            </h1>
            <p className="text-gray-400">Manage your validator node and monitor performance</p>
          </div>
          <div className={`px-6 py-3 rounded-lg border-2 ${
            nodeStatus === 'running'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="text-sm text-gray-400">Node Status</div>
            <div className={`text-2xl font-bold ${
              nodeStatus === 'running' ? 'text-green-400' : 'text-red-400'
            }`}>
              {nodeStatus === 'running' ? 'ðŸŸ¢ RUNNING' : 'ðŸ"´ STOPPED'}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Stake"
            value={`${validatorData.stake.toLocaleString()} VNC`}
            icon={<DollarSign className="w-6 h-6 text-purple-400" />}
            change="+2.5%"
            positive
          />
          <StatCard
            title="Blocks Produced"
            value={validatorData.blocksProduced.toLocaleString()}
            icon={<Activity className="w-6 h-6 text-blue-400" />}
            change={`+${validatorData.blocksProduced % 10}`}
            positive
          />
          <StatCard
            title="Rewards Earned"
            value={`${validatorData.rewards.toLocaleString()} VNC`}
            icon={<Award className="w-6 h-6 text-yellow-400" />}
            change="+15.2%"
            positive
          />
          <StatCard
            title="Uptime"
            value={`${validatorData.uptime}%`}
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            change="+0.2%"
            positive
          />
        </div>

        {/* Validator Info */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Server className="w-6 h-6 mr-2 text-blue-400" />
              Node Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Validator Address" value={validatorData.address} mono />
              <InfoItem label="Commission Rate" value={`${validatorData.commission}%`} />
              <InfoItem label="Total Delegators" value={String(validatorData.delegators)} />
              <InfoItem label="Total Delegated" value={`${validatorData.totalDelegated.toLocaleString()} VNC`} />
              <InfoItem label="Blocks Produced" value={String(validatorData.blocksProduced)} />
              <InfoItem label="Blocks Missed" value={String(validatorData.blocksMissed)} warning />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Node Controls</h2>
            <div className="space-y-3">
              <button
                onClick={() => setNodeStatus(nodeStatus === 'running' ? 'stopped' : 'running')}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 ${
                  nodeStatus === 'running'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {nodeStatus === 'running' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <span>{nodeStatus === 'running' ? 'Stop Node' : 'Start Node'}</span>
              </button>
              <button className="w-full py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold hover:bg-blue-500/30">
                Restart Node
              </button>
              <button className="w-full py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold hover:bg-purple-500/30">
                Update Config
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-green-400" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <MetricCard
              title="Success Rate"
              value="99.6%"
              icon="âœ..."
              color="green"
            />
            <MetricCard
              title="Avg Block Time"
              value="2.1s"
              icon="⏱️"
              color="blue"
            />
            <MetricCard
              title="Network Share"
              value="4.8%"
              icon="📊"
              color="purple"
            />
            <MetricCard
              title="Slashing Risk"
              value="LOW"
              icon="🛡️"
              color="green"
            />
          </div>
        </div>

        {/* Recent Blocks */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            ðŸ"¦ Recent Blocks Produced
          </h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Block #{blocks - i}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(Date.now() - i * 2000).toLocaleTimeString()} â€¢ {15 + Math.floor(Math.random() * 20)} txs
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{(Math.random() * 10).toFixed(2)} VNC</div>
                  <div className="text-xs text-gray-400">Reward</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delegators */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            ðŸ'¥ Top Delegators
          </h2>
          <div className="space-y-3">
            {[
              { address: '0x1234...5678', stake: 250000, rewards: 12500 },
              { address: '0x8765...4321', stake: 180000, rewards: 9000 },
              { address: '0xabcd...ef01', stake: 120000, rewards: 6000 },
              { address: '0x9876...5432', stake: 95000, rewards: 4750 },
            ].map((delegator, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-mono text-white">{delegator.address}</div>
                    <div className="text-sm text-gray-400">
                      Stake: {delegator.stake.toLocaleString()} VNC
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{delegator.rewards.toLocaleString()} VNC</div>
                  <div className="text-xs text-gray-400">Rewards Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Summary */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">
              {validatorData.rewards.toLocaleString()}
            </div>
            <div className="text-gray-400">Total Rewards (VNC)</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">+15.2%</div>
            <div className="text-gray-400">30-Day Growth</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Stake Security</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}

function StatCard({ title, value, icon, change, positive }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`text-sm font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  mono?: boolean;
  warning?: boolean;
}

function InfoItem({ label, value, mono, warning }: InfoItemProps) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`font-bold ${warning ? 'text-yellow-400' : 'text-white'} ${mono ? 'font-mono text-sm' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const colorClasses = {
    green: 'from-green-500/10 to-green-600/10 border-green-500/30',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-6 text-center`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}


