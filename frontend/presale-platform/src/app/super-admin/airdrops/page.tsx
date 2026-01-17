/**
 * VNC AIRDROP MANAGEMENT SYSTEM - SUPER ADMIN
 * 
 * A comprehensive, world-class airdrop management platform with features from top crypto platforms:
 * 
 * 🎯 CAMPAIGN TYPES (12 Types):
 * - Signup Bonus, Presale Holder Rewards, Referral Program, Trading Activity
 * - Social Media Campaigns, NFT Holder Rewards, Staking Rewards, Governance Participation
 * - Liquidity Mining, Contest/Competition, Custom Campaigns
 * 
 * 🔐 SECURITY & FRAUD DETECTION:
 * - IP Address Monitoring (max claims per IP)
 * - Device Fingerprinting (max claims per device)
 * - Wallet Clustering Detection (identify Sybil attacks)
 * - Behavioral Analysis (suspicious pattern detection)
 * - KYC Integration (verified identity requirement)
 * - Geographic Restrictions (compliance with regulations)
 * - Blacklist/Whitelist Management
 * 
 * 📊 ELIGIBILITY CRITERIA:
 * - Snapshot-based (specific block height/timestamp)
 * - Real-time verification (current wallet state)
 * - Minimum balance requirements
 * - Transaction count thresholds
 * - Account age verification
 * - Social task completion
 * - Custom criteria combinations
 * 
 * 💎 VESTING SCHEDULES:
 * - Instant unlock (100% immediate)
 * - Linear vesting (gradual release over time)
 * - Cliff vesting (delay then unlock)
 * - Milestone-based (event-triggered unlocks)
 * 
 * 🚀 DISTRIBUTION METHODS:
 * - Automatic (scheduled batch distribution)
 * - Manual (admin-triggered)
 * - Claim (user-initiated claiming)
 * - Merkle Tree (gas-optimized proofs)
 * 
 * 📈 ANALYTICS & METRICS:
 * - Conversion rate tracking
 * - ROI calculation per campaign
 * - User engagement metrics
 * - Gas cost optimization
 * - Performance comparison
 * - Real-time statistics
 * 
 * 💬 COMMUNICATION:
 * - Email notifications
 * - SMS alerts
 * - In-app announcements
 * - Webhook integrations
 * - Customizable templates
 * 
 * ⚙️ ADMIN CONTROLS:
 * - Create, Edit, Pause, Resume, Cancel campaigns
 * - Manual distribution triggers
 * - Real-time monitoring
 * - Fraud report review
 * - Export functionality
 * - Blockchain synchronization
 * 
 * 📋 COMPLIANCE:
 * - Transaction logging
 * - Audit trails
 * - Tax reporting support
 * - Regulatory compliance tools
 * - On-chain transparency
 */

'use client';

import React, { useState } from 'react';
import {
  Gift,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
  AlertTriangle,
  Target,
  BarChart3,
  Send,
  Eye,
  Settings,
  Shield,
  Award,
  Twitter,
  MessageCircle,
  Share2,
  FileText,
  Zap,
  Coins,
  Star,
  Globe,
  Activity,
  Wallet,
  UserCheck,
  Bell,
  Mail,
  Code,
  RefreshCw,
  Play,
  Pause,
  Percent,
  ShieldAlert,
  Fingerprint,
  UserX,
  CheckSquare,
  Square,
} from 'lucide-react';

type CampaignType = 'signup' | 'presale' | 'activity' | 'referral' | 'custom' | 'social' | 'nft' | 'staking' | 'governance' | 'trading' | 'liquidity' | 'contest';
type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'scheduled';
type VestingType = 'instant' | 'linear' | 'cliff' | 'milestone';
type DistributionMethod = 'manual' | 'automatic' | 'claim' | 'merkle';

interface SocialTask {
  id: string;
  platform: 'twitter' | 'telegram' | 'discord' | 'youtube' | 'medium';
  task: string;
  verificationUrl?: string;
  required: boolean;
  points: number;
}

interface EligibilityCriteria {
  minBalance?: number;
  minTransactions?: number;
  minAge?: number; // account age in days
  kycRequired: boolean;
  geographicRestrictions?: string[];
  blacklistedAddresses?: string[];
  whitelistedAddresses?: string[];
  snapshotDate?: string;
  customCriteria?: string;
}

interface VestingSchedule {
  type: VestingType;
  period: number; // in months
  instantUnlock: number; // percentage
  cliffPeriod?: number; // in months
  milestones?: {
    date: string;
    percentage: number;
    description: string;
  }[];
}

interface DistributionConfig {
  method: DistributionMethod;
  batchSize?: number;
  gasOptimization: boolean;
  merkleRoot?: string;
  autoDistribute: boolean;
  distributionSchedule?: string[]; // cron expressions
}

interface FraudDetection {
  enabled: boolean;
  maxClaimsPerIP: number;
  maxClaimsPerDevice: number;
  walletClusteringCheck: boolean;
  suspiciousActivityThreshold: number;
  manualReviewRequired: boolean;
}

interface CommunicationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppAnnouncements: boolean;
  webhookUrl?: string;
  templates: {
    eligibility: string;
    claim: string;
    vesting: string;
  };
}

interface AirdropCampaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  totalTokens: number;
  allocatedTokens: number;
  claimedTokens: number;
  reservedTokens: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  eligibleUsers: number;
  claimedUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  vestingSchedule: VestingSchedule;
  distributionConfig: DistributionConfig;
  eligibilityCriteria: EligibilityCriteria;
  socialTasks?: SocialTask[];
  fraudDetection: FraudDetection;
  communication: CommunicationSettings;
  minRequirement?: string;
  rewardPerUser: number;
  maxRewardPerUser?: number;
  conversionRate: number; // percentage of eligible users who claimed
  roi: number; // engagement metrics
  gasSpent: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

export default function AirdropManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics' | 'settings' | 'fraud' | 'eligibility'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_showDetailsModal, _setShowDetailsModal] = useState(false);
  const [_selectedCampaign, setSelectedCampaign] = useState<AirdropCampaign | null>(null);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  // Airdrop Pool Stats (500M VNC Total)
  const airdropStats = {
    totalPool: 500000000,
    allocated: 285000000,
    claimed: 125000000,
    remaining: 215000000,
    campaigns: {
      signup: { allocated: 100000000, claimed: 45000000 },
      presale: { allocated: 150000000, claimed: 65000000 },
      activity: { allocated: 100000000, claimed: 35000000 },
      referral: { allocated: 150000000, claimed: 25000000 },
    },
  };

  const campaigns: AirdropCampaign[] = [
    {
      id: '1',
      name: 'KYC Signup Bonus',
      description: 'Reward for completing KYC verification and account setup',
      type: 'signup',
      totalTokens: 50000000,
      allocatedTokens: 45000000,
      claimedTokens: 38000000,
      reservedTokens: 5000000,
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      eligibleUsers: 45000,
      claimedUsers: 38000,
      pendingUsers: 5000,
      rejectedUsers: 2000,
      vestingSchedule: {
        type: 'linear',
        period: 3,
        instantUnlock: 25,
      },
      distributionConfig: {
        method: 'automatic',
        batchSize: 100,
        gasOptimization: true,
        autoDistribute: true,
      },
      eligibilityCriteria: {
        kycRequired: true,
        minAge: 0,
      },
      fraudDetection: {
        enabled: true,
        maxClaimsPerIP: 3,
        maxClaimsPerDevice: 2,
        walletClusteringCheck: true,
        suspiciousActivityThreshold: 5,
        manualReviewRequired: false,
      },
      communication: {
        emailNotifications: true,
        smsNotifications: false,
        inAppAnnouncements: true,
        templates: {
          eligibility: 'You are eligible for KYC Bonus!',
          claim: 'Your tokens have been distributed',
          vesting: 'Your vested tokens are now unlocked',
        },
      },
      minRequirement: 'Complete KYC',
      rewardPerUser: 1000,
      maxRewardPerUser: 1000,
      conversionRate: 84.4,
      roi: 156.8,
      gasSpent: 2.5,
      priority: 'high',
      createdAt: '2024-12-01',
      updatedAt: '2025-01-15',
      createdBy: 'admin@vnc.com',
      tags: ['kyc', 'signup', 'onboarding'],
    },
    {
      id: '2',
      name: 'Presale Holder Reward',
      description: 'Loyalty reward for early presale participants',
      type: 'presale',
      totalTokens: 150000000,
      allocatedTokens: 150000000,
      claimedTokens: 65000000,
      reservedTokens: 0,
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      eligibleUsers: 15000,
      claimedUsers: 6500,
      pendingUsers: 8500,
      rejectedUsers: 0,
      vestingSchedule: {
        type: 'cliff',
        period: 6,
        instantUnlock: 20,
        cliffPeriod: 2,
      },
      distributionConfig: {
        method: 'merkle',
        gasOptimization: true,
        autoDistribute: false,
        merkleRoot: '0x1234...5678',
      },
      eligibilityCriteria: {
        kycRequired: true,
        minBalance: 50000,
        snapshotDate: '2025-01-15',
      },
      fraudDetection: {
        enabled: true,
        maxClaimsPerIP: 5,
        maxClaimsPerDevice: 3,
        walletClusteringCheck: true,
        suspiciousActivityThreshold: 10,
        manualReviewRequired: false,
      },
      communication: {
        emailNotifications: true,
        smsNotifications: true,
        inAppAnnouncements: true,
        templates: {
          eligibility: 'Presale holder rewards available!',
          claim: 'Claim your loyalty reward',
          vesting: 'Vesting schedule active',
        },
      },
      minRequirement: 'Hold ≥ 50,000 VNC',
      rewardPerUser: 10000,
      maxRewardPerUser: 50000,
      conversionRate: 43.3,
      roi: 234.5,
      gasSpent: 5.8,
      priority: 'high',
      createdAt: '2024-12-15',
      updatedAt: '2025-01-16',
      createdBy: 'admin@vnc.com',
      tags: ['presale', 'loyalty', 'holder'],
    },
    {
      id: '3',
      name: 'Referral Rewards Pool',
      description: 'Earn tokens by inviting new users to the platform',
      type: 'referral',
      totalTokens: 150000000,
      allocatedTokens: 25000000,
      claimedTokens: 18000000,
      reservedTokens: 125000000,
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      eligibleUsers: 125000,
      claimedUsers: 90000,
      pendingUsers: 30000,
      rejectedUsers: 5000,
      vestingSchedule: {
        type: 'linear',
        period: 3,
        instantUnlock: 50,
      },
      distributionConfig: {
        method: 'automatic',
        batchSize: 50,
        gasOptimization: true,
        autoDistribute: true,
      },
      eligibilityCriteria: {
        kycRequired: true,
        minTransactions: 1,
      },
      fraudDetection: {
        enabled: true,
        maxClaimsPerIP: 10,
        maxClaimsPerDevice: 5,
        walletClusteringCheck: true,
        suspiciousActivityThreshold: 20,
        manualReviewRequired: true,
      },
      communication: {
        emailNotifications: true,
        smsNotifications: false,
        inAppAnnouncements: true,
        templates: {
          eligibility: 'Referral rewards available',
          claim: 'Your referral reward is ready',
          vesting: 'Referral tokens vesting',
        },
      },
      minRequirement: 'Refer user buying ≥ 10,000 VNC',
      rewardPerUser: 200,
      maxRewardPerUser: 50000,
      conversionRate: 72.0,
      roi: 298.7,
      gasSpent: 1.8,
      priority: 'high',
      createdAt: '2024-12-01',
      updatedAt: '2025-01-17',
      createdBy: 'admin@vnc.com',
      tags: ['referral', 'growth', 'viral'],
    },
    {
      id: '4',
      name: 'Trading Activity Bonus',
      description: 'Rewards for active traders on the platform',
      type: 'trading',
      totalTokens: 100000000,
      allocatedTokens: 35000000,
      claimedTokens: 22000000,
      reservedTokens: 65000000,
      status: 'active',
      startDate: '2025-02-01',
      endDate: '2025-12-31',
      eligibleUsers: 8750,
      claimedUsers: 5500,
      pendingUsers: 3000,
      rejectedUsers: 250,
      vestingSchedule: {
        type: 'instant',
        period: 0,
        instantUnlock: 100,
      },
      distributionConfig: {
        method: 'claim',
        gasOptimization: true,
        autoDistribute: false,
      },
      eligibilityCriteria: {
        kycRequired: true,
        minTransactions: 10,
        minBalance: 1000,
      },
      fraudDetection: {
        enabled: true,
        maxClaimsPerIP: 2,
        maxClaimsPerDevice: 1,
        walletClusteringCheck: true,
        suspiciousActivityThreshold: 3,
        manualReviewRequired: false,
      },
      communication: {
        emailNotifications: true,
        smsNotifications: true,
        inAppAnnouncements: true,
        templates: {
          eligibility: 'Trading bonus available!',
          claim: 'Claim your trading rewards',
          vesting: 'N/A',
        },
      },
      minRequirement: 'Trade volume ≥ 100,000 VNC',
      rewardPerUser: 4000,
      maxRewardPerUser: 20000,
      conversionRate: 62.9,
      roi: 187.3,
      gasSpent: 3.2,
      priority: 'medium',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-17',
      createdBy: 'admin@vnc.com',
      tags: ['trading', 'activity', 'engagement'],
    },
    {
      id: '5',
      name: 'Social Media Campaign',
      description: 'Complete social tasks to earn rewards',
      type: 'social',
      totalTokens: 50000000,
      allocatedTokens: 30000000,
      claimedTokens: 12000000,
      reservedTokens: 20000000,
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      eligibleUsers: 60000,
      claimedUsers: 12000,
      pendingUsers: 45000,
      rejectedUsers: 3000,
      vestingSchedule: {
        type: 'linear',
        period: 2,
        instantUnlock: 30,
      },
      distributionConfig: {
        method: 'manual',
        batchSize: 200,
        gasOptimization: true,
        autoDistribute: false,
      },
      eligibilityCriteria: {
        kycRequired: false,
        minAge: 1,
      },
      socialTasks: [
        { id: '1', platform: 'twitter', task: 'Follow @VNC_Blockchain', required: true, points: 100 },
        { id: '2', platform: 'twitter', task: 'Retweet pinned post', required: true, points: 150 },
        { id: '3', platform: 'telegram', task: 'Join official channel', required: true, points: 100 },
        { id: '4', platform: 'discord', task: 'Join Discord server', required: false, points: 200 },
        { id: '5', platform: 'medium', task: 'Read and clap article', required: false, points: 50 },
      ],
      fraudDetection: {
        enabled: true,
        maxClaimsPerIP: 3,
        maxClaimsPerDevice: 2,
        walletClusteringCheck: false,
        suspiciousActivityThreshold: 5,
        manualReviewRequired: true,
      },
      communication: {
        emailNotifications: false,
        smsNotifications: false,
        inAppAnnouncements: true,
        templates: {
          eligibility: 'Complete tasks to earn',
          claim: 'Social rewards claimed',
          vesting: 'Tokens vesting',
        },
      },
      minRequirement: 'Complete 3/5 social tasks',
      rewardPerUser: 500,
      maxRewardPerUser: 2000,
      conversionRate: 20.0,
      roi: 412.6,
      gasSpent: 1.2,
      priority: 'medium',
      createdAt: '2024-12-20',
      updatedAt: '2025-01-17',
      createdBy: 'marketing@vnc.com',
      tags: ['social', 'marketing', 'community'],
    },
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleEditCampaign = (campaign: AirdropCampaign) => {
    setSelectedCampaign(campaign);
    alert(`Edit campaign: ${campaign.name}`);
  };

  const handleViewDetails = (campaign: AirdropCampaign) => {
    setSelectedCampaign(campaign);
    setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id);
  };

  const handlePauseCampaign = (id: string) => {
    alert(`Campaign ${id} paused`);
  };

  const handleResumeCampaign = (id: string) => {
    alert(`Campaign ${id} resumed`);
  };

  const handleCancelCampaign = (id: string) => {
    if (confirm('Are you sure you want to cancel this campaign? This action cannot be undone.')) {
      alert(`Campaign ${id} cancelled`);
    }
  };

  const handleDistributeNow = (id: string) => {
    if (confirm('Distribute tokens to all eligible users now?')) {
      alert(`Distributing tokens for campaign ${id}`);
    }
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: CampaignType) => {
    switch (type) {
      case 'signup': return <Users className="w-5 h-5" />;
      case 'presale': return <DollarSign className="w-5 h-5" />;
      case 'activity': return <TrendingUp className="w-5 h-5" />;
      case 'trading': return <BarChart3 className="w-5 h-5" />;
      case 'referral': return <Award className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'nft': return <Gift className="w-5 h-5" />;
      case 'staking': return <Coins className="w-5 h-5" />;
      case 'governance': return <Shield className="w-5 h-5" />;
      case 'liquidity': return <Activity className="w-5 h-5" />;
      case 'contest': return <Star className="w-5 h-5" />;
      case 'custom': return <Target className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const _getTypeColor = (type: CampaignType) => {
    switch (type) {
      case 'signup': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'presale': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'activity': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'trading': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'referral': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'social': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'nft': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'staking': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'governance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'liquidity': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'contest': return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-red-500/20 text-red-400',
    };
    return colors[priority];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Gift className="w-10 h-10 text-purple-400" />
              Airdrop Campaign Management
            </h1>
            <p className="text-gray-400">Manage 500M VNC Token Distribution & Rewards</p>
          </div>
          <button
            onClick={handleCreateCampaign}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        {/* Airdrop Pool Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Total Airdrop Pool</div>
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {airdropStats.totalPool.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">VNC Tokens</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Claimed</div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {airdropStats.claimed.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {((airdropStats.claimed / airdropStats.totalPool) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Allocated</div>
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {airdropStats.allocated.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {((airdropStats.allocated / airdropStats.totalPool) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Remaining</div>
              <Unlock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {airdropStats.remaining.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {((airdropStats.remaining / airdropStats.totalPool) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Allocation by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(airdropStats.campaigns).map(([type, stats]) => (
              <div key={type} className="bg-gray-900/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getTypeIcon(type as CampaignType)}
                  <div className="text-sm font-semibold text-white capitalize">{type}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Allocated:</span>
                    <span className="text-blue-400 font-semibold">
                      {(stats.allocated / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Claimed:</span>
                    <span className="text-green-400 font-semibold">
                      {(stats.claimed / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
                      style={{ width: `${(stats.claimed / stats.allocated) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {((stats.claimed / stats.allocated) * 100).toFixed(1)}% claimed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'campaigns', label: 'Campaigns', icon: Gift },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'fraud', label: 'Fraud Detection', icon: ShieldAlert },
            { id: 'eligibility', label: 'Eligibility', icon: UserCheck },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none appearance-none min-w-[150px]"
                >
                  <option value="all">All Types</option>
                  <option value="signup">Signup</option>
                  <option value="presale">Presale</option>
                  <option value="referral">Referral</option>
                  <option value="trading">Trading</option>
                  <option value="social">Social</option>
                  <option value="activity">Activity</option>
                  <option value="staking">Staking</option>
                  <option value="governance">Governance</option>
                  <option value="nft">NFT</option>
                  <option value="liquidity">Liquidity</option>
                  <option value="contest">Contest</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none appearance-none min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white hover:border-purple-500 transition-colors flex items-center gap-2 whitespace-nowrap">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Total Campaigns</div>
                <div className="text-2xl font-bold text-white">{filteredCampaigns.length}</div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <div className="text-xs text-gray-400 mb-1">Active</div>
                <div className="text-2xl font-bold text-green-400">
                  {filteredCampaigns.filter(c => c.status === 'active').length}
                </div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-xs text-gray-400 mb-1">Paused</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredCampaigns.filter(c => c.status === 'paused').length}
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                <div className="text-xs text-gray-400 mb-1">Scheduled</div>
                <div className="text-2xl font-bold text-blue-400">
                  {filteredCampaigns.filter(c => c.status === 'scheduled').length}
                </div>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <div className="text-xs text-gray-400 mb-1">Completed</div>
                <div className="text-2xl font-bold text-purple-400">
                  {filteredCampaigns.filter(c => c.status === 'completed').length}
                </div>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{campaign.minRequirement}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Total Tokens</div>
                            <div className="text-sm font-semibold text-white">
                              {(campaign.totalTokens / 1000000).toFixed(1)}M VNC
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Claimed</div>
                            <div className="text-sm font-semibold text-green-400">
                              {(campaign.claimedTokens / 1000000).toFixed(1)}M VNC
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Eligible Users</div>
                            <div className="text-sm font-semibold text-white">
                              {campaign.eligibleUsers.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Claimed Users</div>
                            <div className="text-sm font-semibold text-blue-400">
                              {campaign.claimedUsers.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Progress</span>
                            <span>{((campaign.claimedTokens / campaign.totalTokens) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
                              style={{ width: `${(campaign.claimedTokens / campaign.totalTokens) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {campaign.startDate} - {campaign.endDate}
                          </div>
                          <div className="flex items-center gap-1">
                            {campaign.vestingSchedule.type === 'instant' ? (
                              <>
                                <Unlock className="w-4 h-4" />
                                Instant Unlock
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                {campaign.vestingSchedule.instantUnlock}% instant, {campaign.vestingSchedule.period}mo vesting
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            ROI: {campaign.roi.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(campaign)}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {expandedCampaign === campaign.id ? 'Hide' : 'View'}
                      </button>
                      <button
                        onClick={() => handleEditCampaign(campaign)}
                        className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:border-purple-500 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      {campaign.status === 'active' ? (
                        <>
                          <button
                            onClick={() => handlePauseCampaign(campaign.id)}
                            className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-colors flex items-center gap-2"
                          >
                            <Pause className="w-4 h-4" />
                            Pause
                          </button>
                          {campaign.distributionConfig.method !== 'automatic' && (
                            <button
                              onClick={() => handleDistributeNow(campaign.id)}
                              className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Distribute
                            </button>
                          )}
                        </>
                      ) : campaign.status === 'paused' ? (
                        <button
                          onClick={() => handleResumeCampaign(campaign.id)}
                          className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Resume
                        </button>
                      ) : null}
                      {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelCampaign(campaign.id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Campaign Details */}
                  {expandedCampaign === campaign.id && (
                    <div className="mt-6 pt-6 border-t border-gray-700 space-y-6">
                      {/* Detailed Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            User Metrics
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Eligible:</span>
                              <span className="text-white font-semibold">{campaign.eligibleUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Claimed:</span>
                              <span className="text-green-400 font-semibold">{campaign.claimedUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Pending:</span>
                              <span className="text-yellow-400 font-semibold">{campaign.pendingUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Rejected:</span>
                              <span className="text-red-400 font-semibold">{campaign.rejectedUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-700">
                              <span className="text-gray-500">Conversion:</span>
                              <span className="text-purple-400 font-semibold">{campaign.conversionRate.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Token Distribution
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Per User:</span>
                              <span className="text-white font-semibold">{campaign.rewardPerUser.toLocaleString()} VNC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Max Per User:</span>
                              <span className="text-blue-400 font-semibold">{campaign.maxRewardPerUser?.toLocaleString() || 'N/A'} VNC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Reserved:</span>
                              <span className="text-yellow-400 font-semibold">{(campaign.reservedTokens / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Gas Spent:</span>
                              <span className="text-orange-400 font-semibold">{campaign.gasSpent} ETH</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-700">
                              <span className="text-gray-500">Method:</span>
                              <span className="text-cyan-400 font-semibold capitalize">{campaign.distributionConfig.method}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Security & Compliance
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">KYC Required:</span>
                              {campaign.eligibilityCriteria.kycRequired ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Fraud Detection:</span>
                              {campaign.fraudDetection.enabled ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Manual Review:</span>
                              {campaign.fraudDetection.manualReviewRequired ? (
                                <CheckCircle className="w-4 h-4 text-yellow-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Max Claims/IP:</span>
                              <span className="text-white font-semibold">{campaign.fraudDetection.maxClaimsPerIP}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-700">
                              <span className="text-gray-500">Priority:</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(campaign.priority)}`}>
                                {campaign.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vesting Schedule Details */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-400" />
                          Vesting Schedule
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 mb-1">Type</div>
                            <div className="text-white font-semibold capitalize">{campaign.vestingSchedule.type}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Period</div>
                            <div className="text-white font-semibold">{campaign.vestingSchedule.period} months</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Instant Unlock</div>
                            <div className="text-green-400 font-semibold">{campaign.vestingSchedule.instantUnlock}%</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Cliff Period</div>
                            <div className="text-white font-semibold">{campaign.vestingSchedule.cliffPeriod || 0} months</div>
                          </div>
                        </div>
                      </div>

                      {/* Social Tasks (if applicable) */}
                      {campaign.socialTasks && campaign.socialTasks.length > 0 && (
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-pink-400" />
                            Social Tasks ({campaign.socialTasks.length})
                          </h4>
                          <div className="space-y-2">
                            {campaign.socialTasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                                <div className="flex items-center gap-3">
                                  {task.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-400" />}
                                  {task.platform === 'telegram' && <Send className="w-4 h-4 text-blue-400" />}
                                  {task.platform === 'discord' && <MessageCircle className="w-4 h-4 text-indigo-400" />}
                                  {task.platform === 'youtube' && <Play className="w-4 h-4 text-red-400" />}
                                  {task.platform === 'medium' && <FileText className="w-4 h-4 text-gray-400" />}
                                  <div>
                                    <div className="text-sm text-white">{task.task}</div>
                                    <div className="text-xs text-gray-500">
                                      {task.required ? 'Required' : 'Optional'} • {task.points} points
                                    </div>
                                  </div>
                                </div>
                                {task.required ? (
                                  <CheckSquare className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Communication Settings */}
                      <div className="bg-gray-900/50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-yellow-400" />
                          Communication Channels
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            campaign.communication.emailNotifications 
                              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                              : 'bg-gray-800/50 border border-gray-700 text-gray-500'
                          }`}>
                            <Mail className="w-4 h-4" />
                            Email
                          </div>
                          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            campaign.communication.smsNotifications 
                              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                              : 'bg-gray-800/50 border border-gray-700 text-gray-500'
                          }`}>
                            <MessageCircle className="w-4 h-4" />
                            SMS
                          </div>
                          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            campaign.communication.inAppAnnouncements 
                              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                              : 'bg-gray-800/50 border border-gray-700 text-gray-500'
                          }`}>
                            <Bell className="w-4 h-4" />
                            In-App
                          </div>
                        </div>
                      </div>

                      {/* Campaign Tags */}
                      <div className="flex flex-wrap gap-2">
                        {campaign.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Admin Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-700">
                        <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2 text-sm">
                          <Download className="w-4 h-4" />
                          Export Users
                        </button>
                        <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center gap-2 text-sm">
                          <Code className="w-4 h-4" />
                          View Contract
                        </button>
                        <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2 text-sm">
                          <RefreshCw className="w-4 h-4" />
                          Sync Blockchain
                        </button>
                        <button className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 hover:bg-orange-500/30 transition-colors flex items-center gap-2 text-sm">
                          <ShieldAlert className="w-4 h-4" />
                          View Fraud Reports
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No campaigns found</p>
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Airdrop System Overview
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Total Airdrop Pool:</strong> 500,000,000 VNC tokens allocated for ecosystem rewards and user acquisition.
                </p>
                <p>
                  <strong className="text-white">Distribution Strategy:</strong> Multi-tier approach targeting KYC signups, presale holders, active traders, and referral rewards.
                </p>
                <p>
                  <strong className="text-white">Security Measures:</strong> All airdrops include vesting schedules to prevent market dumps. Admin controls allow pause/resume functionality.
                </p>
                <p>
                  <strong className="text-white">Transparency:</strong> All allocations are recorded on-chain and visible in the blockchain explorer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Active Campaigns
                </h3>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {campaigns.filter(c => c.status === 'active').length}
                </div>
                <p className="text-sm text-gray-400">Currently distributing tokens</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Total Participants
                </h3>
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {campaigns.reduce((sum, c) => sum + c.claimedUsers, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-400">Users who claimed airdrops</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• All airdrop campaigns must be approved before going live</li>
                    <li>• Vesting schedules cannot be modified after campaign activation</li>
                    <li>• Cancelled campaigns will return unused tokens to the pool</li>
                    <li>• All actions are logged and auditable on the blockchain</li>
                    <li>• Fraud detection systems monitor for suspicious claim patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Total Claims</div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {campaigns.reduce((sum, c) => sum + c.claimedUsers, 0).toLocaleString()}
                </div>
                <div className="text-xs text-green-400">+12.5% this month</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Avg Conversion</div>
                  <Percent className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {(campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length).toFixed(1)}%
                </div>
                <div className="text-xs text-blue-400">Above industry avg</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Avg ROI</div>
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(1)}%
                </div>
                <div className="text-xs text-purple-400">Excellent performance</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Total Gas</div>
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {campaigns.reduce((sum, c) => sum + c.gasSpent, 0).toFixed(1)} ETH
                </div>
                <div className="text-xs text-orange-400">Optimized</div>
              </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Campaign Performance Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Campaign</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Claims</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Conversion</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">ROI</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Gas</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="py-3 px-4 text-sm text-white">{campaign.name}</td>
                        <td className="py-3 px-4 text-sm text-right text-green-400">{campaign.claimedUsers.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-right text-blue-400">{campaign.conversionRate.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-sm text-right text-purple-400">{campaign.roi.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-sm text-right text-orange-400">{campaign.gasSpent} ETH</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  User Engagement by Type
                </h3>
                <div className="space-y-3">
                  {['signup', 'presale', 'referral', 'trading', 'social'].map((type) => {
                    const typeCampaigns = campaigns.filter(c => c.type === type);
                    const totalClaimed = typeCampaigns.reduce((sum, c) => sum + c.claimedUsers, 0);
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 capitalize">{type}</span>
                          <span className="text-white font-semibold">{totalClaimed.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
                            style={{ width: `${(totalClaimed / 180000) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Distribution Methods
                </h3>
                <div className="space-y-4">
                  {['automatic', 'claim', 'merkle', 'manual'].map((method) => {
                    const count = campaigns.filter(c => c.distributionConfig.method === method).length;
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-gray-400 capitalize">{method}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{count} campaigns</span>
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full h-2"
                              style={{ width: `${(count / campaigns.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Detection Tab */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Clean Claims</div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">98.7%</div>
                <div className="text-xs text-gray-500">No issues detected</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Under Review</div>
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">127</div>
                <div className="text-xs text-gray-500">Pending manual review</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-red-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Blocked</div>
                  <UserX className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-red-400 mb-1">43</div>
                <div className="text-xs text-gray-500">Fraudulent attempts</div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                Fraud Detection Rules
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">IP Address Monitoring</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">Max 3-5 claims per IP address across all campaigns</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-semibold">Wallet Clustering Detection</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">Identifies wallets controlled by the same entity using on-chain analysis</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">KYC Verification</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">Requires verified identity for high-value campaigns</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-orange-400" />
                      <span className="text-white font-semibold">Behavioral Analysis</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">Monitors claim patterns and flags suspicious behavior</p>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-semibold">Geographic Restrictions</span>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Configured</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">Blocks claims from restricted jurisdictions</p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Recent Fraud Alerts</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between items-center bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Multiple claims from same IP: 192.168.1.100</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300">Review</button>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-yellow-400" />
                        <span>Wallet clustering detected: 0x1234...5678 and 3 others</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300">Review</button>
                    </div>
                    <div className="flex justify-between items-center bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-orange-400" />
                        <span>Suspicious claim velocity: 50 claims in 5 minutes</span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300">Review</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Eligibility Tab */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-400" />
                Eligibility Criteria Manager
              </h3>
              <p className="text-gray-400 mb-6">
                Configure eligibility requirements for airdrop campaigns. Multiple criteria can be combined for precise targeting.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Snapshot-based Eligibility */}
                <div className="bg-gray-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">Snapshot-Based</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Capture wallet balances and on-chain data at a specific block height or timestamp.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Used in:</span>
                      <span className="text-blue-400">{campaigns.filter(c => c.eligibilityCriteria.snapshotDate).length} campaigns</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors">
                      Create Snapshot
                    </button>
                  </div>
                </div>

                {/* Real-time Eligibility */}
                <div className="bg-gray-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="w-6 h-6 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Real-Time</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Check eligibility criteria dynamically at claim time based on current wallet state.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Used in:</span>
                      <span className="text-green-400">{campaigns.filter(c => !c.eligibilityCriteria.snapshotDate).length} campaigns</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors">
                      Configure Rules
                    </button>
                  </div>
                </div>

                {/* Whitelist */}
                <div className="bg-gray-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckSquare className="w-6 h-6 text-purple-400" />
                    <h4 className="text-lg font-semibold text-white">Whitelist</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Pre-approved list of wallet addresses eligible for the airdrop.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total addresses:</span>
                      <span className="text-purple-400">12,458</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors">
                      Manage Whitelist
                    </button>
                  </div>
                </div>

                {/* Blacklist */}
                <div className="bg-gray-900/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <UserX className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-semibold text-white">Blacklist</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Blocked addresses that are ineligible for any airdrops.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Blocked addresses:</span>
                      <span className="text-red-400">87</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                      Manage Blacklist
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Criteria */}
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Common Eligibility Criteria</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Minimum Balance</div>
                  <div className="text-2xl font-bold text-white">1,000 VNC</div>
                  <div className="text-xs text-gray-500 mt-1">Most common threshold</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Min Transactions</div>
                  <div className="text-2xl font-bold text-white">5 txns</div>
                  <div className="text-xs text-gray-500 mt-1">Active user threshold</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Account Age</div>
                  <div className="text-2xl font-bold text-white">30 days</div>
                  <div className="text-xs text-gray-500 mt-1">Anti-sybil measure</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Global Airdrop Settings
              </h3>
              
              <div className="space-y-6">
                {/* Distribution Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-400" />
                    Distribution Settings
                  </h4>
                  <div className="space-y-4 bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">Auto-distribute on eligibility</div>
                        <div className="text-xs text-gray-400">Automatically send tokens when users become eligible</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">Gas optimization mode</div>
                        <div className="text-xs text-gray-400">Bundle transactions to reduce gas costs</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">Batch processing</div>
                        <div className="text-xs text-gray-400">Process claims in batches</div>
                      </div>
                      <select className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm">
                        <option>50 per batch</option>
                        <option>100 per batch</option>
                        <option>200 per batch</option>
                        <option>500 per batch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-400" />
                    Notification Settings
                  </h4>
                  <div className="space-y-4 bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">Email notifications</div>
                        <div className="text-xs text-gray-400">Send email when users become eligible</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">SMS notifications</div>
                        <div className="text-xs text-gray-400">Send SMS for high-value airdrops</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">In-app announcements</div>
                        <div className="text-xs text-gray-400">Show banner notifications in platform</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    Security & Compliance
                  </h4>
                  <div className="space-y-4 bg-gray-900/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">Require KYC by default</div>
                        <div className="text-xs text-gray-400">New campaigns require KYC verification</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">Enable fraud detection</div>
                        <div className="text-xs text-gray-400">Activate all fraud prevention mechanisms</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div>
                        <div className="text-sm font-semibold text-white">Geographic restrictions</div>
                        <div className="text-xs text-gray-400">Block claims from restricted countries</div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                  <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-purple-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Create Airdrop Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-400 mb-6">Campaign creation form will be implemented here...</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
