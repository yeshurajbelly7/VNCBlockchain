'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Block {
  number: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: number;
  validator: string;
}

export default function BlockchainVisualizer() {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      number: 1,
      hash: '0x742d35Cc...',
      previousHash: '0x000000...',
      timestamp: Date.now() - 6000,
      transactions: 15,
      validator: '0x1234...',
    },
    {
      number: 2,
      hash: '0x8a3f42Bd...',
      previousHash: '0x742d35Cc...',
      timestamp: Date.now() - 4000,
      transactions: 23,
      validator: '0x5678...',
    },
    {
      number: 3,
      hash: '0x9c5e71Fa...',
      previousHash: '0x8a3f42Bd...',
      timestamp: Date.now() - 2000,
      transactions: 18,
      validator: '0x9abc...',
    },
  ]);

  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  // Simulate new block creation every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(prev => {
        const lastBlock = prev[prev.length - 1];
        const newBlock: Block = {
          number: lastBlock.number + 1,
          hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
          previousHash: lastBlock.hash,
          timestamp: Date.now(),
          transactions: Math.floor(Math.random() * 30) + 10,
          validator: `0x${Math.random().toString(16).substr(2, 4)}...`,
        };
        
        // Keep only last 5 blocks
        const newBlocks = [...prev, newBlock].slice(-5);
        return newBlocks;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            ðŸ"-- Live Blockchain Visualization
          </h2>
          <p className="text-gray-400">Real-time block production every 2 seconds</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Latest Block</div>
          <div className="text-3xl font-bold text-purple-400">
            #{blocks[blocks.length - 1]?.number}
          </div>
        </div>
      </div>

      {/* Blockchain Chain Visualization */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex items-center space-x-4 min-w-max">
          {blocks.map((block, index) => (
            <motion.div
              key={block.number}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              {/* Block */}
              <div
                onClick={() => setActiveBlock(block.number)}
                className={`relative bg-gradient-to-br ${
                  index === blocks.length - 1
                    ? 'from-purple-500 to-pink-500'
                    : 'from-gray-700 to-gray-800'
                } rounded-xl p-6 cursor-pointer hover:scale-105 transition-all border-2 ${
                  activeBlock === block.number
                    ? 'border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'border-gray-600'
                } min-w-[220px]`}
              >
                {/* Block Number Badge */}
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {block.number}
                </div>

                <div className="space-y-3">
                  {/* Previous Hash */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Previous Hash</div>
                    <div className="font-mono text-xs text-white bg-black/30 px-2 py-1 rounded">
                      {block.previousHash}
                    </div>
                  </div>

                  {/* Nonce */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Block Hash</div>
                    <div className="font-mono text-xs text-white bg-black/30 px-2 py-1 rounded">
                      {block.hash}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Timestamp</div>
                    <div className="text-xs text-white">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Transactions</div>
                    <div className="text-sm font-bold text-green-400">
                      {block.transactions} txs
                    </div>
                  </div>

                  {/* Validator */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Validator</div>
                    <div className="font-mono text-xs text-purple-300">
                      {block.validator}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connecting blocks */}
              {index < blocks.length - 1 && (
                <div className="flex items-center mx-2">
                  <div className="w-8 h-0.5 bg-purple-500"></div>
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-purple-500"></div>
                </div>
              )}
            </motion.div>
          ))}

          {/* New Block Indicator */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center space-x-2 ml-4"
          >
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Next block in 2s...</span>
          </motion.div>
        </div>
      </div>

      {/* Block Details Panel */}
      {activeBlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-800 rounded-xl p-6 border border-purple-500/30"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Block #{activeBlock} Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {blocks
              .filter(b => b.number === activeBlock)
              .map(block => (
                <React.Fragment key={block.number}>
                  <div>
                    <div className="text-sm text-gray-400">Block Number</div>
                    <div className="text-lg font-bold text-white">{block.number}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Timestamp</div>
                    <div className="text-lg font-bold text-white">
                      {new Date(block.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Transaction Count</div>
                    <div className="text-lg font-bold text-green-400">
                      {block.transactions}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Validator</div>
                    <div className="text-sm font-mono text-purple-300">
                      {block.validator}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-400 mb-2">Block Hash</div>
                    <div className="font-mono text-sm text-white bg-black/50 px-3 py-2 rounded">
                      {block.hash}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-400 mb-2">Previous Hash</div>
                    <div className="font-mono text-sm text-white bg-black/50 px-3 py-2 rounded">
                      {block.previousHash}
                    </div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </motion.div>
      )}

      {/* Blockchain Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {blocks[blocks.length - 1]?.number}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Blocks</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">2s</div>
          <div className="text-sm text-gray-400 mt-1">Block Time</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {blocks.reduce((sum, b) => sum + b.transactions, 0)}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Txs</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">100%</div>
          <div className="text-sm text-gray-400 mt-1">Finality</div>
        </div>
      </div>
    </div>
  );
}
