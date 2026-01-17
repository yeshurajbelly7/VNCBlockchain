'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, Wallet, Shield, Zap, Users, Globe } from 'lucide-react';
import NetworkStats from '@/components/NetworkStats';
import LiveMetrics from '@/components/LiveMetrics';
import LatestBlocks from '@/components/LatestBlocks';
import LatestTransactions from '@/components/LatestTransactions';

export default function Home() {
  const router = useRouter();

  // Check if system is installed on mount
  useEffect(() => {
    const isInstalled = localStorage.getItem('vnc_system_installed');
    if (!isInstalled || isInstalled !== 'true') {
      router.push('/install');
    }
  }, [router]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-quantum/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum/20 text-quantum border border-quantum/30 mb-6 animate-pulse-glow">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Presale Live Now - Limited Time Only</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">VNC Blockchain</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-8">
              world&apos;s First Quantum-Ready Blockchain
            </p>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Join the presale and secure your VNC tokens at ₹0.50. Launch price ₹1.50 on <strong className="text-primary">16 April 2025</strong>. 
              Get <strong className="text-quantum">200% ROI</strong> potential.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 transition-all"
              >
                Buy VNC Tokens Now
              </Link>
              <Link
                href="/signup"
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl border-2 border-border-color hover:border-primary hover:scale-105 transition-all"
              >
                Create Wallet
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-3xl mx-auto">
              {[
                { label: 'Current Price', value: '₹0.50' },
                { label: 'Launch Price', value: '₹1.50' },
                { label: 'ROI Potential', value: '+200%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card-bg border border-border-color rounded-xl p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network Statistics */}
      <NetworkStats />

      {/* Live Metrics */}
      <LiveMetrics />

      {/* Latest Blocks and Transactions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Real-Time <span className="gradient-text">Blockchain Activity</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <LatestBlocks />
            <LatestTransactions />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card-bg/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose <span className="gradient-text">VNC Blockchain?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Ultra-High Performance',
                description: '400,000+ TPS with sub-second finality. Built for scale.',
              },
              {
                icon: Shield,
                title: 'Quantum-Ready Security',
                description: 'Post-quantum cryptography roadmap. Future-proof blockchain.',
              },
              {
                icon: Globe,
                title: 'EVM Compatible',
                description: '100% Ethereum compatible. Deploy existing contracts seamlessly.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Decentralized governance. Your voice matters.',
              },
              {
                icon: Wallet,
                title: 'Easy Integration',
                description: 'Works with MetaMask, WalletConnect, and more.',
              },
              {
                icon: TrendingUp,
                title: 'High ROI Potential',
                description: 'Early investors get maximum benefits. Limited presale supply.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card-bg border border-border-color rounded-xl p-6 card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Presale Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border-2 border-primary/30 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              3-Stage Presale <span className="gradient-text">Live Now</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                { stage: 'Stage 1', price: '₹0.50', supply: '15B VNC', status: 'Active' },
                { stage: 'Stage 2', price: '₹0.60', supply: '10B VNC', status: 'Upcoming' },
                { stage: 'Stage 3', price: '₹0.70', supply: '10B VNC', status: 'Upcoming' },
              ].map((stage) => (
                <div key={stage.stage} className="bg-card-bg border border-border-color rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">{stage.stage}</div>
                  <div className="text-3xl font-bold gradient-text mb-2">{stage.price}</div>
                  <div className="text-sm text-gray-400 mb-3">{stage.supply}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    stage.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {stage.status}
                  </div>
                </div>
              ))}
            </div>
            
            <Link
              href="/login"
              className="inline-block px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 transition-all"
            >
              Join Presale Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Invest in VNC - Growth Chart & Action Plan */}
      <section className="py-20 bg-bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Invest in <span className="gradient-text">VNC Blockchain?</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Quantum-resistant technology meets exponential growth potential
          </p>

          {/* Growth Projection Chart */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-card-bg border border-border-color rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Price Growth Projection (2025-2028)</h3>
              
              {/* Chart Visualization */}
              <div className="relative h-80 mb-8">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-400 pr-4">
                  <span>₹50.00</span>
                  <span>₹25.00</span>
                  <span>₹10.00</span>
                  <span>₹5.00</span>
                  <span>₹1.50</span>
                  <span>₹0.50</span>
                </div>

                {/* Chart area */}
                <div className="ml-16 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border-t border-gray-800"></div>
                    ))}
                  </div>

                  {/* Growth line */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    
                    {/* Growth curve */}
                    <polyline
                      points="0,320 100,315 200,300 300,250 400,180 500,120 600,60 700,20"
                      fill="none"
                      stroke="url(#growthGradient)"
                      strokeWidth="4"
                      vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 320, label: 'Stage 1' },
                      { x: 200, y: 300, label: 'Launch' },
                      { x: 400, y: 180, label: '2026' },
                      { x: 600, y: 60, label: '2028' }
                    ].map((point, i) => (
                      <g key={i}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          fill="#7c3aed"
                          stroke="#fff"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </g>
                    ))}
                  </svg>

                  {/* X-axis labels */}
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm text-gray-400">
                    <span>Jan 2025<br/><span className="text-green-400">₹0.50</span></span>
                    <span>Apr 2025<br/><span className="text-green-400">₹1.50</span></span>
                    <span>Dec 2026<br/><span className="text-quantum">₹8.50</span></span>
                    <span>Dec 2028<br/><span className="text-primary">₹50.00</span></span>
                  </div>
                </div>
              </div>

              {/* ROI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">+200%</div>
                  <div className="text-sm text-gray-400 mt-1">At Launch (Apr 2025)</div>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary">+1,600%</div>
                  <div className="text-sm text-gray-400 mt-1">By End 2026</div>
                </div>
                <div className="bg-quantum/10 border border-quantum/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-quantum">+5,000%</div>
                  <div className="text-sm text-gray-400 mt-1">By Mid 2027</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">+10,000%</div>
                  <div className="text-sm text-gray-400 mt-1">By End 2028</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Investment Reasons */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quantum-Resistant Security</h3>
              <p className="text-gray-400">First blockchain prepared for quantum computing era. Future-proof technology protecting your investment for decades.</p>
            </div>

            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Early Investor Advantage</h3>
              <p className="text-gray-400">Get in at ₹0.50 before public launch at ₹1.50. Limited supply of 50B tokens ensures scarcity-driven growth.</p>
            </div>

            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <div className="w-16 h-16 bg-quantum/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-quantum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Adoption</h3>
              <p className="text-gray-400">Partnerships with major institutions. Real-world use cases in finance, healthcare, and supply chain.</p>
            </div>
          </div>

          {/* Action Plan Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border border-primary/30 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-center mb-8">VNC Roadmap & Action Plan</h3>
              
              <div className="space-y-6">
                {/* Q1 2025 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-center">Q1 2025</div>
                  </div>
                  <div className="flex-1 bg-bg-dark/50 rounded-xl p-4">
                    <h4 className="font-bold text-green-400 mb-2">✓ Presale Launch</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 3-Stage presale (₹0.50 → ₹0.70)</li>
                      <li>• Community building & marketing</li>
                      <li>• Smart contract audits completed</li>
                    </ul>
                  </div>
                </div>

                {/* Q2 2025 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-center">Q2 2025</div>
                  </div>
                  <div className="flex-1 bg-bg-dark/50 rounded-xl p-4">
                    <h4 className="font-bold text-primary mb-2">🚀 Exchange Listing</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Launch at ₹1.50 on April 16, 2025</li>
                      <li>• Major CEX listings (Binance, Coinbase)</li>
                      <li>• DEX liquidity pools established</li>
                    </ul>
                  </div>
                </div>

                {/* Q3-Q4 2025 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-quantum text-white px-4 py-2 rounded-lg font-bold text-center">Q3-Q4 2025</div>
                  </div>
                  <div className="flex-1 bg-bg-dark/50 rounded-xl p-4">
                    <h4 className="font-bold text-quantum mb-2">📈 Ecosystem Expansion</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Mainnet launch with quantum security</li>
                      <li>• DeFi protocols & staking (15% APY)</li>
                      <li>• Mobile wallet & dApps launch</li>
                    </ul>
                  </div>
                </div>

                {/* 2026 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-center">2026</div>
                  </div>
                  <div className="flex-1 bg-bg-dark/50 rounded-xl p-4">
                    <h4 className="font-bold text-yellow-400 mb-2">🏢 Enterprise Adoption</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Fortune 500 partnerships announced</li>
                      <li>• Cross-chain bridges operational</li>
                      <li>• Target price: ₹8.50 by year-end</li>
                    </ul>
                  </div>
                </div>

                {/* 2027-2028 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-32">
                    <div className="bg-gradient-to-r from-primary to-quantum text-white px-4 py-2 rounded-lg font-bold text-center">2027-2028</div>
                  </div>
                  <div className="flex-1 bg-bg-dark/50 rounded-xl p-4">
                    <h4 className="font-bold gradient-text mb-2">🌍 Global Dominance</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Top 10 cryptocurrency by market cap</li>
                      <li>• Government & institutional adoption</li>
                      <li>• Target price: ₹50+ by end 2028</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Calculator */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-card-bg border border-border-color rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Investment Calculator</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-bg-dark rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">If you invest today</div>
                  <div className="text-2xl font-bold text-white">₹10,000</div>
                  <div className="text-xs text-gray-500 mt-1">at ₹0.50 per VNC</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">At Launch (Apr 2025)</div>
                  <div className="text-2xl font-bold text-green-400">₹30,000</div>
                  <div className="text-xs text-green-500 mt-1">+200% ROI</div>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">By 2026</div>
                  <div className="text-2xl font-bold text-primary">₹1,70,000</div>
                  <div className="text-xs text-primary mt-1">+1,600% ROI</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-quantum/10 border border-quantum/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">By 2027</div>
                  <div className="text-2xl font-bold text-quantum">₹5,10,000</div>
                  <div className="text-xs text-quantum mt-1">+5,000% ROI</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">By 2028</div>
                  <div className="text-2xl font-bold text-yellow-400">₹10,10,000+</div>
                  <div className="text-xs text-yellow-500 mt-1">+10,000% ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card-bg/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join the <span className="gradient-text">Future?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Create your wallet and start buying VNC tokens today. Launch date: 16 April 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 transition-all"
            >
              Create Wallet
            </Link>
            <Link
              href="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl border-2 border-border-color hover:border-primary hover:scale-105 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

