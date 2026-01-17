'use client'

import { useState } from 'react'
import { TrendingUp, Shield, Wallet, ArrowRight } from 'lucide-react'

export default function StakingPage() {
  const [stakingAmount, setStakingAmount] = useState('1000')
  const [lockPeriod, setLockPeriod] = useState('90')
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleStartStaking = () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet to start staking')
      setIsWalletConnected(true)
    } else {
      alert(`Staking ${stakingAmount} VNC for ${lockPeriod} days`)
    }
  }

  const handleSelectPlan = (tier: any) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet to select a plan')
      setIsWalletConnected(true)
    } else {
      alert(`Selected ${tier.name} plan with ${tier.apy} APY`)
    }
  }

  const stakingTiers = [
    {
      name: 'Flexible',
      apy: '8-12%',
      lockPeriod: 'None',
      minStake: '100 VNC',
      features: ['Unstake anytime', 'Daily rewards', 'No penalties'],
      recommended: false
    },
    {
      name: 'Standard',
      apy: '15-20%',
      lockPeriod: '90 days',
      minStake: '1,000 VNC',
      features: ['Higher rewards', 'Governance rights', 'Quarterly bonuses'],
      recommended: true
    },
    {
      name: 'Premium',
      apy: '25-35%',
      lockPeriod: '180 days',
      minStake: '10,000 VNC',
      features: ['Maximum APY', 'Priority support', 'Validator eligibility'],
      recommended: false
    }
  ]

  const calculateRewards = () => {
    const amount = parseFloat(stakingAmount) || 0
    const period = parseInt(lockPeriod) || 0
    const apy = period >= 180 ? 0.30 : period >= 90 ? 0.175 : 0.10
    const dailyReward = (amount * apy) / 365
    const totalReward = dailyReward * period
    return {
      daily: dailyReward.toFixed(2),
      total: totalReward.toFixed(2),
      apy: (apy * 100).toFixed(1)
    }
  }

  const rewards = calculateRewards()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full mb-4 sm:mb-6">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">VNC Staking</h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8">
              Earn rewards by securing the network. Up to 35% APY available.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold mb-2">$124M+</div>
                <div className="text-sm sm:text-base text-primary-100">Total Value Locked</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold mb-2">15,234</div>
                <div className="text-sm sm:text-base text-primary-100">Active Stakers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-bold mb-2">Up to 35%</div>
                <div className="text-sm sm:text-base text-primary-100">Maximum APY</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Staking Calculator
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Estimate your staking rewards
              </p>
            </div>

            <div className="card-gradient rounded-xl p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Staking Amount (VNC)
                  </label>
                  <input
                    type="number"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lock Period (Days)
                  </label>
                  <select
                    value={lockPeriod}
                    onChange={(e) => setLockPeriod(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 outline-none"
                  >
                    <option value="0">Flexible (No lock)</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="365">365 Days</option>
                  </select>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 sm:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated APY</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary-600">{rewards.apy}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Rewards</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{rewards.daily} VNC</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Rewards</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{rewards.total} VNC</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStartStaking}
                className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg inline-flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Start Staking
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Choose Your Staking Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Different lock periods, different rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {stakingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`card-gradient rounded-xl p-6 sm:p-8 ${tier.recommended ? 'ring-4 ring-primary-500 relative' : ''} hover:scale-105 transition-transform`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Recommended
                    </div>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">{tier.apy}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Annual Percentage Yield</div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lock Period</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{tier.lockPeriod}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Minimum Stake</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{tier.minStake}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                      <ArrowRight className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleSelectPlan(tier)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center ${
                    tier.recommended
                      ? 'btn-primary hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
