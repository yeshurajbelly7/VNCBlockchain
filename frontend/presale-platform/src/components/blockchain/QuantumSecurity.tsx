'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuantumSecurity() {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      year: '2024-2025',
      name: 'Current Security',
      icon: '🔒',
      color: 'blue',
      algorithms: ['ECDSA (256-bit)', 'SHA-256', 'RSA-2048'],
      status: 'Current Standard',
      security: 85,
    },
    {
      year: '2026-2027',
      name: 'Hybrid Transition',
      icon: 'ðŸ"„',
      color: 'purple',
      algorithms: ['CRYSTALS-Dilithium', 'Falcon', 'ECDSA Hybrid'],
      status: 'Migration Phase',
      security: 95,
    },
    {
      year: '2028+',
      name: 'Quantum-Resistant',
      icon: 'ðŸ›¡ï¸',
      color: 'green',
      algorithms: ['CRYSTALS-Dilithium', 'Falcon', 'Kyber'],
      status: 'Quantum-Safe',
      security: 100,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(prev => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-bold text-white mb-2">
        ðŸ"® Quantum-Ready Security Architecture
      </h2>
      <p className="text-gray-400 mb-8">
        Future-proof cryptography protecting against quantum computer attacks
      </p>

      {/* Security Evolution Timeline */}
      <div className="relative mb-12">
        <div className="absolute top-12 left-0 right-0 h-1 bg-gray-700"></div>
        <motion.div
          animate={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="absolute top-12 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
        ></motion.div>

        <div className="grid grid-cols-3 gap-6 relative z-10">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              animate={{
                scale: activePhase === index ? 1.05 : 1,
                opacity: activePhase >= index ? 1 : 0.5,
              }}
              className={`bg-gray-800 rounded-xl p-6 border-2 cursor-pointer ${
                activePhase === index
                  ? `border-${phase.color}-500 shadow-lg shadow-${phase.color}-500/50`
                  : 'border-gray-700'
              }`}
              onClick={() => setActivePhase(index)}
            >
              <div className={`w-16 h-16 rounded-full bg-${phase.color}-500 flex items-center justify-center text-3xl mx-auto mb-4`}>
                {phase.icon}
              </div>

              <div className="text-center mb-4">
                <div className="text-sm text-gray-400 mb-1">{phase.year}</div>
                <div className="text-lg font-bold text-white mb-2">{phase.name}</div>
                <div className={`text-sm text-${phase.color}-400 font-semibold mb-3`}>
                  {phase.status}
                </div>
              </div>

              {/* Security Level */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Security Level</span>
                  <span className={`text-${phase.color}-400 font-bold`}>{phase.security}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    animate={{ width: `${phase.security}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-full bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-700`}
                  ></motion.div>
                </div>
              </div>

              {/* Algorithms */}
              <div className="space-y-2">
                {phase.algorithms.map((algo, i) => (
                  <div
                    key={i}
                    className={`bg-${phase.color}-500/10 border border-${phase.color}-500/30 rounded-lg px-3 py-2 text-xs text-gray-300 text-center`}
                  >
                    {algo}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantum Threat vs Protection */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Quantum Threat */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
            <span className="mr-2">âš ï¸</span>
            Quantum Computer Threat
          </h3>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">Shor&apos;s Algorithm</div>
              <div className="text-sm text-gray-400">
                Can break RSA, ECDSA, and most current public-key cryptography
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">Grover&apos;s Algorithm</div>
              <div className="text-sm text-gray-400">
                Weakens symmetric encryption by effectively halving key length
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">Timeline</div>
              <div className="text-sm text-gray-400">
                Cryptographically relevant quantum computers expected by 2030-2035
              </div>
            </div>
          </div>
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-6xl mb-2"
            >
              âš›ï¸
            </motion.div>
            <div className="text-sm text-red-400 font-semibold">Quantum Computing Power</div>
          </div>
        </div>

        {/* VNC Protection */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
            <span className="mr-2">ðŸ›¡ï¸</span>
            VNC Blockchain Protection
          </h3>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">CRYSTALS-Dilithium</div>
              <div className="text-sm text-gray-400">
                Lattice-based digital signatures resistant to quantum attacks
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">Falcon</div>
              <div className="text-sm text-gray-400">
                Fast Fourier lattice-based signatures with compact keys
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="font-semibold text-white mb-1">Kyber</div>
              <div className="text-sm text-gray-400">
                Key encapsulation mechanism for quantum-safe key exchange
              </div>
            </div>
          </div>
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-6xl mb-2"
            >
              ðŸ"
            </motion.div>
            <div className="text-sm text-green-400 font-semibold">Post-Quantum Security</div>
          </div>
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/30 mb-8">
        <h3 className="text-lg font-bold text-white mb-6">
          ðŸ--ºï¸ Quantum Security Implementation Roadmap
        </h3>
        <div className="space-y-4">
          {[
            {
              quarter: 'Q1 2025',
              title: 'Research & Planning',
              tasks: ['Evaluate PQC algorithms', 'Design hybrid architecture', 'Security audit'],
              status: 'completed',
            },
            {
              quarter: 'Q2-Q3 2025',
              title: 'Testnet Implementation',
              tasks: ['Deploy hybrid signatures', 'Test CRYSTALS-Dilithium', 'Performance benchmarks'],
              status: 'in-progress',
            },
            {
              quarter: 'Q4 2025 - Q1 2026',
              title: 'Mainnet Integration',
              tasks: ['Gradual rollout', 'Monitor performance', 'Community testing'],
              status: 'planned',
            },
            {
              quarter: 'Q2 2026+',
              title: 'Full Quantum-Resistant',
              tasks: ['Complete migration', '100% PQC coverage', 'Continuous monitoring'],
              status: 'planned',
            },
          ].map((phase, i) => (
            <div
              key={i}
              className={`flex items-start space-x-4 ${
                i < phases.length - 1 ? 'border-b border-gray-700 pb-4' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-full ${
                phase.status === 'completed' ? 'bg-green-500' :
                phase.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-gray-600'
              } flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {phase.status === 'completed' ? 'âœ"' :
                 phase.status === 'in-progress' ? 'â³' : i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-400">{phase.quarter}</div>
                    <div className="font-bold text-white">{phase.title}</div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {phase.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phase.tasks.map((task, j) => (
                    <div
                      key={j}
                      className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300"
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">ðŸ"®</div>
          <div className="font-bold text-white mb-2">Future-Proof</div>
          <div className="text-sm text-gray-400">
            Protected against future quantum computer attacks
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">âš¡</div>
          <div className="font-bold text-white mb-2">High Performance</div>
          <div className="text-sm text-gray-400">
            Optimized algorithms maintain blockchain speed
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">ðŸŒ</div>
          <div className="font-bold text-white mb-2">Industry Leader</div>
          <div className="text-sm text-gray-400">
            First blockchain with complete quantum readiness
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">ðŸ›¡ï¸</div>
          <div>
            <div className="text-xl font-bold text-white mb-3">
              Why Quantum Security Matters
            </div>
            <div className="text-gray-300 space-y-2">
              <p>
                <strong className="text-purple-400">Current blockchains</strong> use ECDSA signatures that will be breakable by quantum computers, potentially exposing billions in assets.
              </p>
              <p>
                <strong className="text-blue-400">VNC Blockchain</strong> is implementing post-quantum cryptography NOW, ensuring your assets remain secure when quantum computers become powerful enough to threaten traditional encryption.
              </p>
              <p className="text-sm text-gray-400 mt-3">
                ðŸ'¡ <strong>Investment Protection:</strong> By 2030-2035, quantum computers may be able to break current blockchain security. VNC ensures your investments are protected decades into the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


