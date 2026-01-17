'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Wallet, TrendingUp, Shield, LogOut, 
  Copy, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, IndianRupee, Gift, Target 
} from 'lucide-react';
import CashfreeDepositForm from '@/components/CashfreeDepositForm';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'presale' | 'wallet' | 'security'>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Redirect admins and validators to their respective dashboards
    if (userRole === 'super-admin' || userRole === 'admin') {
      router.push('/super-admin');
      return;
    } else if (userRole === 'validator') {
      router.push('/validator-dashboard');
      return;
    } else if (userRole === 'presale-admin') {
      router.push('/presale-admin');
      return;
    }
    
    setIsAuthenticated(true);

    // Check for payment success callback
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const amount = urlParams.get('amount');
    
    if (paymentStatus === 'success' && amount) {
      // Update wallet balance
      const currentBalance = parseFloat(localStorage.getItem('vnc_wallet_inr_balance') || '0');
      localStorage.setItem('vnc_wallet_inr_balance', (currentBalance + parseFloat(amount)).toString());
      
      // Show success message
      alert(`Payment successful! ₹${amount} has been added to your wallet.`);
      
      // Switch to wallet tab
      setActiveTab('wallet');
      
      // Clean URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user_email');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Loading...</div>
    </div>;
  }

  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    joined: 'Jan 5, 2026',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8',
    portfolio: {
      totalValue: '₹2,45,000',
      vnc: '15,000',
      eth: '0.5432',
      usdt: '1,250',
      bnb: '2.345',
    },
    presaleData: {
      totalInvested: '₹50,000',
      tokensOwned: '100,000 VNC',
      currentValue: '₹1,00,000',
      roi: '+100%',
      vestingSchedule: [
        { date: '16 Apr 2025', amount: '30,000 VNC', status: 'claimed' },
        { date: '16 Jul 2025', amount: '35,000 VNC', status: 'claimable' },
        { date: '16 Oct 2025', amount: '35,000 VNC', status: 'locked' },
      ],
    },
    recentTransactions: [
      { type: 'Presale', amount: '+50,000 VNC', time: '2 days ago', status: 'Completed' },
      { type: 'Transfer', amount: '-1,000 VNC', time: '5 days ago', status: 'Completed' },
      { type: 'Deposit', amount: '+0.5 ETH', time: '1 week ago', status: 'Completed' },
    ],
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{userData.name}</span>!
            </h1>
            <p className="text-gray-400">Manage your portfolio and track your investments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-card-bg border border-border-color hover:border-primary hover:scale-105 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border-2 border-primary/30 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Total Portfolio Value</div>
            <div className="text-3xl font-bold gradient-text mb-2">{userData.portfolio.totalValue}</div>
            <div className="text-sm text-green-400">+12.5% this month</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">VNC Balance</div>
            <div className="text-3xl font-bold">{userData.portfolio.vnc}</div>
            <div className="text-sm text-gray-400">VNC Tokens</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Presale Investment</div>
            <div className="text-3xl font-bold">{userData.presaleData.totalInvested}</div>
            <div className="text-sm text-green-400">{userData.presaleData.roi} ROI</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Member Since</div>
            <div className="text-3xl font-bold">{userData.joined.split(' ')[1]}</div>
            <div className="text-sm text-gray-400">{userData.joined}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border-color overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('presale')}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'presale'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Presale
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'wallet'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-5 h-5 inline-block mr-2" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5 inline-block mr-2" />
            Security
          </button>
          <Link
            href="/dashboard/airdrops"
            className="px-6 py-3 font-semibold whitespace-nowrap transition-colors text-gray-400 hover:text-white flex items-center"
          >
            <Gift className="w-5 h-5 inline-block mr-2" />
            My Airdrops
          </Link>
          <Link
            href="/dashboard/referrals"
            className="px-6 py-3 font-semibold whitespace-nowrap transition-colors text-gray-400 hover:text-white flex items-center"
          >
            <Target className="w-5 h-5 inline-block mr-2" />
            Refer & Earn
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Portfolio Breakdown */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Portfolio Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(userData.portfolio).filter(([key]) => key !== 'totalValue').map(([currency, amount]) => (
                  <div key={currency} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-quantum rounded-lg flex items-center justify-center font-bold uppercase">
                        {currency.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold uppercase">{currency}</div>
                        <div className="text-sm text-gray-400">
                          {currency === 'vnc' ? 'VNC Blockchain' : currency === 'eth' ? 'Ethereum' : currency === 'usdt' ? 'Tether USD' : 'Binance Coin'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{amount}</div>
                      <div className="text-sm text-gray-400">
                        ≈ ₹{(parseFloat(amount.replace(/,/g, '')) * (currency === 'vnc' ? 1 : currency === 'eth' ? 150000 : currency === 'usdt' ? 83 : 30000)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {userData.recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-quantum/5 border border-quantum/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'Deposit' || tx.type === 'Presale' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {tx.type === 'Deposit' || tx.type === 'Presale' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{tx.type}</div>
                        <div className="text-sm text-gray-400">{tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.type === 'Deposit' || tx.type === 'Presale' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.amount}
                      </div>
                      <div className="text-sm text-green-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/transactions"
                className="block text-center mt-6 text-primary hover:underline font-semibold"
              >
                View All Transactions â†'
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'presale' && (
          <div className="space-y-8">
            {/* Presale Summary */}
            <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border-2 border-primary/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Your Presale Investment</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Total Invested</div>
                  <div className="text-3xl font-bold">{userData.presaleData.totalInvested}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Tokens Owned</div>
                  <div className="text-3xl font-bold">{userData.presaleData.tokensOwned.split(' ')[0]}</div>
                  <div className="text-sm text-gray-400">VNC</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Current Value</div>
                  <div className="text-3xl font-bold gradient-text">{userData.presaleData.currentValue}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">ROI</div>
                  <div className="text-3xl font-bold text-green-400">{userData.presaleData.roi}</div>
                </div>
              </div>
            </div>

            {/* Vesting Schedule */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Vesting Schedule</h3>
              <div className="space-y-4">
                {userData.presaleData.vestingSchedule.map((vest, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        vest.status === 'claimed' ? 'bg-green-500/20' :
                        vest.status === 'claimable' ? 'bg-quantum/20' : 'bg-gray-500/20'
                      }`}>
                        {vest.status === 'claimed' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : vest.status === 'claimable' ? (
                          <Clock className="w-6 h-6 text-quantum" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{vest.amount}</div>
                        <div className="text-sm text-gray-400">Release Date: {vest.date}</div>
                      </div>
                    </div>
                    <div>
                      {vest.status === 'claimed' ? (
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold">
                          Claimed
                        </span>
                      ) : vest.status === 'claimable' ? (
                        <button className="px-6 py-2 bg-gradient-to-r from-primary to-quantum rounded-lg font-semibold hover:opacity-90">
                          Claim Now
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg font-semibold">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy More */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Want to buy more VNC?</h3>
              <p className="text-gray-400 mb-6">
                Presale Stage 2 is now live. Don&apos;t miss the opportunity!
              </p>
              <Link
                href="/presale"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-opacity"
              >
                Buy More Tokens
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-8">
            {/* INR Wallet Balance & Deposit */}
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/30 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">INR Wallet Balance</div>
                  <div className="text-4xl font-bold text-green-400">
                    ₹{parseFloat(localStorage.getItem('vnc_wallet_inr_balance') || '0').toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="w-16 h-16 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              {!showDepositForm ? (
                <button
                  onClick={() => setShowDepositForm(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 rounded-xl font-bold transition-opacity flex items-center justify-center gap-2"
                >
                  <IndianRupee className="w-5 h-5" />
                  Add Money to Wallet
                </button>
              ) : (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Deposit INR</h3>
                    <button
                      onClick={() => setShowDepositForm(false)}
                      className="px-4 py-2 bg-card-bg border border-border-color hover:border-primary rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="bg-card-bg border border-border-color rounded-xl p-6">
                    <CashfreeDepositForm />
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Address */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Wallet Address</h3>
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="font-mono text-primary font-semibold break-all">
                  {userData.walletAddress}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(userData.walletAddress);
                    alert('Address copied!');
                  }}
                  className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/wallet"
                className="bg-card-bg border border-border-color hover:border-primary rounded-xl p-8 text-center transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ArrowUpRight className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">Send</h4>
                <p className="text-gray-400">Transfer crypto to another wallet</p>
              </Link>
              <Link
                href="/wallet"
                className="bg-card-bg border border-border-color hover:border-primary rounded-xl p-8 text-center transition-colors"
              >
                <div className="w-16 h-16 bg-quantum/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ArrowDownLeft className="w-8 h-8 text-quantum" />
                </div>
                <h4 className="text-xl font-bold mb-2">Receive</h4>
                <p className="text-gray-400">Get crypto from another wallet</p>
              </Link>
              <Link
                href="/presale"
                className="bg-card-bg border border-border-color hover:border-primary rounded-xl p-8 text-center transition-colors"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">Buy VNC</h4>
                <p className="text-gray-400">Purchase more VNC tokens</p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Security Settings */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Add an extra layer of security</div>
                  </div>
                  <button className="px-6 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold">
                    Enabled
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Change Password</div>
                    <div className="text-sm text-gray-400">Update your account password</div>
                  </div>
                  <button className="px-6 py-2 border-2 border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Recovery Phrase</div>
                    <div className="text-sm text-gray-400">View or backup your wallet recovery phrase</div>
                  </div>
                  <button className="px-6 py-2 border-2 border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                    View
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Active Sessions</div>
                    <div className="text-sm text-gray-400">Manage your logged-in devices</div>
                  </div>
                  <button className="px-6 py-2 border-2 border-border-color hover:border-primary rounded-lg font-semibold transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Account Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-card-bg/50 rounded-lg">
                  <span className="text-gray-400">Email</span>
                  <span className="font-semibold">{userData.email}</span>
                </div>
                <div className="flex justify-between p-4 bg-card-bg/50 rounded-lg">
                  <span className="text-gray-400">Member Since</span>
                  <span className="font-semibold">{userData.joined}</span>
                </div>
                <div className="flex justify-between p-4 bg-card-bg/50 rounded-lg">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">
                    Verified âœ"
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

