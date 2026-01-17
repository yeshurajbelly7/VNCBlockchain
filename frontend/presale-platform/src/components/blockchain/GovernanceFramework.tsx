'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GovernanceLevel {
  level: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export default function GovernanceFramework() {
  const [activeLevel, setActiveLevel] = useState<number>(0);

  const levels: GovernanceLevel[] = [
    {
      level: 'Infrastructure',
      name: 'Blockchain Protocol Level',
      description: 'Core protocol security and consensus mechanism',
      icon: '⛓️',
      color: 'purple',
      features: [
        'Protocol Security',
        'Consensus Algorithm',
        'Cryptography',
        'Network Protocol',
        'Block Structure',
      ],
    },
    {
      level: 'Application',
      name: 'Smart Contract Level',
      description: 'Business rules and application security',
      icon: 'ðŸ"„',
      color: 'blue',
      features: [
        'Business Rules',
        'Application Security',
        'Smart Contract Logic',
        'Token Standards',
        'DApp Integration',
      ],
    },
    {
      level: 'Company/Individual',
      name: 'User & Organization Level',
      description: 'Individual behavior awareness and compliance',
      icon: '👥',
      color: 'green',
      features: [
        'User Behavior',
        'KYC/AML Compliance',
        'Identity Verification',
        'Access Control',
        'Privacy Settings',
      ],
    },
    {
      level: 'Institutional',
      name: 'Regulatory & Standards Level',
      description: 'Laws, regulations, consortium agreements',
      icon: 'ðŸ›ï¸',
      color: 'yellow',
      features: [
        'Legal Framework',
        'Regulatory Compliance',
        'Industry Standards',
        'Consortium Rules',
        'Cross-border Agreements',
      ],
    },
  ];

  const adminControls = {
    allowed: [
      { action: 'Pause System', reason: 'Emergency safety during critical bugs', safe: true },
      { action: 'Approve Validators', reason: 'Network stability and security', safe: true },
      { action: 'Freeze Wallets', reason: 'Fraud prevention (with transparency)', safe: true },
      { action: 'Set Transaction Limits', reason: 'Regulatory compliance', safe: true },
      { action: 'Upgrade Protocol', reason: 'With advance notice & community vote', safe: true },
    ],
    forbidden: [
      { action: 'Edit Old Blocks', reason: 'Breaks immutability - core principle', safe: false },
      { action: 'Change Balances', reason: 'Fraud - cryptographically impossible', safe: false },
      { action: 'Delete Transactions', reason: 'Violates transparency', safe: false },
      { action: 'Bypass Vesting', reason: 'Investor harm - contract locked', safe: false },
      { action: 'Fake Signatures', reason: 'Mathematically impossible', safe: false },
    ],
  };

  const governancePhases = [
    {
      phase: 'Phase 1',
      name: 'Admin Control',
      description: 'Initial launch - Admin manages critical functions',
      duration: 'Month 1-6',
      control: 80,
      color: 'red',
    },
    {
      phase: 'Phase 2',
      name: 'Shared Control',
      description: 'Validators gain voting power',
      duration: 'Month 7-12',
      control: 50,
      color: 'yellow',
    },
    {
      phase: 'Phase 3',
      name: 'Community DAO',
      description: 'Full decentralized governance',
      duration: 'Month 13+',
      control: 20,
      color: 'green',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-bold text-white mb-2">
        ðŸ›ï¸ Blockchain Governance Framework
      </h2>
      <p className="text-gray-400 mb-8">
        Multi-layer governance architecture with quantum-ready security
      </p>

      {/* Governance Layers */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {levels.map((level, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveLevel(index)}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              activeLevel === index
                ? `border-${level.color}-500 bg-${level.color}-500/10`
                : 'border-gray-700 bg-gray-800'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{level.icon}</div>
              <div className="text-xs text-gray-400 mb-1">{level.level}</div>
              <div className={`font-bold text-sm ${
                activeLevel === index ? `text-${level.color}-400` : 'text-white'
              }`}>
                {level.name.split(' ').map((word, i) => (
                  <div key={i}>{word}</div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Level Details */}
      <motion.div
        key={activeLevel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-800 rounded-xl p-6 border-2 border-${levels[activeLevel].color}-500/30 mb-8`}
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className="text-5xl">{levels[activeLevel].icon}</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {levels[activeLevel].name}
            </h3>
            <p className="text-gray-400">{levels[activeLevel].description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {levels[activeLevel].features.map((feature, i) => (
            <div
              key={i}
              className={`bg-${levels[activeLevel].color}-500/10 border border-${levels[activeLevel].color}-500/30 rounded-lg px-4 py-2 text-sm text-gray-300`}
            >
              âœ" {feature}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Admin Control Model */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Allowed Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/30">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">âœ...</span>
            Admin Can Do (Safe & Transparent)
          </h3>
          <div className="space-y-3">
            {adminControls.allowed.map((item, i) => (
              <div
                key={i}
                className="bg-green-500/10 rounded-lg p-3 border border-green-500/20"
              >
                <div className="font-semibold text-white mb-1">{item.action}</div>
                <div className="text-sm text-gray-400">{item.reason}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-green-500/10 rounded-lg p-3 text-sm text-gray-300">
            ðŸ'¡ All actions are <strong className="text-green-400">logged</strong>, <strong className="text-green-400">timestamped</strong>, and <strong className="text-green-400">auditable</strong>
          </div>
        </div>

        {/* Forbidden Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-red-500/30">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
            <span className="mr-2">âŒ</span>
            Admin Cannot Do (Trust Preserved)
          </h3>
          <div className="space-y-3">
            {adminControls.forbidden.map((item, i) => (
              <div
                key={i}
                className="bg-red-500/10 rounded-lg p-3 border border-red-500/20"
              >
                <div className="font-semibold text-white mb-1">{item.action}</div>
                <div className="text-sm text-gray-400">{item.reason}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-red-500/10 rounded-lg p-3 text-sm text-gray-300">
            ðŸ"' These actions are <strong className="text-red-400">cryptographically impossible</strong> or <strong className="text-red-400">break immutability</strong>
          </div>
        </div>
      </div>

      {/* Governance Evolution */}
      <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-6">
          ðŸŒ± Governance Evolution Roadmap
        </h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700"></div>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          ></motion.div>

          {/* Phases */}
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {governancePhases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
                className={`bg-${phase.color}-500/10 border-2 border-${phase.color}-500/30 rounded-xl p-6`}
              >
                <div className={`w-12 h-12 rounded-full bg-${phase.color}-500 flex items-center justify-center text-white font-bold mb-4 mx-auto`}>
                  {i + 1}
                </div>
                
                <div className="text-center mb-4">
                  <div className={`text-sm text-${phase.color}-400 font-bold mb-1`}>
                    {phase.phase}
                  </div>
                  <div className="text-white font-bold mb-2">{phase.name}</div>
                  <div className="text-sm text-gray-400 mb-3">{phase.description}</div>
                  <div className="text-xs text-gray-500">{phase.duration}</div>
                </div>

                {/* Admin Control Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Admin Control</span>
                    <span className={`font-bold text-${phase.color}-400`}>{phase.control}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.control}%` }}
                      transition={{ duration: 1, delay: i * 0.3 + 0.5 }}
                      className={`h-full bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-700`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Evolution Arrow */}
        <div className="mt-8 flex items-center justify-center space-x-4 text-gray-400">
          <span>Admin Power</span>
          <div className="flex items-center">
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-green-500"></div>
            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-green-500"></div>
          </div>
          <span className="text-green-400">Community Power</span>
        </div>
      </div>

      {/* Key Understanding */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">ðŸŽ›ï¸</div>
            <div className="text-lg font-bold text-purple-400 mb-2">
              Admin Controls the Steering Wheel
            </div>
            <div className="text-sm text-gray-400">
              Can direct the system, pause for safety, and manage operations
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">ðŸ"Š</div>
            <div className="text-lg font-bold text-blue-400 mb-2">
              Blockchain Protects the History
            </div>
            <div className="text-sm text-gray-400">
              Past records are immutable, transparent, and cryptographically secured
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">ðŸ"</div>
          <div>
            <div className="text-xl font-bold text-white mb-3">
              Perfect Balance: Control + Trust
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-purple-400 font-bold mb-1">âœ... Admin manages future actions</div>
                <div className="text-gray-400">System operations, emergency controls, upgrades</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-blue-400 font-bold mb-1">âœ... Blockchain protects past records</div>
                <div className="text-gray-400">Immutable history, transparent transactions, audit trail</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
