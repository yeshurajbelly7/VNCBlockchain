'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Copy, Send, QrCode, Download, Eye, EyeOff, RefreshCw, IndianRupee } from 'lucide-react';
import CashfreeDepositForm from '@/components/CashfreeDepositForm';

export default function WalletPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive' | 'deposit'>('overview');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('vnc_auth_token');
    if (!token) {
      alert('Please login to access wallet');
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }

    // Check for payment success callback
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const amount = urlParams.get('amount');
    
    if (paymentStatus === 'success' && amount) {
      // Update wallet balance
      const currentBalance = parseFloat(localStorage.getItem('vnc_wallet_inr_balance') || '0');
      localStorage.setItem('vnc_wallet_inr_balance', (currentBalance + parseFloat(amount)).toString());
      
      // Show success message
      alert(`Payment successful! ₹${amount} has been added to your wallet.`);
      
      // Clean URL
      window.history.replaceState({}, '', '/wallet');
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Checking authentication...</div>
    </div>;
  }
  
  const walletData = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8',
    balance: {
      vnc: '15,000.00',
      eth: '0.5432',
      usdt: '1,250.00',
      bnb: '2.345',
    },
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  };

  const transactions = [
    { type: 'Received', amount: '+5,000 VNC', from: '0x123...abc', time: '2 hours ago', status: 'Confirmed' },
    { type: 'Sent', amount: '-250 USDT', to: '0x456...def', time: '5 hours ago', status: 'Confirmed' },
    { type: 'Received', amount: '+10,000 VNC', from: 'Presale', time: '1 day ago', status: 'Confirmed' },
    { type: 'Sent', amount: '-0.05 ETH', to: '0x789...ghi', time: '2 days ago', status: 'Confirmed' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Your Wallet</span>
          </h1>
          <p className="text-xl text-gray-400">
            Manage your VNC tokens and crypto assets securely
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="bg-gradient-to-br from-primary/20 to-quantum/20 border-2 border-primary/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Wallet Address</div>
                <div className="font-mono font-semibold">{walletData.address}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(walletData.address)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(walletData.balance).map(([currency, amount]) => (
              <div key={currency} className="bg-card-bg/50 rounded-xl p-4">
                <div className="text-sm text-gray-400 uppercase mb-1">{currency}</div>
                <div className="text-2xl font-bold">{amount}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('deposit')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-5 h-5" />
              Deposit INR
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
            <button
              onClick={() => setActiveTab('receive')}
              className="flex-1 px-6 py-3 border-2 border-border-color hover:border-primary rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              Receive
            </button>
            <button className="px-6 py-3 border-2 border-border-color hover:border-primary rounded-xl font-semibold transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Security Info */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Security Information</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Recovery Phrase (12 words)</div>
                    <button
                      onClick={() => setShowMnemonic(!showMnemonic)}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showMnemonic ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    {showMnemonic ? (
                      <div className="grid grid-cols-3 gap-2 font-mono text-sm">
                        {walletData.mnemonic.split(' ').map((word, i) => (
                          <div key={i} className="bg-card-bg px-3 py-2 rounded">
                            {i + 1}. {word}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        Click &ldquo;Show&rdquo; to reveal your recovery phrase
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-yellow-400 mt-2">
                    âš ï¸ Never share your recovery phrase. Anyone with this phrase can access your funds.
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Private Key</div>
                    <button
                      onClick={() => copyToClipboard(walletData.privateKey)}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-card-bg/50 rounded-lg p-3 font-mono text-sm break-all">
                    {walletData.privateKey}
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Backup
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'Received' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        <Send className={`w-5 h-5 ${
                          tx.type === 'Received' ? 'text-green-400 rotate-180' : 'text-red-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold">{tx.type}</div>
                        <div className="text-sm text-gray-400">
                          {tx.from || tx.to} â€¢ {tx.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.type === 'Received' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.amount}
                      </div>
                      <div className="text-sm text-green-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Deposit INR</h3>
                <p className="text-gray-400">Add funds to your wallet using UPI, Cards, or Net Banking</p>
              </div>
            </div>

            <CashfreeDepositForm />
          </div>
        )}

        {activeTab === 'send' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Send Crypto</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Asset</label>
                <select className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none">
                  <option>VNC - VNC Blockchain</option>
                  <option>ETH - Ethereum</option>
                  <option>USDT - Tether</option>
                  <option>BNB - Binance Coin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-semibold">
                    MAX
                  </button>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Network Fee:</span>
                  <span>~₹0.001</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">You will send:</span>
                  <span className="font-semibold">0.00 VNC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Time:</span>
                  <span>~3 seconds</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-opacity"
              >
                Send Transaction
              </button>
            </form>
          </div>
        )}

        {activeTab === 'receive' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Receive Crypto</h3>
            
            <div className="text-center">
              <div className="inline-block bg-white p-6 rounded-xl mb-6">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Your Wallet Address</div>
                <div className="flex items-center justify-center gap-3 bg-bg-darker px-6 py-4 rounded-xl max-w-md mx-auto">
                  <div className="font-mono text-sm break-all">{walletData.address}</div>
                  <button
                    onClick={() => copyToClipboard(walletData.address)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-md mx-auto">
                <div className="text-sm text-yellow-400">
                  âš ï¸ Only send VNC, ETH, USDT, or BNB to this address. Sending other tokens may result in permanent loss.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


