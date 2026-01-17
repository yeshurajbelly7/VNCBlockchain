'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, TrendingUp, Users, DollarSign, ChevronRight, CheckCircle, IndianRupee, Bitcoin } from 'lucide-react';
import { PRESALE_CONFIG } from '@/config/presale.config';

export default function PresalePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStage] = useState(PRESALE_CONFIG.stages[0]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'INR' | 'CRYPTO'>('INR');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [tokensToReceive, setTokensToReceive] = useState(0);

  // Check authentication - MUST be before conditional render
  useEffect(() => {
    const token = localStorage.getItem('vnc_auth_token');
    if (!token) {
      alert('Please login to access presale');
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Countdown Timer - MUST be before conditional render
  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(currentStage.endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [currentStage]);

  // Calculate tokens to receive - MUST be before conditional render
  useEffect(() => {
    const amount = parseFloat(purchaseAmount) || 0;
    if (paymentMethod === 'INR') {
      setTokensToReceive(amount / currentStage.priceINR);
    } else {
      setTokensToReceive(amount / currentStage.priceUSD);
    }
  }, [purchaseAmount, paymentMethod, currentStage]);

  // Early return AFTER all hooks
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Checking authentication...</div>
    </div>;
  }

  const soldPercentage = 45; // Dynamic from backend

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum/20 text-quantum border border-quantum/30 mb-6 animate-pulse-glow">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Live Presale - Stage {currentStage.id}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">VNC Blockchain</span>
            <br />
            <span className="text-3xl md:text-5xl">VNC Token Presale</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join the world&apos;s first quantum-ready blockchain. Get VNC tokens at presale price before exchange listing on <strong className="text-primary">16 April 2025</strong>
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-card-bg border border-border-color rounded-2xl p-8 mb-12">
          <h3 className="text-center text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Presale Ends In
          </h3>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item) => (
              <div key={item.label} className="bg-bg-dark rounded-xl p-4 text-center">
                <div className="text-4xl font-bold gradient-text">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-400 mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Presale Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Current Stage</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">Stage {currentStage.id}</div>
            <div className="text-sm text-gray-400">of 3 stages</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Current Price</span>
              <IndianRupee className="w-5 h-5 text-quantum" />
            </div>
            <div className="text-3xl font-bold mb-2">₹{currentStage.priceINR.toFixed(2)}</div>
            <div className="text-sm text-green-400">Next: ₹{PRESALE_CONFIG.stages[1].priceINR.toFixed(2)}</div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Launch Price</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-2">₹{PRESALE_CONFIG.launchPriceINR.toFixed(2)}</div>
            <div className="text-sm text-quantum">+{((PRESALE_CONFIG.launchPriceINR / currentStage.priceINR - 1) * 100).toFixed(0)}% ROI</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card-bg border border-border-color rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Tokens Sold</span>
            <span className="text-lg font-bold gradient-text">{soldPercentage}%</span>
          </div>
          <div className="w-full bg-bg-dark rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-quantum transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>{(currentStage.supply * soldPercentage / 100).toLocaleString()} VNC Sold</span>
            <span>{currentStage.supply.toLocaleString()} VNC Total</span>
          </div>
        </div>

        {/* Buy Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Method Selection */}
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Buy VNC Tokens</h3>

            {/* Payment Method Toggle */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('INR')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'INR'
                    ? 'border-primary bg-primary/10'
                    : 'border-border-color hover:border-primary/50'
                }`}
              >
                <IndianRupee className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Pay with INR</div>
                <div className="text-sm text-gray-400">UPI, Cards, Net Banking</div>
              </button>

              <button
                onClick={() => setPaymentMethod('CRYPTO')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'CRYPTO'
                    ? 'border-quantum bg-quantum/10'
                    : 'border-border-color hover:border-quantum/50'
                }`}
              >
                <Bitcoin className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Pay with Crypto</div>
                <div className="text-sm text-gray-400">USDT, ETH, BNB</div>
              </button>
            </div>

            {/* INR Payment */}
            {paymentMethod === 'INR' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Amount (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={PRESALE_CONFIG.minPurchaseINR}
                      max={PRESALE_CONFIG.maxPurchaseINR}
                      className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-border-color rounded-xl focus:border-primary outline-none"
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Min: ₹{PRESALE_CONFIG.minPurchaseINR.toLocaleString()} • Max: ₹{PRESALE_CONFIG.maxPurchaseINR.toLocaleString()}
                  </div>
                </div>

                <div className="bg-bg-dark rounded-xl p-4 border border-primary/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">You will receive</span>
                    <span className="text-2xl font-bold gradient-text">{tokensToReceive.toLocaleString()} VNC</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    @ ₹{currentStage.priceINR} per VNC
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2">
                    <span>Razorpay</span>
                  </button>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 rounded-xl font-semibold transition-opacity">
                    Cashfree
                  </button>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 rounded-xl font-semibold transition-opacity">
                  PhonePe / UPI
                </button>
              </div>
            )}

            {/* Crypto Payment */}
            {paymentMethod === 'CRYPTO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Cryptocurrency</label>
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-dark border border-border-color rounded-xl focus:border-quantum outline-none"
                  >
                    <option>USDT (ERC20)</option>
                    <option>USDT (TRC20)</option>
                    <option>USDT (BEP20)</option>
                    <option>USDC (ERC20)</option>
                    <option>ETH</option>
                    <option>BNB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="10"
                      className="w-full pl-12 pr-4 py-3 bg-bg-dark border border-border-color rounded-xl focus:border-quantum outline-none"
                    />
                  </div>
                </div>

                <div className="bg-bg-dark rounded-xl p-4 border border-quantum/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">You will receive</span>
                    <span className="text-2xl font-bold gradient-text">{tokensToReceive.toLocaleString()} VNC</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    @ ${currentStage.priceUSD} per VNC
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-quantum to-quantum-dark hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2">
                  <span>Connect Wallet</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Presale Stages */}
          <div className="space-y-6">
            <div className="bg-card-bg border border-border-color rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Presale Stages</h3>
              <div className="space-y-4">
                {PRESALE_CONFIG.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      stage.id === currentStage.id
                        ? 'border-primary bg-primary/10'
                        : stage.status === 'completed'
                        ? 'border-green-500/50 bg-green-500/5'
                        : 'border-border-color'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {stage.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                        <span className="font-bold">{stage.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        stage.id === currentStage.id ? 'bg-primary text-white' :
                        stage.status === 'completed' ? 'bg-green-500 text-white' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {stage.id === currentStage.id ? 'Active' : stage.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Price</div>
                        <div className="font-semibold">₹{stage.priceINR.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Supply</div>
                        <div className="font-semibold">{(stage.supply / 1_000_000_000).toFixed(0)}B VNC</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Information */}
            <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border border-primary/30 rounded-xl p-6">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Exchange Listing
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Launch Date</span>
                  <span className="font-bold">16 April 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Launch Price</span>
                  <span className="font-bold text-green-400">₹{PRESALE_CONFIG.launchPriceINR.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Your ROI (Stage 1)</span>
                  <span className="font-bold text-quantum">+{((PRESALE_CONFIG.launchPriceINR / PRESALE_CONFIG.stages[0].priceINR - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle,
              title: 'Secure & Verified',
              description: 'Smart contract audited. KYC completed.',
            },
            {
              icon: Users,
              title: 'Growing Community',
              description: '10,000+ presale participants',
            },
            {
              icon: TrendingUp,
              title: 'High ROI Potential',
              description: '200% ROI from presale to launch',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-card-bg border border-border-color rounded-xl p-6 text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h4 className="font-bold mb-2 text-yellow-400">âš ï¸ Important Disclaimer</h4>
          <p className="text-sm text-gray-300">
            VNC is a utility token. This is not an investment contract. Cryptocurrency investments carry risk. 
            Please invest responsibly and only what you can afford to lose. Tokens will be distributed after 
            the launch on 16 April 2025. No guaranteed returns.
          </p>
        </div>
      </div>
    </div>
  );
}
