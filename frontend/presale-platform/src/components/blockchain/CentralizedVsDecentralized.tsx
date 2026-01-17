'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CentralizedVsDecentralized() {
  const [activeTab, setActiveTab] = useState<'centralized' | 'decentralized'>('centralized');

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-bold text-white mb-2">
        ðŸ›ï¸ Database vs Blockchain Comparison
      </h2>
      <p className="text-gray-400 mb-8">
        Understanding the fundamental difference between centralized and decentralized systems
      </p>

      {/* Tab Switcher */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('centralized')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
            activeTab === 'centralized'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          ðŸ¦ Centralized Database
        </button>
        <button
          onClick={() => setActiveTab('decentralized')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
            activeTab === 'decentralized'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          ðŸŒ Decentralized Blockchain
        </button>
      </div>

      {/* Centralized View */}
      {activeTab === 'centralized' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Diagram */}
          <div className="bg-gray-800 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-center space-x-8">
              {/* Users */}
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-2xl"
                  >
                    ðŸ'¤
                  </motion.div>
                ))}
              </div>

              {/* Arrows pointing to center */}
              <div className="flex flex-col items-center space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="flex items-center"
                  >
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-red-500"></div>
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-red-500"></div>
                  </motion.div>
                ))}
              </div>

              {/* Central Database */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-5xl shadow-2xl shadow-red-500/50">
                  ðŸ--„ï¸
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <div className="text-sm font-bold text-red-400">Central Database</div>
                </div>
              </motion.div>

              {/* Admin */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-3xl border-4 border-yellow-300"
                >
                  ðŸ'¨â€ðŸ'¼
                </motion.div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <div className="text-xs font-bold text-yellow-400">Admin</div>
                  <div className="text-xs text-gray-500">Full Control</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
              <div className="text-red-400 font-bold mb-2">âŒ Single Point of Failure</div>
              <div className="text-sm text-gray-400">
                If the central server goes down, entire system fails
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
              <div className="text-red-400 font-bold mb-2">âŒ Admin Can Edit/Delete</div>
              <div className="text-sm text-gray-400">
                Central authority can modify or remove data
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
              <div className="text-red-400 font-bold mb-2">âŒ Trust Required</div>
              <div className="text-sm text-gray-400">
                Users must trust the central authority
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30">
              <div className="text-red-400 font-bold mb-2">âŒ Limited Transparency</div>
              <div className="text-sm text-gray-400">
                Data access controlled by central authority
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="text-center">
              <div className="text-2xl mb-2">ðŸ¦</div>
              <div className="text-lg font-bold text-red-400 mb-2">
                Traditional Database Model
              </div>
              <div className="text-gray-400">
                Centralized control with single authority managing all data and access
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decentralized View */}
      {activeTab === 'decentralized' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Diagram */}
          <div className="bg-gray-800 rounded-xl p-8 mb-6">
            <div className="relative">
              {/* Center - Blockchain Network */}
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  ðŸŒ Distributed Blockchain Network
                </div>
                <div className="text-sm text-gray-400">
                  Every node has a complete copy of the blockchain
                </div>
              </div>

              {/* Network Nodes in Circle */}
              <div className="relative w-96 h-96 mx-auto">
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 360) / 6;
                  const radian = (angle * Math.PI) / 180;
                  const x = Math.cos(radian) * 160;
                  const y = Math.sin(radian) * 160;

                  return (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px - 40px)`,
                        top: `calc(50% + ${y}px - 40px)`,
                      }}
                    >
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex flex-col items-center justify-center text-2xl shadow-lg shadow-purple-500/50">
                          <div>ðŸ'»</div>
                          <div className="text-xs mt-1">Node {i + 1}</div>
                        </div>

                        {/* Connection Lines */}
                        {[...Array(6)].map((_, j) => {
                          if (j <= i) return null;
                          const angle2 = (j * 360) / 6;
                          const radian2 = (angle2 * Math.PI) / 180;
                          const x2 = Math.cos(radian2) * 160;
                          const y2 = Math.sin(radian2) * 160;
                          const dx = x2 - x;
                          const dy = y2 - y;
                          const length = Math.sqrt(dx * dx + dy * dy);
                          const angleRad = Math.atan2(dy, dx);
                          const angleDeg = (angleRad * 180) / Math.PI;

                          return (
                            <motion.div
                              key={j}
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: (i + j) * 0.2,
                              }}
                              className="absolute top-10 left-10 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{
                                width: `${length}px`,
                                transform: `rotate(${angleDeg}deg)`,
                                transformOrigin: '0 0',
                              }}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Center Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl shadow-2xl shadow-purple-500/50"
                  >
                    â›"ï¸
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 font-bold mb-2">âœ... No Single Point of Failure</div>
              <div className="text-sm text-gray-400">
                Network continues even if some nodes go offline
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 font-bold mb-2">âœ... Immutable Records</div>
              <div className="text-sm text-gray-400">
                Once written, data cannot be edited or deleted
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 font-bold mb-2">âœ... Trustless System</div>
              <div className="text-sm text-gray-400">
                Math and cryptography replace trust in authority
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 font-bold mb-2">âœ... Full Transparency</div>
              <div className="text-sm text-gray-400">
                All transactions visible to everyone on the network
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="text-center">
              <div className="text-2xl mb-2">â›"ï¸</div>
              <div className="text-lg font-bold text-purple-400 mb-2">
                Blockchain Model
              </div>
              <div className="text-gray-400">
                Decentralized consensus with network agreement replacing central authority
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      <div className="mt-8 bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-4 text-left text-white font-bold">Feature</th>
              <th className="px-6 py-4 text-left text-red-400 font-bold">Database</th>
              <th className="px-6 py-4 text-left text-purple-400 font-bold">Blockchain</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Control', db: 'Single admin', bc: 'Network consensus' },
              { feature: 'Edit data', db: 'Yes âœ...', bc: 'No âŒ' },
              { feature: 'Delete data', db: 'Yes âœ...', bc: 'No âŒ' },
              { feature: 'Transparency', db: 'Limited', bc: 'Full' },
              { feature: 'Trust', db: 'Admin-based', bc: 'Math + cryptography' },
              { feature: 'Failure point', db: 'Single', bc: 'Distributed' },
              { feature: 'Speed', db: 'Very Fast', bc: 'Fast (2s blocks)' },
              { feature: 'Scalability', db: 'Vertical', bc: 'Horizontal' },
            ].map((row, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="px-6 py-4 text-gray-300 font-medium">{row.feature}</td>
                <td className="px-6 py-4 text-gray-400">{row.db}</td>
                <td className="px-6 py-4 text-gray-400">{row.bc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Takeaway */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">ðŸ'¡</div>
          <div>
            <div className="text-lg font-bold text-white mb-2">Key Understanding</div>
            <div className="text-gray-300 mb-2">
              <strong>Database:</strong> Trusts <span className="text-red-400">people</span> (central authority)
            </div>
            <div className="text-gray-300">
              <strong>Blockchain:</strong> Trusts <span className="text-purple-400">math</span> (cryptography & consensus)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
