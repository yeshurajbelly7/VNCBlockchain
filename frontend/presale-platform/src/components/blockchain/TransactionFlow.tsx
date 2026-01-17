'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  status: 'pending' | 'validating' | 'broadcasting' | 'confirmed';
  timestamp: number;
}

export default function TransactionFlow() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Simulate transaction flow
  useEffect(() => {
    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: `0x${Math.random().toString(16).substr(2, 8)}`,
        from: `0x${Math.random().toString(16).substr(2, 8)}...`,
        to: `0x${Math.random().toString(16).substr(2, 8)}...`,
        amount: (Math.random() * 10).toFixed(2),
        status: 'pending',
        timestamp: Date.now(),
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 4)]);

      // Simulate transaction progress
      setTimeout(() => {
        setTransactions(prev =>
          prev.map(tx => (tx.id === newTx.id ? { ...tx, status: 'validating' } : tx))
        );
      }, 1000);

      setTimeout(() => {
        setTransactions(prev =>
          prev.map(tx => (tx.id === newTx.id ? { ...tx, status: 'broadcasting' } : tx))
        );
      }, 2000);

      setTimeout(() => {
        setTransactions(prev =>
          prev.map(tx => (tx.id === newTx.id ? { ...tx, status: 'confirmed' } : tx))
        );
      }, 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: 'Transaction Request',
      icon: '💻',
      description: 'User initiates transaction',
      color: 'blue',
    },
    {
      title: 'Validation',
      icon: 'ðŸ"',
      description: 'Validators verify transaction',
      color: 'yellow',
    },
    {
      title: 'Broadcasting',
      icon: 'ðŸ"¡',
      description: 'Broadcast to network',
      color: 'purple',
    },
    {
      title: 'Block Inclusion',
      icon: 'ðŸ"¦',
      description: 'Added to blockchain',
      color: 'green',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
      <h2 className="text-2xl font-bold text-white mb-2">
        ðŸ"„ Transaction Flow Visualization
      </h2>
      <p className="text-gray-400 mb-8">
        How transactions get into the blockchain in real-time
      </p>

      {/* Transaction Flow Diagram */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                animate={{
                  scale: activeStep === index ? 1.1 : 1,
                  opacity: activeStep === index ? 1 : 0.5,
                }}
                className="flex flex-col items-center"
              >
                {/* Icon Circle */}
                <motion.div
                  animate={{
                    boxShadow:
                      activeStep === index
                        ? `0 0 20px rgba(168, 85, 247, 0.6)`
                        : 'none',
                  }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${
                    activeStep === index
                      ? `from-${step.color}-500 to-${step.color}-700`
                      : 'from-gray-700 to-gray-800'
                  } flex items-center justify-center text-4xl mb-4 border-4 ${
                    activeStep === index ? 'border-purple-400' : 'border-gray-600'
                  }`}
                >
                  {step.icon}
                </motion.div>

                {/* Step Info */}
                <div className="text-center">
                  <div
                    className={`font-bold mb-1 ${
                      activeStep === index ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>

                {/* Step Number */}
                <div
                  className={`mt-2 w-8 h-8 rounded-full ${
                    activeStep === index ? 'bg-purple-500' : 'bg-gray-700'
                  } flex items-center justify-center text-sm font-bold`}
                >
                  {index + 1}
                </div>
              </motion.div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center justify-center -mt-16">
                  <motion.div
                    animate={{
                      x: activeStep === index ? [0, 10, 0] : 0,
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center"
                  >
                    <div
                      className={`h-1 w-24 ${
                        activeStep >= index ? 'bg-purple-500' : 'bg-gray-700'
                      }`}
                    ></div>
                    <div
                      className={`w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 ${
                        activeStep >= index ? 'border-l-purple-500' : 'border-l-gray-700'
                      }`}
                    ></div>
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Live Transactions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">
          ðŸ"´ Live Transactions
        </h3>
        <div className="space-y-3">
          <AnimatePresence>
            {transactions.map(tx => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-mono text-gray-400">
                        {tx.id}
                      </span>
                      <StatusBadge status={tx.status} />
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">From:</span>
                      <span className="font-mono text-purple-400">{tx.from}</span>
                      <span className="text-gray-600">â†'</span>
                      <span className="text-gray-400">To:</span>
                      <span className="font-mono text-purple-400">{tx.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      {tx.amount} VNC
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width:
                        tx.status === 'pending'
                          ? '25%'
                          : tx.status === 'validating'
                          ? '50%'
                          : tx.status === 'broadcasting'
                          ? '75%'
                          : '100%',
                    }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${
                      tx.status === 'confirmed'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {transactions.filter(tx => tx.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Pending</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {transactions.filter(tx => tx.status === 'validating').length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Validating</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {transactions.filter(tx => tx.status === 'broadcasting').length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Broadcasting</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {transactions.filter(tx => tx.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-400 mt-1">Confirmed</div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    pending: { color: 'bg-blue-500', text: 'Pending', icon: 'â³' },
    validating: { color: 'bg-yellow-500', text: 'Validating', icon: 'ðŸ"' },
    broadcasting: { color: 'bg-purple-500', text: 'Broadcasting', icon: 'ðŸ"¡' },
    confirmed: { color: 'bg-green-500', text: 'Confirmed', icon: 'âœ...' },
  };

  const { color, text, icon } = config[status];

  return (
    <span
      className={`${color} text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1`}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}
