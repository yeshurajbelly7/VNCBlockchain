'use client';

import React, { useState } from 'react';
import {
  Gift,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Award,
  Star,
  Target,
  AlertCircle,
  Info,
} from 'lucide-react';

type AirdropStatus = 'eligible' | 'claimed' | 'vesting' | 'completed' | 'expired';
type VestingType = 'instant' | 'linear' | 'cliff';

interface UserAirdrop {
  id: string;
  campaignName: string;
  type: string;
  allocation: number;
  claimed: number;
  unlocked: number;
  locked: number;
  status: AirdropStatus;
  eligibleDate: string;
  claimDate?: string;
  vestingType: VestingType;
  vestingPeriod: number;
  instantUnlock: number;
  nextUnlockDate?: string;
  nextUnlockAmount?: number;
  progress: number;
}

export default function UserAirdropDashboard() {
  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'history'>('available');
  const [selectedAirdrop, setSelectedAirdrop] = useState<UserAirdrop | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Mock user airdrops data
  const userAirdrops: UserAirdrop[] = [
    {
      id: '1',
      campaignName: 'Signup + KYC Bonus',
      type: 'signup',
      allocation: 1000,
      claimed: 1000,
      unlocked: 250,
      locked: 750,
      status: 'vesting',
      eligibleDate: '2025-01-10',
      claimDate: '2025-01-12',
      vestingType: 'linear',
      vestingPeriod: 3,
      instantUnlock: 25,
      nextUnlockDate: '2025-02-12',
      nextUnlockAmount: 250,
      progress: 25,
    },
    {
      id: '2',
      campaignName: 'Presale Holder Airdrop',
      type: 'presale',
      allocation: 5000,
      claimed: 0,
      unlocked: 0,
      locked: 0,
      status: 'eligible',
      eligibleDate: '2025-01-15',
      vestingType: 'cliff',
      vestingPeriod: 6,
      instantUnlock: 20,
      progress: 0,
    },
    {
      id: '3',
      campaignName: 'Referral Reward',
      type: 'referral',
      allocation: 200,
      claimed: 200,
      unlocked: 100,
      locked: 100,
      status: 'vesting',
      eligibleDate: '2025-01-08',
      claimDate: '2025-01-09',
      vestingType: 'linear',
      vestingPeriod: 3,
      instantUnlock: 50,
      nextUnlockDate: '2025-02-09',
      nextUnlockAmount: 50,
      progress: 50,
    },
    {
      id: '4',
      campaignName: 'Trading Activity Bonus',
      type: 'activity',
      allocation: 3000,
      claimed: 0,
      unlocked: 0,
      locked: 0,
      status: 'eligible',
      eligibleDate: '2025-02-01',
      vestingType: 'instant',
      vestingPeriod: 0,
      instantUnlock: 100,
      progress: 0,
    },
  ];

  const availableAirdrops = userAirdrops.filter(a => a.status === 'eligible');
  const claimedAirdrops = userAirdrops.filter(a => a.status === 'vesting' || a.status === 'completed');

  const totalEligible = availableAirdrops.reduce((sum, a) => sum + a.allocation, 0);
  const totalClaimed = claimedAirdrops.reduce((sum, a) => sum + a.claimed, 0);
  const totalUnlocked = claimedAirdrops.reduce((sum, a) => sum + a.unlocked, 0);
  const totalLocked = claimedAirdrops.reduce((sum, a) => sum + a.locked, 0);

  const handleClaimAirdrop = (airdrop: UserAirdrop) => {
    setSelectedAirdrop(airdrop);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    // In real implementation, this would call the blockchain
    alert(`Claimed ${selectedAirdrop?.allocation} VNC from ${selectedAirdrop?.campaignName}!`);
    setShowClaimModal(false);
    setSelectedAirdrop(null);
  };

  const _getStatusColor = (status: AirdropStatus) => {
    switch (status) {
      case 'eligible':
        return 'text-green-400';
      case 'claimed':
        return 'text-blue-400';
      case 'vesting':
        return 'text-yellow-400';
      case 'completed':
        return 'text-purple-400';
      case 'expired':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const _getStatusIcon = (status: AirdropStatus) => {
    switch (status) {
      case 'eligible':
        return <Gift className="w-5 h-5" />;
      case 'claimed':
        return <CheckCircle className="w-5 h-5" />;
      case 'vesting':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <Star className="w-5 h-5" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">My Airdrops</h1>
          </div>
          <p className="text-gray-400">Claim your VNC token airdrops and track vesting schedules</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-semibold">Available to Claim</span>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalEligible.toLocaleString()}</div>
            <div className="text-sm text-gray-400">{availableAirdrops.length} airdrops</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm font-semibold">Total Claimed</span>
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalClaimed.toLocaleString()}</div>
            <div className="text-sm text-gray-400">VNC Tokens</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 text-sm font-semibold">Unlocked</span>
              <Unlock className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalUnlocked.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Ready to use</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 text-sm font-semibold">Locked (Vesting)</span>
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalLocked.toLocaleString()}</div>
            <div className="text-sm text-gray-400">In vesting</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'available'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Available ({availableAirdrops.length})
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'claimed'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Claimed ({claimedAirdrops.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'history'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            History
          </button>
        </div>

        {/* Available Airdrops Tab */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {availableAirdrops.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 text-center">
                <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Airdrops Available</h3>
                <p className="text-gray-400">Check back later for new airdrop opportunities!</p>
              </div>
            ) : (
              availableAirdrops.map((airdrop) => (
                <div
                  key={airdrop.id}
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">{airdrop.campaignName}</h3>
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">
                          ELIGIBLE
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">Eligible since {new Date(airdrop.eligibleDate).toLocaleDateString()}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-gray-400 text-sm mb-1">Allocation</div>
                          <div className="text-2xl font-bold text-white">{airdrop.allocation.toLocaleString()} VNC</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm mb-1">Instant Unlock</div>
                          <div className="text-2xl font-bold text-yellow-400">{airdrop.instantUnlock}%</div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-semibold text-purple-400">Vesting Details</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Type</div>
                            <div className="text-white font-semibold capitalize">{airdrop.vestingType}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Period</div>
                            <div className="text-white font-semibold">{airdrop.vestingPeriod} months</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Instant</div>
                            <div className="text-white font-semibold">{(airdrop.allocation * airdrop.instantUnlock / 100).toLocaleString()} VNC</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimAirdrop(airdrop)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Claim {airdrop.allocation.toLocaleString()} VNC
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Claimed Airdrops Tab */}
        {activeTab === 'claimed' && (
          <div className="space-y-4">
            {claimedAirdrops.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Claimed Airdrops</h3>
                <p className="text-gray-400">Your claimed airdrops will appear here</p>
              </div>
            ) : (
              claimedAirdrops.map((airdrop) => (
                <div
                  key={airdrop.id}
                  className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">{airdrop.campaignName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          airdrop.status === 'vesting' 
                            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                            : 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                        }`}>
                          {airdrop.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Claimed on {airdrop.claimDate ? new Date(airdrop.claimDate).toLocaleDateString() : 'N/A'}
                      </p>
                      
                      {/* Vesting Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Vesting Progress</span>
                          <span className="text-sm font-semibold text-white">{airdrop.progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${airdrop.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                          <div className="text-gray-400 text-xs mb-1">Total Claimed</div>
                          <div className="text-lg font-bold text-white">{airdrop.claimed.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">VNC</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                          <div className="text-gray-400 text-xs mb-1">Unlocked</div>
                          <div className="text-lg font-bold text-green-400">{airdrop.unlocked.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">VNC</div>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
                          <div className="text-gray-400 text-xs mb-1">Locked</div>
                          <div className="text-lg font-bold text-purple-400">{airdrop.locked.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">VNC</div>
                        </div>
                      </div>

                      {airdrop.status === 'vesting' && airdrop.nextUnlockDate && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">Next Unlock</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-bold">{airdrop.nextUnlockAmount?.toLocaleString()} VNC</div>
                              <div className="text-xs text-gray-400">on {new Date(airdrop.nextUnlockDate).toLocaleDateString()}</div>
                            </div>
                            <Unlock className="w-6 h-6 text-yellow-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Transaction History</h3>
            <p className="text-gray-400">Complete airdrop claim and vesting history will appear here</p>
          </div>
        )}

        {/* Educational Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">About VNC Airdrops</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• <strong className="text-white">Total Airdrop Pool:</strong> 500,000,000 VNC tokens allocated for community rewards</li>
                <li>• <strong className="text-white">Vesting:</strong> Most airdrops include vesting schedules to ensure long-term community alignment</li>
                <li>• <strong className="text-white">Instant Unlock:</strong> A percentage unlocks immediately upon claiming for immediate use</li>
                <li>• <strong className="text-white">Eligibility:</strong> Based on signup, KYC completion, presale participation, trading activity, or referrals</li>
                <li>• <strong className="text-white">Claim Period:</strong> Make sure to claim before the campaign end date</li>
                <li>• <strong className="text-white">On-Chain:</strong> All allocations and claims are recorded on the VNC blockchain for transparency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      {showClaimModal && selectedAirdrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Claim Airdrop</h3>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setSelectedAirdrop(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <AlertCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-gray-400 text-sm mb-2">You are claiming</div>
                <div className="text-4xl font-bold text-white mb-1">{selectedAirdrop.allocation.toLocaleString()}</div>
                <div className="text-purple-400 font-semibold">VNC Tokens</div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Campaign</span>
                  <span className="text-white font-semibold">{selectedAirdrop.campaignName}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Instant Unlock</span>
                  <span className="text-yellow-400 font-semibold">{selectedAirdrop.instantUnlock}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Immediately Available</span>
                  <span className="text-green-400 font-semibold">
                    {(selectedAirdrop.allocation * selectedAirdrop.instantUnlock / 100).toLocaleString()} VNC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vesting Period</span>
                  <span className="text-white font-semibold">{selectedAirdrop.vestingPeriod} months</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="mb-2">By claiming this airdrop, you agree to the vesting schedule. The remaining {100 - selectedAirdrop.instantUnlock}% will unlock over {selectedAirdrop.vestingPeriod} months.</p>
                  <p>This action will be recorded on the blockchain and cannot be reversed.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setSelectedAirdrop(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClaim}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
