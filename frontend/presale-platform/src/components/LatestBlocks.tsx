'use client';

import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';

interface Block {
  number: number;
  txCount: number;
  timestamp: number;
  validator: number;
}

export default function LatestBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const generateBlocks = () => {
    const newBlocks: Block[] = [];
    const baseBlock = 12845792;
    
    for (let i = 0; i < 5; i++) {
      newBlocks.push({
        number: baseBlock - i,
        txCount: Math.floor(150 + Math.random() * 200),
        timestamp: 5 + i * 3,
        validator: Math.floor(Math.random() * 87) + 1,
      });
    }
    
    setBlocks(newBlocks);
  };

  useEffect(() => {
    generateBlocks();
    const interval = setInterval(generateBlocks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card-bg border border-border-color rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          Latest Blocks
        </h3>
        <a href="/explorer" className="text-primary hover:underline text-sm">
          View All â†'
        </a>
      </div>

      <div className="space-y-3">
        {blocks.map((block) => (
          <div
            key={block.number}
            className="bg-primary/5 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-primary font-semibold">
                Block #{block.number.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">{block.timestamp}s ago</div>
            </div>
            <div className="text-sm text-gray-400">
              {block.txCount} transactions â€¢ Validator #{block.validator}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

