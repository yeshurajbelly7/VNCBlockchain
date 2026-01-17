'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Settings, Play, Pause, Plus, Edit, Trash2, Save, X, Check, AlertTriangle, Calendar, Clock, Target, Activity, Coins, Wallet, Globe, RefreshCw, Download, Eye, Lock, Zap, Award, BarChart3, PieChart, ArrowUpRight, Info } from 'lucide-react';

interface PresaleStage {
  id: number;
  stage: string;
  name?: string;
  status: string;
  price: number;
  allocation: number;
  sold: number;
  raised: number;
  startDate: string;
  endDate: string;
  minPurchase: number;
  maxPurchase: number;
  bonus: number;
  visibility: string;
}

export default function PresalePage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, stages, investors, settings
  const [isPresaleActive, setIsPresaleActive] = useState(true);
  const [editingStage, setEditingStage] = useState<number | null>(null);
  const [viewingStage, setViewingStage] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<PresaleStage | null>(null);
  const [_showAddStage, setShowAddStage] = useState(false);

  // Token Distribution State (Editable)
  const [tokenDistribution, setTokenDistribution] = useState({
    totalSupply: 10000000000, // 10 Billion
    presaleAllocation: 3000000000, // 30% = 3 Billion
    presalePercentage: 30,
    teamAdvisors: 2000000000, // 20%
    teamPercentage: 20,
    liquidityMarketing: 2000000000, // 20%
    liquidityPercentage: 20,
    ecosystem: 1500000000, // 15%
    ecosystemPercentage: 15,
    reserve: 1500000000, // 15%
    reservePercentage: 15
  });

  // Comprehensive Presale Stages Data
  const [presaleStages, setPresaleStages] = useState([
    {
      id: 1,
      stage: 'Stage 1 - Seed',
      status: 'completed',
      price: 0.30,
      allocation: 300000000, // 300M tokens
      sold: 300000000,
      raised: 90000000, // $90M
      startDate: '2025-11-01',
      endDate: '2025-12-01',
      bonus: 50,
      minPurchase: 5000,
      maxPurchase: 500000,
      visibility: 'public'
    },
    {
      id: 2,
      stage: 'Stage 2 - Private',
      status: 'completed',
      price: 0.40,
      allocation: 500000000, // 500M tokens
      sold: 450000000,
      raised: 180000000, // $180M
      startDate: '2025-12-02',
      endDate: '2025-12-31',
      bonus: 30,
      minPurchase: 10000,
      maxPurchase: 1000000,
      visibility: 'public'
    },
    {
      id: 3,
      stage: 'Stage 3 - Public',
      status: 'active',
      price: 0.50,
      allocation: 800000000, // 800M tokens
      sold: 350000000,
      raised: 175000000, // $175M
      startDate: '2026-01-01',
      endDate: '2026-02-15',
      bonus: 20,
      minPurchase: 5000,
      maxPurchase: 2000000,
      visibility: 'public'
    },
    {
      id: 4,
      stage: 'Stage 4 - Final',
      status: 'upcoming',
      price: 0.75,
      allocation: 700000000, // 700M tokens
      sold: 0,
      raised: 0,
      startDate: '2026-02-16',
      endDate: '2026-03-31',
      bonus: 10,
      minPurchase: 10000,
      maxPurchase: 5000000,
      visibility: 'private'
    },
    {
      id: 5,
      stage: 'Stage 5 - Launch',
      status: 'upcoming',
      price: 1.00,
      allocation: 700000000, // 700M tokens
      sold: 0,
      raised: 0,
      startDate: '2026-04-01',
      endDate: '2026-04-30',
      bonus: 0,
      minPurchase: 5000,
      maxPurchase: 10000000,
      visibility: 'public'
    }
  ]);

  // Top Investors Data
  const topInvestors = [
    { rank: 1, name: 'Yeshuraj Belly', email: 'yeshurajbelly7@gmail.com', invested: 1255000, tokens: 3183333, purchases: 15, joinDate: '2025-11-05' },
    { rank: 2, name: 'Robert Chen', email: 'robert.chen@example.com', invested: 850000, tokens: 2125000, purchases: 8, joinDate: '2025-11-12' },
    { rank: 3, name: 'Lisa Martinez', email: 'lisa.martinez@example.com', invested: 600000, tokens: 1500000, purchases: 12, joinDate: '2025-11-20' },
    { rank: 4, name: 'David Kumar', email: 'david.kumar@example.com', invested: 450000, tokens: 1125000, purchases: 6, joinDate: '2025-12-03' },
    { rank: 5, name: 'Emily Davis', email: 'emily.davis@example.com', invested: 380000, tokens: 950000, purchases: 9, joinDate: '2025-12-10' },
    { rank: 6, name: 'John Doe', email: 'john.doe@example.com', invested: 320000, tokens: 800000, purchases: 5, joinDate: '2025-12-18' },
    { rank: 7, name: 'Jane Smith', email: 'jane.smith@example.com', invested: 275000, tokens: 687500, purchases: 7, joinDate: '2026-01-02' },
    { rank: 8, name: 'Mike Wilson', email: 'mike.wilson@example.com', invested: 180000, tokens: 360000, purchases: 3, joinDate: '2026-01-08' }
  ];

  // Global Statistics
  const globalStats = {
    totalRaised: presaleStages.reduce((sum, stage) => sum + stage.raised, 0),
    totalSold: presaleStages.reduce((sum, stage) => sum + stage.sold, 0),
    totalAllocation: presaleStages.reduce((sum, stage) => sum + stage.allocation, 0),
    totalInvestors: 2847,
    averageInvestment: 12450,
    completedStages: presaleStages.filter(s => s.status === 'completed').length,
    activeStages: presaleStages.filter(s => s.status === 'active').length,
    upcomingStages: presaleStages.filter(s => s.status === 'upcoming').length,
    currentPrice: presaleStages.find(s => s.status === 'active')?.price || 0,
    nextPrice: presaleStages.find(s => s.status === 'upcoming')?.price || 0,
    priceIncrease: 0,
    daysRemaining: 32,
    soldPercentage: 0,
    raisedToday: 145000,
    investorsToday: 23,
    transactionsToday: 45
  };

  globalStats.priceIncrease = ((globalStats.nextPrice - globalStats.currentPrice) / globalStats.currentPrice) * 100;
  globalStats.soldPercentage = (globalStats.totalSold / globalStats.totalAllocation) * 100;

  const activeStage = presaleStages.find(s => s.status === 'active');

  // Handler Functions
  const handleEditStage = (stage: PresaleStage) => {
    setEditFormData({...stage});
    setEditingStage(stage.id);
  };

  const handleViewStage = (stage: PresaleStage) => {
    setViewingStage(stage.id);
  };

  const handlePlayStage = (stageId: number) => {
    setPresaleStages(presaleStages.map(stage => {
      if (stage.id === stageId) {
        return {...stage, status: 'active'};
      }
      // Pause other active stages
      if (stage.status === 'active') {
        return {...stage, status: 'paused'};
      }
      return stage;
    }));
  };

  const handlePauseStage = (stageId: number) => {
    setPresaleStages(presaleStages.map(stage => 
      stage.id === stageId ? {...stage, status: 'paused'} : stage
    ));
  };

  const handleSaveStage = () => {
    if (editFormData && editingStage) {
      setPresaleStages(presaleStages.map(stage => 
        stage.id === editingStage ? editFormData : stage
      ));
      setEditingStage(null);
      setEditFormData(null);
    }
  };

  const handleDeleteStage = (stageId: number) => {
    if (confirm('Are you sure you want to delete this stage?')) {
      setPresaleStages(presaleStages.filter(stage => stage.id !== stageId));
    }
  };

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            Presale Management Hub
          </h1>
          <p className="text-gray-400 mt-1">Complete control over token presale stages, pricing, and investor management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsPresaleActive(!isPresaleActive)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              isPresaleActive 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isPresaleActive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPresaleActive ? 'Presale Active' : 'Presale Paused'}
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sync
          </button>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Global Stats Overview */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">${(globalStats.totalRaised / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-400 mt-1">Total Raised</div>
          <div className="text-xs text-green-400 mt-1">+${(globalStats.raisedToday / 1000).toFixed(0)}K today</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-6 h-6 text-purple-400" />
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{(globalStats.totalSold / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-400 mt-1">Tokens Sold</div>
          <div className="text-xs text-purple-400 mt-1">{globalStats.soldPercentage.toFixed(1)}% of total</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-400" />
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{globalStats.totalInvestors.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Total Investors</div>
          <div className="text-xs text-blue-400 mt-1">+{globalStats.investorsToday} today</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-orange-400" />
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">${activeStage?.price.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Current Price</div>
          <div className="text-xs text-orange-400 mt-1">Next: ${globalStats.nextPrice.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-pink-400" />
            <Check className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white">{globalStats.activeStages}</div>
          <div className="text-xs text-gray-400 mt-1">Active Stages</div>
          <div className="text-xs text-pink-400 mt-1">{globalStats.completedStages} completed</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-yellow-400" />
            <Calendar className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{globalStats.daysRemaining}</div>
          <div className="text-xs text-gray-400 mt-1">Days Remaining</div>
          <div className="text-xs text-yellow-400 mt-1">{activeStage?.stage}</div>
        </div>
      </div>

      {/* Active Stage Highlight */}
      {activeStage && (
        <div className="bg-gradient-to-r from-green-500/10 via-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{activeStage.stage}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle('active')} flex items-center gap-2`}>
                  {getStatusIcon('active')}
                  LIVE NOW
                </span>
                {activeStage.bonus > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    +{activeStage.bonus}% BONUS
                  </span>
                )}
              </div>
              <p className="text-gray-400">Current active presale stage â€¢ Ends on {activeStage.endDate}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">${activeStage.price.toFixed(2)}</div>
              <div className="text-sm text-gray-400 mt-1">per VNC token</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Allocation</div>
              <div className="text-xl font-bold text-white">{(activeStage.allocation / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-purple-400 mt-1">VNC Tokens</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Sold</div>
              <div className="text-xl font-bold text-white">{(activeStage.sold / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-green-400 mt-1">{((activeStage.sold / activeStage.allocation) * 100).toFixed(1)}% sold</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Remaining</div>
              <div className="text-xl font-bold text-white">{((activeStage.allocation - activeStage.sold) / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-orange-400 mt-1">{((1 - activeStage.sold / activeStage.allocation) * 100).toFixed(1)}% left</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Raised</div>
              <div className="text-xl font-bold text-white">${(activeStage.raised / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-blue-400 mt-1">This stage</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Range</div>
              <div className="text-xl font-bold text-white">${(activeStage.minPurchase / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-400 mt-1">Min: ${(activeStage.minPurchase / 1000).toFixed(0)}K - Max: ${(activeStage.maxPurchase / 1000).toFixed(0)}K</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Stage Progress</span>
              <span className="text-sm font-bold text-green-400">{((activeStage.sold / activeStage.allocation) * 100).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(activeStage.sold / activeStage.allocation) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-xl border border-purple-500/20 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <PieChart className="w-4 h-4" />
            Overview & Stats
          </div>
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'stages'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Stage Management
          </div>
        </button>
        <button
          onClick={() => setActiveTab('investors')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'investors'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Top Investors
          </div>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'settings'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-transparent text-gray-400 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Global Settings
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stage Progress Overview */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              All Stages Progress
            </h3>
            <div className="space-y-4">
              {presaleStages.map((stage) => (
                <div key={stage.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{stage.stage}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusStyle(stage.status)} flex items-center gap-1`}>
                        {getStatusIcon(stage.status)}
                        {stage.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">${stage.price.toFixed(2)} per token</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">${(stage.raised / 1000000).toFixed(2)}M raised</div>
                      <div className="text-gray-400 text-sm">{(stage.sold / 1000000).toFixed(1)}M / {(stage.allocation / 1000000).toFixed(1)}M tokens</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        stage.status === 'completed' ? 'bg-blue-500' :
                        stage.status === 'active' ? 'bg-green-500' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${(stage.sold / stage.allocation) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{stage.startDate} - {stage.endDate}</span>
                    <span>{((stage.sold / stage.allocation) * 100).toFixed(1)}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-gradient-to-br from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all text-left">
              <Play className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-lg font-bold text-white mb-1">Start Next Stage</div>
              <div className="text-sm text-gray-400">Activate Stage 4 when ready</div>
            </button>
            <button className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all text-left">
              <Plus className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-lg font-bold text-white mb-1">Create New Stage</div>
              <div className="text-sm text-gray-400">Add additional presale round</div>
            </button>
            <button className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all text-left">
              <Settings className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-lg font-bold text-white mb-1">Adjust Pricing</div>
              <div className="text-sm text-gray-400">Modify stage parameters</div>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'stages' && (
        <div className="space-y-6">
          {/* Add Stage Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAddStage(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Stage
            </button>
          </div>

          {/* Stages Management Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Stage</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Allocation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Raised</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Dates</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Bonus</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {presaleStages.map((stage) => (
                    <tr key={stage.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{stage.stage}</span>
                          {stage.visibility === 'public' ? (
                            <span title="Public"><Globe className="w-4 h-4 text-green-400" /></span>
                          ) : (
                            <span title="Private"><Lock className="w-4 h-4 text-orange-400" /></span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(stage.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(stage.status)}
                          {stage.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">${stage.price.toFixed(2)}</div>
                        <div className="text-gray-400 text-xs">per VNC</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{(stage.allocation / 1000000).toFixed(1)}M</div>
                        <div className="text-gray-400 text-xs">tokens</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">{((stage.sold / stage.allocation) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full ${
                                stage.status === 'completed' ? 'bg-blue-500' :
                                stage.status === 'active' ? 'bg-green-500' :
                                'bg-gray-600'
                              }`}
                              style={{ width: `${(stage.sold / stage.allocation) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">${(stage.raised / 1000000).toFixed(2)}M</div>
                        <div className="text-gray-400 text-xs">{(stage.sold / 1000000).toFixed(1)}M sold</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{stage.startDate}</div>
                        <div className="text-gray-400 text-xs">{stage.endDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        {stage.bonus > 0 ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">+{stage.bonus}%</span>
                        ) : (
                          <span className="text-gray-500 text-xs">No bonus</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditStage(stage)}
                            className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Edit Stage"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleViewStage(stage)}
                            className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {stage.status === 'active' ? (
                            <button 
                              onClick={() => handlePauseStage(stage.id)}
                              className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                              title="Pause Stage"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : stage.status === 'upcoming' || stage.status === 'paused' ? (
                            <button 
                              onClick={() => handlePlayStage(stage.id)}
                              className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                              title="Activate Stage"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          ) : null}
                          {stage.status !== 'completed' && (
                            <button 
                              onClick={() => handleDeleteStage(stage.id)}
                              className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete Stage"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investors' && (
        <div className="space-y-6">
          {/* Top Investors Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Investors Leaderboard
              </h3>
              <p className="text-gray-400 text-sm mt-1">Highest contributing investors in the presale</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Investor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Total Invested</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Tokens Owned</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Purchases</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Join Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {topInvestors.map((investor) => (
                    <tr key={investor.rank} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold text-sm">
                          {investor.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {investor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{investor.name}</div>
                            <div className="text-gray-400 text-xs">{investor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold text-lg">${(investor.invested / 1000).toFixed(0)}K</div>
                        <div className="text-green-400 text-xs">+{((investor.invested / globalStats.totalRaised) * 100).toFixed(2)}% of total</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-purple-400 font-bold">{(investor.tokens / 1000).toFixed(0)}K VNC</div>
                        <div className="text-gray-400 text-xs">{((investor.tokens / globalStats.totalSold) * 100).toFixed(2)}% owned</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{investor.purchases}</div>
                        <div className="text-gray-400 text-xs">transactions</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white text-sm">{investor.joinDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-semibold text-xs hover:bg-purple-500/30 transition-colors flex items-center gap-1">
                            <Wallet className="w-3 h-3" />
                            Wallet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Global Presale Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Global Presale Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Presale Status</label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Ended</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Default Payment Methods</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      INR (Bank Transfer/UPI)
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      Cryptocurrency (BTC, ETH, USDT)
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" className="w-4 h-4" />
                      Credit/Debit Card
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Auto Stage Transition</label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                    <option>Enabled - Auto advance when sold out</option>
                    <option>Manual - Require admin approval</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Token Distribution Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                Token Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Total Supply</label>
                  <input 
                    type="text" 
                    value={`${tokenDistribution.totalSupply.toLocaleString()} VNC`}
                    onChange={(e) => {
                      const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                      if (!isNaN(value)) {
                        setTokenDistribution({...tokenDistribution, totalSupply: value});
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500" 
                  />
                  <div className="text-xs text-gray-500 mt-1">10 Billion total tokens</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Presale Allocation</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${tokenDistribution.presaleAllocation.toLocaleString()} VNC`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(value)) {
                          const percentage = ((value / tokenDistribution.totalSupply) * 100).toFixed(1);
                          setTokenDistribution({...tokenDistribution, presaleAllocation: value, presalePercentage: parseFloat(percentage)});
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" 
                    />
                    <input 
                      type="text" 
                      value={`${tokenDistribution.presalePercentage}%`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(value)) {
                          const allocation = Math.round((value / 100) * tokenDistribution.totalSupply);
                          setTokenDistribution({...tokenDistribution, presaleAllocation: allocation, presalePercentage: value});
                        }
                      }}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500" 
                    />
                  </div>
                  <div className="text-xs text-purple-400 mt-1">30% of total supply for presale</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Team & Advisors</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${tokenDistribution.teamAdvisors.toLocaleString()} VNC`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(value)) {
                          const percentage = ((value / tokenDistribution.totalSupply) * 100).toFixed(1);
                          setTokenDistribution({...tokenDistribution, teamAdvisors: value, teamPercentage: parseFloat(percentage)});
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" 
                    />
                    <input 
                      type="text" 
                      value={`${tokenDistribution.teamPercentage}%`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(value)) {
                          const allocation = Math.round((value / 100) * tokenDistribution.totalSupply);
                          setTokenDistribution({...tokenDistribution, teamAdvisors: allocation, teamPercentage: value});
                        }
                      }}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Liquidity & Marketing</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${tokenDistribution.liquidityMarketing.toLocaleString()} VNC`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(value)) {
                          const percentage = ((value / tokenDistribution.totalSupply) * 100).toFixed(1);
                          setTokenDistribution({...tokenDistribution, liquidityMarketing: value, liquidityPercentage: parseFloat(percentage)});
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" 
                    />
                    <input 
                      type="text" 
                      value={`${tokenDistribution.liquidityPercentage}%`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(value)) {
                          const allocation = Math.round((value / 100) * tokenDistribution.totalSupply);
                          setTokenDistribution({...tokenDistribution, liquidityMarketing: allocation, liquidityPercentage: value});
                        }
                      }}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Ecosystem Development</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${tokenDistribution.ecosystem.toLocaleString()} VNC`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(value)) {
                          const percentage = ((value / tokenDistribution.totalSupply) * 100).toFixed(1);
                          setTokenDistribution({...tokenDistribution, ecosystem: value, ecosystemPercentage: parseFloat(percentage)});
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" 
                    />
                    <input 
                      type="text" 
                      value={`${tokenDistribution.ecosystemPercentage}%`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(value)) {
                          const allocation = Math.round((value / 100) * tokenDistribution.totalSupply);
                          setTokenDistribution({...tokenDistribution, ecosystem: allocation, ecosystemPercentage: value});
                        }
                      }}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Reserve Fund</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${tokenDistribution.reserve.toLocaleString()} VNC`}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''));
                        if (!isNaN(value)) {
                          const percentage = ((value / tokenDistribution.totalSupply) * 100).toFixed(1);
                          setTokenDistribution({...tokenDistribution, reserve: value, reservePercentage: parseFloat(percentage)});
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" 
                    />
                    <input 
                      type="text" 
                      value={`${tokenDistribution.reservePercentage}%`}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                        if (!isNaN(value)) {
                          const allocation = Math.round((value / 100) * tokenDistribution.totalSupply);
                          setTokenDistribution({...tokenDistribution, reserve: allocation, reservePercentage: value});
                        }
                      }}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:border-purple-500" 
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Allocated:</span>
                    <span className={`font-bold ${
                      (tokenDistribution.presalePercentage + tokenDistribution.teamPercentage + tokenDistribution.liquidityPercentage + tokenDistribution.ecosystemPercentage + tokenDistribution.reservePercentage) === 100 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {(tokenDistribution.presalePercentage + tokenDistribution.teamPercentage + tokenDistribution.liquidityPercentage + tokenDistribution.ecosystemPercentage + tokenDistribution.reservePercentage).toFixed(1)}%
                    </span>
                  </div>
                  {(tokenDistribution.presalePercentage + tokenDistribution.teamPercentage + tokenDistribution.liquidityPercentage + tokenDistribution.ecosystemPercentage + tokenDistribution.reservePercentage) !== 100 && (
                    <div className="text-xs text-red-400 mt-1">âš  Total must equal 100%</div>
                  )}
                </div>
              </div>
            </div>

            {/* Public Page Configuration */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Public Page Access
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Show Live Stats</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Allow Public Purchase</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Show Countdown Timer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Display Progress Bar</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* User Dashboard Integration */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                User Dashboard Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Purchase History</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Token Balance Display</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Referral System</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Vesting Schedule</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Settings Button */}
          <div className="flex justify-end gap-3">
            <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <X className="w-4 h-4" />
              Reset to Default
            </button>
            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" />
              Save All Settings
            </button>
          </div>
        </div>
      )}

      {/* Edit Stage Modal */}
      {editingStage && editFormData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-purple-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-400" />
                Edit {editFormData.stage}
              </h2>
              <button 
                onClick={() => { setEditingStage(null); setEditFormData(null); }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Stage Name</label>
                  <input
                    type="text"
                    value={editFormData.stage}
                    onChange={(e) => setEditFormData({...editFormData, stage: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Price ($ per VNC)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Allocation (tokens)</label>
                  <input
                    type="number"
                    value={editFormData.allocation}
                    onChange={(e) => setEditFormData({...editFormData, allocation: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">End Date</label>
                  <input
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Bonus (%)</label>
                  <input
                    type="number"
                    value={editFormData.bonus}
                    onChange={(e) => setEditFormData({...editFormData, bonus: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Visibility</label>
                  <select
                    value={editFormData.visibility}
                    onChange={(e) => setEditFormData({...editFormData, visibility: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Min Purchase ($)</label>
                  <input
                    type="number"
                    value={editFormData.minPurchase}
                    onChange={(e) => setEditFormData({...editFormData, minPurchase: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Purchase ($)</label>
                  <input
                    type="number"
                    value={editFormData.maxPurchase}
                    onChange={(e) => setEditFormData({...editFormData, maxPurchase: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Preview</h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400">Expected Raise</div>
                    <div className="text-white font-bold">${((editFormData.allocation * editFormData.price) / 1000000).toFixed(2)}M</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Tokens per $1000</div>
                    <div className="text-white font-bold">{(1000 / editFormData.price).toFixed(0)} VNC</div>
                  </div>
                  <div>
                    <div className="text-gray-400">With Bonus</div>
                    <div className="text-white font-bold">{((1000 / editFormData.price) * (1 + editFormData.bonus / 100)).toFixed(0)} VNC</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => { setEditingStage(null); setEditFormData(null); }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStage}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Stage Modal */}
      {viewingStage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const stage = presaleStages.find(s => s.id === viewingStage);
              if (!stage) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Eye className="w-6 h-6 text-purple-400" />
                        {stage.stage}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(stage.status)} flex items-center gap-1`}>
                          {getStatusIcon(stage.status)}
                          {stage.status.toUpperCase()}
                        </span>
                        {stage.visibility === 'public' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            PUBLIC
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            PRIVATE
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setViewingStage(null)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-4 border border-purple-500/20">
                        <DollarSign className="w-6 h-6 text-purple-400 mb-2" />
                        <div className="text-2xl font-bold text-white">${stage.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">Price per VNC</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-4 border border-blue-500/20">
                        <Coins className="w-6 h-6 text-blue-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{(stage.allocation / 1000000).toFixed(0)}M</div>
                        <div className="text-xs text-gray-400">Allocation</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg p-4 border border-green-500/20">
                        <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                        <div className="text-2xl font-bold text-white">${(stage.raised / 1000000).toFixed(0)}M</div>
                        <div className="text-xs text-gray-400">Raised</div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-4 border border-yellow-500/20">
                        <Award className="w-6 h-6 text-yellow-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{stage.bonus}%</div>
                        <div className="text-xs text-gray-400">Bonus</div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold">Stage Progress</span>
                        <span className="text-purple-400 font-bold">{((stage.sold / stage.allocation) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-purple-500 transition-all"
                          style={{ width: `${(stage.sold / stage.allocation) * 100}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Sold</div>
                          <div className="text-white font-bold">{(stage.sold / 1000000).toFixed(1)}M VNC</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Remaining</div>
                          <div className="text-white font-bold">{((stage.allocation - stage.sold) / 1000000).toFixed(1)}M VNC</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Expected Total</div>
                          <div className="text-white font-bold">${((stage.allocation * stage.price) / 1000000).toFixed(0)}M</div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Start Date</div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-400" />
                          {stage.startDate}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">End Date</div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-red-400" />
                          {stage.endDate}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Min Purchase</div>
                        <div className="text-white font-semibold">${stage.minPurchase.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Max Purchase</div>
                        <div className="text-white font-semibold">${stage.maxPurchase.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Purchase Examples */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-purple-400" />
                        Purchase Examples
                      </h3>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-gray-400">$10,000 buys</div>
                          <div className="text-white font-bold">{((10000 / stage.price) * (1 + stage.bonus / 100)).toFixed(0)} VNC</div>
                          <div className="text-purple-400 text-xs">with {stage.bonus}% bonus</div>
                        </div>
                        <div>
                          <div className="text-gray-400">$50,000 buys</div>
                          <div className="text-white font-bold">{((50000 / stage.price) * (1 + stage.bonus / 100)).toFixed(0)} VNC</div>
                          <div className="text-purple-400 text-xs">with {stage.bonus}% bonus</div>
                        </div>
                        <div>
                          <div className="text-gray-400">$100,000 buys</div>
                          <div className="text-white font-bold">{((100000 / stage.price) * (1 + stage.bonus / 100)).toFixed(0)} VNC</div>
                          <div className="text-purple-400 text-xs">with {stage.bonus}% bonus</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                    <button
                      onClick={() => setViewingStage(null)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setViewingStage(null);
                        handleEditStage(stage);
                      }}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Stage
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

