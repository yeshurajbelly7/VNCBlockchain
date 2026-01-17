'use client'

import { Check, Circle, Clock } from 'lucide-react'

export default function Roadmap() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      quarter: 'Q1 2024',
      status: 'completed',
      items: [
        'Whitepaper completion',
        'Core team formation',
        'Architecture design',
        'Proof-of-concept development'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Development',
      quarter: 'Q2 2024',
      status: 'completed',
      items: [
        'Consensus mechanism implementation',
        'Parallel execution engine',
        'Smart contract standards',
        'Developer tools and SDKs'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Testnet Launch',
      quarter: 'Q3 2024',
      status: 'current',
      items: [
        'Public testnet launch',
        'Validator onboarding program',
        'Bug bounty program',
        'Community testing and feedback'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'Mainnet Preparation',
      quarter: 'Q4 2024',
      status: 'upcoming',
      items: [
        'Security audits',
        'Mainnet validator selection',
        'Token generation event',
        'Exchange listings'
      ]
    },
    {
      phase: 'Phase 5',
      title: 'Mainnet Launch',
      quarter: 'Q1 2025',
      status: 'upcoming',
      items: [
        'Mainnet genesis',
        'Initial validator set activation',
        'Wallet ecosystem integrations',
        'Developer grants program'
      ]
    },
    {
      phase: 'Phase 6',
      title: 'Scaling & Enhancement',
      quarter: '2025+',
      status: 'upcoming',
      items: [
        'Rollup integration',
        'Post-quantum upgrade',
        'Enterprise adoption',
        'Cross-chain bridges'
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-6 h-6 text-green-600" />
      case 'current':
        return <Circle className="w-6 h-6 text-primary-600 animate-pulse" />
      case 'upcoming':
        return <Clock className="w-6 h-6 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500'
      case 'current':
        return 'bg-primary-100 dark:bg-primary-900/30 border-primary-500'
      case 'upcoming':
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
      default:
        return ''
    }
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our journey to becoming a global blockchain infrastructure
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-green-500 via-primary-500 to-gray-300 dark:to-gray-700"></div>

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                  index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                }`}
              >
                {/* Content */}
                <div className={`${index % 2 === 0 ? '' : 'lg:col-start-2'}`}>
                  <div className={`card border-2 ${getStatusColor(phase.status)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">
                          {phase.phase}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {phase.title}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {phase.quarter}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusIcon(phase.status)}
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
                            {phase.status === 'completed' ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                            )}
                          </div>
                          <span className={`text-sm ${
                            phase.status === 'completed' 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {phase.status === 'current' && (
                      <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800">
                        <div className="flex items-center text-sm text-primary-600 dark:text-primary-400 font-medium">
                          <Circle className="w-4 h-4 mr-2 animate-pulse" />
                          Currently in progress
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full border-4 ${
                    phase.status === 'completed' 
                      ? 'bg-green-500 border-green-600' 
                      : phase.status === 'current'
                      ? 'bg-primary-500 border-primary-600 animate-pulse'
                      : 'bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600'
                  } flex items-center justify-center z-10`}>
                    {getStatusIcon(phase.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-16 flex justify-center space-x-8">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <div className="flex items-center">
            <Circle className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
          </div>
        </div>
      </div>
    </section>
  )
}
