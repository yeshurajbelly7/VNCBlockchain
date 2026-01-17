'use client';

import React, { useState } from 'react';
import {
  Users,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Gift,
  Award,
  Share2,
  UserPlus,
  Target,
  Clock,
  AlertCircle,
  ExternalLink,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Info,
} from 'lucide-react';

interface Referral {
  id: string;
  userName: string;
  email: string;
  joinDate: string;
  purchaseAmount: number;
  status: 'pending' | 'qualified' | 'rewarded';
  rewardAmount: number;
  rewardDate?: string;
  vestingProgress: number;
}

export default function ReferralDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'rewards'>('overview');
  const [copied, setCopied] = useState(false);
  
  // Mock user referral code
  const referralCode = 'VNC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const referralLink = `https://vncblockchain.com/signup?ref=${referralCode}`;

  // Mock referral data
  const referrals: Referral[] = [
    {
      id: '1',
      userName: 'John Doe',
      email: 'john@example.com',
      joinDate: '2025-01-10',
      purchaseAmount: 25000,
      status: 'rewarded',
      rewardAmount: 200,
      rewardDate: '2025-01-11',
      vestingProgress: 50,
    },
    {
      id: '2',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2025-01-12',
      purchaseAmount: 15000,
      status: 'rewarded',
      rewardAmount: 200,
      rewardDate: '2025-01-13',
      vestingProgress: 50,
    },
    {
      id: '3',
      userName: 'Bob Wilson',
      email: 'bob@example.com',
      joinDate: '2025-01-14',
      purchaseAmount: 12000,
      status: 'qualified',
      rewardAmount: 200,
      vestingProgress: 0,
    },
    {
      id: '4',
      userName: 'Alice Johnson',
      email: 'alice@example.com',
      joinDate: '2025-01-15',
      purchaseAmount: 8000,
      status: 'pending',
      rewardAmount: 0,
      vestingProgress: 0,
    },
  ];

  const totalReferrals = referrals.length;
  const qualifiedReferrals = referrals.filter(r => r.status === 'qualified' || r.status === 'rewarded').length;
  const totalEarned = referrals.filter(r => r.status === 'rewarded').reduce((sum, r) => sum + r.rewardAmount, 0);
  const pendingRewards = referrals.filter(r => r.status === 'qualified').length * 200;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-semibold">PENDING</span>;
      case 'qualified':
        return <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">QUALIFIED</span>;
      case 'rewarded':
        return <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold">REWARDED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Refer & Earn</h1>
          </div>
          <p className="text-gray-400">Earn 200 VNC for every friend who purchases 10,000+ VNC tokens</p>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Your Referral Link</h2>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <code className="flex-1 text-purple-400 text-lg font-mono break-all">{referralLink}</code>
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Your Referral Code</div>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-bold text-white font-mono">{referralCode}</code>
                <button
                  onClick={() => copyToClipboard(referralCode)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Reward per Referral</div>
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">200 VNC</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email
            </button>
            <button className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
            <button className="px-6 py-3 bg-blue-400/20 hover:bg-blue-400/30 border border-blue-400/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Twitter className="w-5 h-5" />
              Twitter
            </button>
            <button className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Facebook className="w-5 h-5" />
              Facebook
            </button>
            <button className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              More
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm font-semibold">Total Referrals</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalReferrals}</div>
            <div className="text-sm text-gray-400">All invited users</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-semibold">Qualified</span>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{qualifiedReferrals}</div>
            <div className="text-sm text-gray-400">Purchased ≥ 10k VNC</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 text-sm font-semibold">Total Earned</span>
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalEarned.toLocaleString()}</div>
            <div className="text-sm text-gray-400">VNC Tokens</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 text-sm font-semibold">Pending</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{pendingRewards.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Being processed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'overview'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'referrals'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            My Referrals ({totalReferrals})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'rewards'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Rewards History
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">How Refer & Earn Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">1. Share Your Link</h4>
                  <p className="text-gray-400 text-sm">
                    Copy your unique referral link and share it with friends via email, social media, or messaging apps.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">2. Friend Purchases</h4>
                  <p className="text-gray-400 text-sm">
                    Your friend signs up using your link, completes KYC, and purchases minimum 10,000 VNC tokens.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Gift className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">3. Earn Rewards</h4>
                  <p className="text-gray-400 text-sm">
                    You automatically receive 200 VNC tokens as a reward, with 50% unlocked instantly and 50% vested over 3 months.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules & Requirements */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Referral Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">✅ To Qualify</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Referred user must sign up via your unique link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Complete KYC verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Purchase minimum 10,000 VNC tokens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>One-time reward per referred user</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">❌ Not Allowed</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Self-referrals or multiple accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Fake accounts or fraudulent activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Using bots or automated systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Spamming or unsolicited promotion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reward Structure */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur border border-yellow-500/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Reward Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Per Qualified Referral</div>
                  <div className="text-3xl font-bold text-yellow-400">200 VNC</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Instant Unlock</div>
                  <div className="text-3xl font-bold text-green-400">50%</div>
                  <div className="text-xs text-gray-400 mt-1">100 VNC immediately</div>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-2">Vesting Period</div>
                  <div className="text-3xl font-bold text-purple-400">3 Months</div>
                  <div className="text-xs text-gray-400 mt-1">100 VNC over time</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            {referrals.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Referrals Yet</h3>
                <p className="text-gray-400">Start sharing your referral link to earn rewards!</p>
              </div>
            ) : (
              referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{referral.userName}</h4>
                          <p className="text-sm text-gray-400">{referral.email}</p>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Join Date</div>
                      <div className="text-white font-semibold">{new Date(referral.joinDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Purchase Amount</div>
                      <div className="text-white font-semibold">{referral.purchaseAmount.toLocaleString()} VNC</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Your Reward</div>
                      <div className={`font-semibold ${referral.rewardAmount > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        {referral.rewardAmount > 0 ? `${referral.rewardAmount} VNC` : 'Pending'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Vesting Progress</div>
                      <div className="text-white font-semibold">{referral.vestingProgress}%</div>
                    </div>
                  </div>

                  {referral.status === 'rewarded' && referral.vestingProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Vesting Progress</span>
                        <span className="text-sm font-semibold text-white">{referral.vestingProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${referral.vestingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {referral.status === 'pending' && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span>Waiting for user to purchase minimum 10,000 VNC tokens</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Rewards History Tab */}
        {activeTab === 'rewards' && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 text-center">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Rewards History</h3>
            <p className="text-gray-400">Complete history of all your referral rewards and vesting schedules</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Rewards are processed automatically within 24 hours after your referral qualifies</li>
                <li>• 50% of your reward unlocks immediately, 50% vests linearly over 3 months</li>
                <li>• All referral activity is recorded on-chain for transparency</li>
                <li>• Contact support if you believe a qualified referral was not credited</li>
                <li>• Anti-fraud systems actively monitor for suspicious activity</li>
              </ul>
              <button className="mt-4 px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Full Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
