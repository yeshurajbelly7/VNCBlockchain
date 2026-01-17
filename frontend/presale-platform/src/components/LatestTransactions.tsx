'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

export default function LatestTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const generateHash = () => {
    return '0x' + Array.from({ length: 8 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('') + '...';
  };

  const generateTransactions = useCallback(() => {
    const newTxs: Transaction[] = [];
    
    for (let i = 0; i < 5; i++) {
      newTxs.push({
        hash: generateHash(),
        from: generateHash(),
        to: generateHash(),
        amount: (Math.random() * 5000).toFixed(2),
        timestamp: 3 + i * 3,
      });
    }
    
    setTransactions(newTxs);
  }, []);

  useEffect(() => {
    generateTransactions();
    const interval = setInterval(generateTransactions, 5000);
    return () => clearInterval(interval);
  }, [generateTransactions]);

  return (
    <div className="bg-card-bg border border-border-color rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ArrowRight className="w-6 h-6 text-quantum" />
          Latest Transactions
        </h3>
        <a href="/explorer" className="text-primary hover:underline text-sm">
          View All â†'
        </a>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="bg-quantum/5 border border-quantum/20 rounded-lg p-4 hover:border-quantum/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-quantum font-semibold text-sm">
                {tx.hash}
              </div>
              <div className="text-sm text-gray-400">{tx.timestamp}s ago</div>
            </div>
            <div className="text-sm text-gray-400 font-mono">
              {tx.from} â†' {tx.to}
            </div>
            <div className="text-sm text-green-400 mt-1 font-semibold">
              {tx.amount} VNC
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

