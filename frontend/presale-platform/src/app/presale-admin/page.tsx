'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertCircle, Settings, Download, BarChart3, Wallet } from 'lucide-react';

export default function PresaleManagementDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [presaleStatus, setPresaleStatus] = useState<'active' | 'paused'>('active');

  // Check authentication and authorization
  useEffect(() => {
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');

    if (!token) {
      alert('Please login to access presale admin');
      router.push('/login');
      return;
    }

    // Only super-admin, admin, and presale-admin can access
    if (userRole !== 'super-admin' && userRole !== 'admin' && userRole !== 'presale-admin') {
      alert('Access denied! Only presale administrators can access this page.');
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  const presaleData = {
    stage1: { price: 0.50, target: 60000000, sold: 45000000, raised: 22500000 },
    stage2: { price: 0.75, target: 52500000, sold: 15000000, raised: 11250000 },
    stage3: { price: 1.00, target: 37500000, sold: 0, raised: 0 },
    totalInvestors: 8542,
    totalRaised: 33750000,
    kycPending: 156,
    claimableTGE: 30,
    vestingMonths: 6,
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Checking authorization...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              ðŸ'° Presale Management Dashboard
            </h1>
            <p className="text-gray-400">Monitor and control token presale operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPresaleStatus(presaleStatus === 'active' ? 'paused' : 'active')}
              className={`px-6 py-3 rounded-lg font-bold flex items-center space-x-2 ${
                presaleStatus === 'active'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {presaleStatus === 'active' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span>{presaleStatus === 'active' ? 'Pause Presale' : 'Resume Presale'}</span>
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Raised"
            value={`â‚¹${presaleData.totalRaised.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-green-400" />}
            change="+12.5%"
            positive
          />
          <StatCard
            title="Total Investors"
            value={presaleData.totalInvestors.toLocaleString()}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            change="+385"
            positive
          />
          <StatCard
            title="Current Stage"
            value={`Stage ${currentStage}`}
            icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
            change="Active"
            positive
          />
          <StatCard
            title="KYC Pending"
            value={presaleData.kycPending}
            icon={<Clock className="w-6 h-6 text-yellow-400" />}
            change="Review needed"
            positive={false}
          />
        </div>

        {/* Stage Progress */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            ðŸ"Š Presale Stage Progress
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <StageCard
              stage={1}
              price="â‚¹0.50"
              target={presaleData.stage1.target}
              sold={presaleData.stage1.sold}
              raised={presaleData.stage1.raised}
              active={currentStage === 1}
              completed={currentStage > 1}
              onActivate={() => setCurrentStage(1)}
            />
            <StageCard
              stage={2}
              price="â‚¹0.75"
              target={presaleData.stage2.target}
              sold={presaleData.stage2.sold}
              raised={presaleData.stage2.raised}
              active={currentStage === 2}
              completed={currentStage > 2}
              onActivate={() => setCurrentStage(2)}
            />
            <StageCard
              stage={3}
              price="â‚¹1.00"
              target={presaleData.stage3.target}
              sold={presaleData.stage3.sold}
              raised={presaleData.stage3.raised}
              active={currentStage === 3}
              completed={false}
              onActivate={() => setCurrentStage(3)}
            />
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              ðŸ›' Recent Purchases (Real-time)
            </h2>
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30">
              <Download className="w-4 h-4 inline mr-2" />
              Export CSV
            </button>
          </div>
          <div className="space-y-3">
            {[
              { address: '0x1234...5678', amount: 50000, tokens: 100000, stage: 1, kyc: 'verified', time: '2 mins ago' },
              { address: '0x8765...4321', amount: 25000, tokens: 50000, stage: 1, kyc: 'pending', time: '5 mins ago' },
              { address: '0xabcd...ef01', amount: 75000, tokens: 150000, stage: 1, kyc: 'verified', time: '8 mins ago' },
              { address: '0x9876...5432', amount: 100000, tokens: 200000, stage: 1, kyc: 'verified', time: '12 mins ago' },
            ].map((purchase, i) => (
              <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    purchase.kyc === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-mono text-white text-sm">{purchase.address}</div>
                    <div className="text-xs text-gray-400">
                      Stage {purchase.stage} â€¢ {purchase.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-white font-bold">â‚¹{purchase.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{purchase.tokens.toLocaleString()} VNC</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    purchase.kyc === 'verified'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {purchase.kyc === 'verified' ? 'âœ" Verified' : 'â³ Pending KYC'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Analytics */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              ðŸ'¥ Investor Distribution
            </h2>
            <div className="space-y-4">
              {[
                { range: '< â‚¹10,000', count: 6542, percentage: 76.6 },
                { range: 'â‚¹10K - â‚¹50K', count: 1250, percentage: 14.6 },
                { range: 'â‚¹50K - â‚¹100K', count: 480, percentage: 5.6 },
                { range: '> â‚¹100K', count: 270, percentage: 3.2 },
              ].map((bracket, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">{bracket.range}</span>
                    <span className="text-white font-bold">{bracket.count} ({bracket.percentage}%)</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-700"
                      style={{ width: `${bracket.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              â±ï¸ Vesting Schedule
            </h2>
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">TGE Release (Immediate)</div>
                <div className="text-2xl font-bold text-green-400 mb-1">{presaleData.claimableTGE}%</div>
                <div className="text-sm text-gray-400">Available on launch</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Vesting Period</div>
                <div className="text-2xl font-bold text-purple-400 mb-1">{presaleData.vestingMonths} Months</div>
                <div className="text-sm text-gray-400">Linear release (70%)</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Monthly Release</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {(70 / presaleData.vestingMonths).toFixed(2)}%
                </div>
                <div className="text-sm text-gray-400">Per month after TGE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Controls */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-green-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-gray-400" />
            Presale Settings & Controls
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6 hover:bg-green-500/20 transition-all">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">Advance Stage</div>
              <div className="text-sm text-gray-400">Move to next stage</div>
            </button>
            <button className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6 hover:bg-blue-500/20 transition-all">
              <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">Update Pricing</div>
              <div className="text-sm text-gray-400">Modify token price</div>
            </button>
            <button className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-6 hover:bg-purple-500/20 transition-all">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">Process KYC</div>
              <div className="text-sm text-gray-400">Approve pending users</div>
            </button>
            <button className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-6 hover:bg-yellow-500/20 transition-all">
              <Wallet className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">Set Vesting</div>
              <div className="text-sm text-gray-400">Configure schedule</div>
            </button>
            <button className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6 hover:bg-red-500/20 transition-all">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">Emergency Stop</div>
              <div className="text-sm text-gray-400">Pause all sales</div>
            </button>
            <button className="bg-gray-700 border-2 border-gray-600 rounded-lg p-6 hover:bg-gray-600 transition-all">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <div className="font-bold text-white mb-2">View Analytics</div>
              <div className="text-sm text-gray-400">Detailed reports</div>
            </button>
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
  positive: boolean;
}

function StatCard({ title, value, icon, change, positive }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`text-sm font-bold ${positive ? 'text-green-400' : 'text-yellow-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

interface StageCardProps {
  stage: number;
  price: string;
  target: number;
  sold: number;
  raised: number;
  active: boolean;
  completed: boolean;
  onActivate: () => void;
}

function StageCard({ stage, price, target, sold, raised, active, completed, onActivate }: StageCardProps) {
  const progress = (sold / target) * 100;

  return (
    <div
      className={`rounded-xl p-6 border-2 cursor-pointer transition-all ${
        active
          ? 'bg-green-500/10 border-green-500/50'
          : completed
          ? 'bg-blue-500/10 border-blue-500/30'
          : 'bg-gray-900 border-gray-700'
      }`}
      onClick={onActivate}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold text-white">Stage {stage}</div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          active ? 'bg-green-500/20 text-green-400' :
          completed ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-700 text-gray-400'
        }`}>
          {active ? 'ACTIVE' : completed ? 'COMPLETED' : 'UPCOMING'}
        </div>
      </div>

      <div className="text-3xl font-bold text-white mb-4">{price}</div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Sold</span>
          <span className="text-white font-bold">{sold.toLocaleString()}/{target.toLocaleString()} VNC</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${
              active ? 'bg-gradient-to-r from-green-500 to-green-700' :
              completed ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
              'bg-gray-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-400">{progress.toFixed(1)}% sold</div>
      </div>

      <div className="text-green-400 font-bold text-lg">
        â‚¹{raised.toLocaleString()} raised
      </div>
    </div>
  );
}

