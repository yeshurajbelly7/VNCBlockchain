'use client'

import { Zap, Shield, Layers, TrendingUp, Globe, Lock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Ultra-High Performance',
      description: 'Process up to 400,000 transactions per second with parallel execution and horizontal sharding.',
      color: 'primary'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quantum-Ready Security',
      description: 'Post-quantum cryptography roadmap with CRYSTALS-Dilithium and Falcon for future-proof protection.',
      color: 'quantum'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: '100% EVM Compatible',
      description: 'Deploy existing Solidity smart contracts without modification. Full Ethereum ecosystem compatibility.',
      color: 'green'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Sub-Second Finality',
      description: 'Deterministic finality within 0.5-1 second. No probabilistic re-orgs or long confirmation times.',
      color: 'blue'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Horizontal Scalability',
      description: 'Performance increases linearly with additional nodes and shards. Built for global adoption.',
      color: 'indigo'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Enterprise Grade',
      description: 'Optional compliance layers for government and enterprise use cases without compromising decentralization.',
      color: 'purple'
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose VNC-20?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Built from the ground up to solve the blockchain trilemma: security, scalability, and decentralization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group card hover:shadow-2xl transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`text-${feature.color}-600 dark:text-${feature.color}-400`}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Specs */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">400K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TPS with Sharding</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">&lt;1s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Block Finality</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">$0.0001</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Transaction Fee</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">99.98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Network Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
}
