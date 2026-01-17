'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, AlertCircle, Shield, Lock, CheckCircle, XCircle, Clock, DollarSign, Settings } from 'lucide-react';

export default function WalletSystemAdminDashboard() {
  const router = useRouter();
  const [_isAuthorized, setIsAuthorized] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<'hot' | 'cold'>('hot');

  // Check authentication and authorization
  useEffect(() => {
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');

    if (!token) {
      alert('Please login to access wallet system admin');
      router.push('/login');
      return;
    }

    // Only super-admin and admin can access
    if (userRole !== 'super-admin' && userRole !== 'admin') {
      alert('Access denied! Only super administrators can access this page.');
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  const walletData = {
    hot: {
      inr: 12500000,
      vnc: 45000000,
      eth: 125.5,
      btc: 2.45,
      usdt: 850000,
      transactions24h: 1547,
    },
    cold: {
      inr: 85000000,
      vnc: 305000000,
      eth: 458.2,
      btc: 18.75,
      usdt: 5200000,
      transactions24h: 0,
    },
    limits: {
      dailyWithdrawal: 5000000,
      singleTransaction: 1000000,
      hotWalletMax: 50000000,
    },
    pendingWithdrawals: 28,
    frozenAccounts: 5,
    multiSigRequired: 3,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Wallet className="w-10 h-10 mr-3 text-blue-400" />
            Wallet System Administration
          </h1>
          <p className="text-gray-400">Monitor and control all wallet operations, balances, and security</p>
        </div>

        {/* Security Alert Banner */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4 mb-8 flex items-start">
          <AlertCircle className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
          <div>
            <div className="font-bold text-yellow-400 mb-1">Security Notice</div>
            <div className="text-sm text-gray-300">
              All withdrawal operations require multi-signature approval. {walletData.pendingWithdrawals} withdrawals awaiting approval.
            </div>
          </div>
        </div>

        {/* Wallet Overview Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Hot Wallet"
            value={`â‚¹${(walletData.hot.inr / 1000000).toFixed(1)}M`}
            icon={<Wallet className="w-6 h-6 text-orange-400" />}
            change="Live"
            color="orange"
          />
          <StatCard
            title="Total Cold Storage"
            value={`â‚¹${(walletData.cold.inr / 1000000).toFixed(1)}M`}
            icon={<Lock className="w-6 h-6 text-blue-400" />}
            change="Secured"
            color="blue"
          />
          <StatCard
            title="Pending Approvals"
            value={walletData.pendingWithdrawals}
            icon={<Clock className="w-6 h-6 text-yellow-400" />}
            change="Review"
            color="yellow"
          />
          <StatCard
            title="Frozen Accounts"
            value={walletData.frozenAccounts}
            icon={<Shield className="w-6 h-6 text-red-400" />}
            change="Active"
            color="red"
          />
        </div>

        {/* Wallet Type Selector */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">ðŸ'° Wallet Balances</h2>
            <div className="flex bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setSelectedWallet('hot')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  selectedWallet === 'hot'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ðŸ"¥ Hot Wallet
              </button>
              <button
                onClick={() => setSelectedWallet('cold')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  selectedWallet === 'cold'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                â„ï¸ Cold Storage
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <BalanceCard
              currency="INR"
              amount={selectedWallet === 'hot' ? walletData.hot.inr : walletData.cold.inr}
              symbol="â‚¹"
              icon="ðŸ'µ"
            />
            <BalanceCard
              currency="VNC"
              amount={selectedWallet === 'hot' ? walletData.hot.vnc : walletData.cold.vnc}
              symbol=""
              icon="ðŸª™"
            />
            <BalanceCard
              currency="USDT"
              amount={selectedWallet === 'hot' ? walletData.hot.usdt : walletData.cold.usdt}
              symbol="$"
              icon="ðŸ'µ"
            />
            <BalanceCard
              currency="ETH"
              amount={selectedWallet === 'hot' ? walletData.hot.eth : walletData.cold.eth}
              symbol=""
              icon="âŸ "
            />
            <BalanceCard
              currency="BTC"
              amount={selectedWallet === 'hot' ? walletData.hot.btc : walletData.cold.btc}
              symbol=""
              icon="â‚¿"
            />
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-2">ðŸ"Š</div>
              <div className="text-gray-400 text-sm mb-1">24h Activity</div>
              <div className="text-2xl font-bold text-white">
                {selectedWallet === 'hot' ? walletData.hot.transactions24h : walletData.cold.transactions24h}
              </div>
              <div className="text-xs text-gray-400">transactions</div>
            </div>
          </div>

          {selectedWallet === 'hot' && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-orange-400 font-bold">Hot Wallet Warning</span>
                </div>
                <button className="px-4 py-2 bg-orange-500 rounded-lg font-bold hover:bg-orange-600">
                  Transfer to Cold Storage
                </button>
              </div>
              <div className="text-sm text-gray-300 mt-2">
                Current balance: â‚¹{(walletData.hot.inr / 1000000).toFixed(1)}M / Max: â‚¹{(walletData.limits.hotWalletMax / 1000000).toFixed(1)}M
              </div>
            </div>
          )}
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            â³ Pending Withdrawal Approvals
          </h2>
          <div className="space-y-4">
            {[
              { id: 'WD-12345', user: '0x1234...5678', amount: 500000, currency: 'INR', time: '5 mins ago', signatures: 2, risk: 'low' },
              { id: 'WD-12346', user: '0x8765...4321', amount: 1200000, currency: 'INR', time: '12 mins ago', signatures: 1, risk: 'medium' },
              { id: 'WD-12347', user: '0xabcd...ef01', amount: 2500000, currency: 'VNC', time: '25 mins ago', signatures: 0, risk: 'high' },
              { id: 'WD-12348', user: '0x9876...5432', amount: 750000, currency: 'USDT', time: '38 mins ago', signatures: 2, risk: 'low' },
            ].map((withdrawal) => (
              <div key={withdrawal.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-mono text-white font-bold mr-3">{withdrawal.id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        withdrawal.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                        withdrawal.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.risk.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">User</div>
                        <div className="text-white font-mono">{withdrawal.user}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Amount</div>
                        <div className="text-white font-bold">
                          {withdrawal.currency === 'INR' ? 'â‚¹' : ''}
                          {withdrawal.amount.toLocaleString()} {withdrawal.currency}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Signatures</div>
                        <div className="text-white font-bold">
                          {withdrawal.signatures}/{walletData.multiSigRequired} required
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Submitted</div>
                        <div className="text-white">{withdrawal.time}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <button className="px-6 py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve
                    </button>
                    <button className="px-6 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Limits & Security Settings */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2 text-green-400" />
              Transaction Limits
            </h2>
            <div className="space-y-4">
              <LimitControl
                label="Daily Withdrawal Limit"
                current={walletData.limits.dailyWithdrawal}
                max={10000000}
              />
              <LimitControl
                label="Single Transaction Max"
                current={walletData.limits.singleTransaction}
                max={5000000}
              />
              <LimitControl
                label="Hot Wallet Maximum"
                current={walletData.limits.hotWalletMax}
                max={100000000}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <SecurityToggle label="Multi-Signature Required" enabled={true} />
              <SecurityToggle label="Auto-Freeze Suspicious" enabled={true} />
              <SecurityToggle label="Daily Limit Enforcement" enabled={true} />
              <SecurityToggle label="IP Whitelist Only" enabled={false} />
              <SecurityToggle label="Hardware Wallet Required" enabled={true} />
              <SecurityToggle label="Time-Lock Large Transfers" enabled={true} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            ðŸ" Recent Wallet Activity
          </h2>
          <div className="space-y-3">
            {[
              { type: 'deposit', amount: 250000, currency: 'INR', user: '0x1234...5678', status: 'completed', time: '2 mins ago' },
              { type: 'withdrawal', amount: 100000, currency: 'VNC', user: '0x8765...4321', status: 'pending', time: '5 mins ago' },
              { type: 'transfer', amount: 5000000, currency: 'INR', user: 'Hot → Cold', status: 'completed', time: '15 mins ago' },
              { type: 'deposit', amount: 500000, currency: 'USDT', user: '0xabcd...ef01', status: 'completed', time: '22 mins ago' },
              { type: 'withdrawal', amount: 75000, currency: 'INR', user: '0x9876...5432', status: 'rejected', time: '35 mins ago' },
            ].map((activity, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {activity.type === 'deposit' && <TrendingDown className="w-5 h-5 text-green-400" />}
                  {activity.type === 'withdrawal' && <TrendingUp className="w-5 h-5 text-orange-400" />}
                  {activity.type === 'transfer' && <Wallet className="w-5 h-5 text-blue-400" />}
                  <div>
                    <div className="text-white font-bold capitalize">{activity.type}</div>
                    <div className="text-sm text-gray-400">{activity.user} â€¢ {activity.time}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-white font-bold">
                      {activity.currency === 'INR' ? 'â‚¹' : ''}
                      {activity.amount.toLocaleString()} {activity.currency}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-blue-500/20 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-gray-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <QuickActionButton icon="🔄" label="Hot → Cold Transfer" color="blue" />
            <QuickActionButton icon="🚫" label="Freeze Account" color="red" />
            <QuickActionButton icon="📊" label="Generate Report" color="purple" />
            <QuickActionButton icon="⚠️" label="Security Audit" color="yellow" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  color: 'orange' | 'blue' | 'yellow' | 'red';
}

function StatCard({ title, value, icon, change, color }: StatCardProps) {
  const colorClasses = {
    orange: 'border-orange-500/20',
    blue: 'border-blue-500/20',
    yellow: 'border-yellow-500/20',
    red: 'border-red-500/20',
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-sm font-bold text-gray-400">{change}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

interface BalanceCardProps {
  currency: string;
  amount: number | string;
  symbol: string;
  icon: string;
}

function BalanceCard({ currency, amount, symbol, icon }: BalanceCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-gray-400 text-sm mb-1">{currency}</div>
      <div className="text-2xl font-bold text-white">
        {symbol}{typeof amount === 'number' ? amount.toLocaleString() : amount}
      </div>
    </div>
  );
}

interface LimitControlProps {
  label: string;
  current: number;
  max: number;
}

function LimitControl({ label, current, max }: LimitControlProps) {
  const percentage = (current / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-bold">â‚¹{current.toLocaleString()}</span>
      </div>
      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-700"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-400 mt-1">Max: â‚¹{max.toLocaleString()}</div>
    </div>
  );
}

interface SecurityToggleProps {
  label: string;
  enabled: boolean;
}

function SecurityToggle({ label, enabled }: SecurityToggleProps) {
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
      <span className="text-white">{label}</span>
      <div className={`w-12 h-6 rounded-full flex items-center px-1 ${
        enabled ? 'bg-green-500' : 'bg-gray-700'
      }`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-all ${
          enabled ? 'ml-auto' : ''
        }`}></div>
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: string;
  label: string;
  color: 'blue' | 'red' | 'purple' | 'yellow';
}

function QuickActionButton({ icon, label, color }: QuickActionButtonProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
    red: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
    purple: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20',
  };

  return (
    <button className={`${colorClasses[color as keyof typeof colorClasses]} border-2 rounded-lg p-6 transition-all`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-bold text-white text-sm">{label}</div>
    </button>
  );
}

