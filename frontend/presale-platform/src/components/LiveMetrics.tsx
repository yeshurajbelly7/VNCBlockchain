'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Clock } from 'lucide-react';

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    tps: 72453,
    gasPrice: 0.00012,
    blockTime: 2.3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        tps: Math.floor(65000 + Math.random() * 15000),
        gasPrice: 0.00012,
        blockTime: parseFloat((2.0 + Math.random() * 0.8).toFixed(1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Live Performance <span className="gradient-text">Metrics</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Activity className="w-5 h-5" />
              <span className="text-sm">Current TPS</span>
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">
              {metrics.tps.toLocaleString()}
            </div>
            <div className="text-sm text-green-400">+12.5% from average</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Gas Price</span>
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">
              ${metrics.gasPrice.toFixed(5)}
            </div>
            <div className="text-sm text-green-400">Ultra-low fees</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Block Time</span>
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">
              {metrics.blockTime}s
            </div>
            <div className="text-sm text-green-400">Lightning fast</div>
          </div>
        </div>

        <div className="bg-card-bg border border-border-color rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Transactions Per Second (Live)</h3>
          <div className="h-48 bg-gradient-to-t from-primary/20 to-transparent rounded-lg flex items-end justify-center">
            <div className="text-6xl font-bold gradient-text">
              {metrics.tps.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
