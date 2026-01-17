'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Vote, Users, FileText, TrendingUp, Shield, ArrowRight, Wallet } from 'lucide-react'

export default function GovernancePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    setIsWalletConnected(true)
    alert('Wallet connected successfully! You can now vote on proposals.')
  }

  const handleViewProposal = (proposal: any) => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first to view proposal details and vote')
      setIsWalletConnected(true)
    } else {
      alert(`Opening proposal: ${proposal.id} - ${proposal.title}`)
      // In production, this would navigate to proposal detail page
    }
  }
  const proposals = [
    {
      id: 'VIP-042',
      title: 'Increase Block Size Limit to 8MB',
      status: 'Active',
      votesFor: 12450000,
      votesAgainst: 3200000,
      endsIn: '3 days',
      quorum: '78%'
    },
    {
      id: 'VIP-041',
      title: 'Reduce Transaction Fees by 25%',
      status: 'Passed',
      votesFor: 18900000,
      votesAgainst: 1100000,
      endsIn: 'Ended',
      quorum: '92%'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Vote className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">VNC Governance</h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-6 sm:mb-8">
              Shape the future of VNC-20. Vote on proposals and participate in network decisions.
            </p>
            <button 
              onClick={handleConnectWallet}
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Vote
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Active Proposals</h2>
          <div className="space-y-4 sm:space-y-6">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="card-gradient rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-primary-600">{proposal.id}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">{proposal.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold self-start ${
                    proposal.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">For</div>
                    <div className="font-bold text-green-600 text-sm sm:text-base">{(proposal.votesFor / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Against</div>
                    <div className="font-bold text-red-600 text-sm sm:text-base">{(proposal.votesAgainst / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Quorum</div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{proposal.quorum}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Ends</div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{proposal.endsIn}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewProposal(proposal)}
                  className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base inline-flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Vote className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Details & Vote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
