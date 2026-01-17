'use client';

import { useState } from 'react';
import { IndianRupee, CreditCard, Smartphone, Building, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// Cashfree Configuration
const CASHFREE_CONFIG = {
  appId: 'YOUR_CASHFREE_APP_ID',
  secretKey: 'YOUR_CASHFREE_SECRET_KEY',
  environment: 'PRODUCTION',
  webhookUrl: 'https://www.vncblockchain.com/api/cashfree/webhook',
};

export default function CashfreeDepositForm() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState('');

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  const handleQuickAmount = (amt: number) => {
    setAmount(amt.toString());
  };

  const generateOrderId = () => {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const initiateCashfreePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) < 10) {
      alert('Minimum deposit amount is ₹10');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const orderId = generateOrderId();
      const userEmail = localStorage.getItem('vnc_user_email') || 'user@vncblockchain.com';
      const userName = userEmail.split('@')[0];

      // Create Cashfree order payload
      const orderData = {
        orderId: orderId,
        orderAmount: parseFloat(amount),
        orderCurrency: 'INR',
        orderNote: 'VNC Wallet Deposit',
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: '9999999999', // In production, get from user profile
        returnUrl: `https://www.vncblockchain.com/dashboard?payment=success&amount=${amount}`,
        notifyUrl: CASHFREE_CONFIG.webhookUrl,
      };

      console.log('Cashfree Order Data:', orderData);
      console.log('Using App ID:', CASHFREE_CONFIG.appId);

      // Call backend API to create order
      const response = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.status === 'OK') {
        // Check if Cashfree SDK is loaded
        if (typeof window.Cashfree === 'undefined') {
          // Load Cashfree SDK dynamically if not loaded
          const script = document.createElement('script');
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
          script.onload = () => {
            openCashfreeCheckout(data.paymentSessionId, orderData.returnUrl);
          };
          document.head.appendChild(script);
        } else {
          openCashfreeCheckout(data.paymentSessionId, orderData.returnUrl);
        }
      } else {
        throw new Error(data.message || 'Failed to create order');
      }

    } catch (error: unknown) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
      alert('Payment failed: ' + ((error as Error).message || 'Please try again'));
    }
  };

  const openCashfreeCheckout = (paymentSessionId: string, returnUrl: string) => {
    try {
      // Initialize Cashfree
      if (!window.Cashfree) {
        throw new Error('Cashfree SDK not loaded');
      }
      const cashfree = new window.Cashfree({
        mode: CASHFREE_CONFIG.environment === 'PRODUCTION' ? 'production' : 'sandbox',
      });

      // Open payment page
      cashfree.checkout({
        paymentSessionId: paymentSessionId,
        returnUrl: returnUrl,
        redirectTarget: '_self', // Redirect in same window
      }).then(() => {
        console.log('Cashfree checkout opened');
      }).catch((error: unknown) => {
        console.error('Cashfree checkout error:', error);
        setPaymentStatus('failed');
        setIsProcessing(false);
        alert('Failed to open payment page: ' + ((error as Error).message || 'Unknown error'));
      });
    } catch (error: unknown) {
      console.error('Cashfree SDK error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
      alert('Failed to initialize payment: ' + ((error as Error).message || 'Unknown error'));
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-400 mb-4">Your wallet has been credited with ₹{amount}</p>
        <div className="bg-card-bg border border-border-color rounded-xl p-4 max-w-md mx-auto mb-6">
          <div className="text-sm text-gray-400 mb-1">Transaction ID</div>
          <div className="font-mono text-sm">{transactionId}</div>
        </div>
        <button
          onClick={() => {
            setPaymentStatus('idle');
            setAmount('');
            setTransactionId('');
          }}
          className="px-8 py-3 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-semibold transition-opacity"
        >
          Make Another Deposit
        </button>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="text-center py-12">
        <Loader className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
        <h3 className="text-2xl font-bold mb-2">Processing Payment...</h3>
        <p className="text-gray-400">Please wait while we process your payment</p>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 max-w-md mx-auto mt-6">
          <p className="text-sm text-gray-400">
            You will be redirected to the payment page shortly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={initiateCashfreePayment} className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Enter Amount</label>
        <div className="relative">
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (Min: ₹10)"
            min="10"
            step="1"
            className="w-full pl-12 pr-4 py-4 bg-bg-darker border border-border-color rounded-xl text-white text-2xl font-bold focus:border-primary focus:outline-none"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Minimum deposit: ₹10 | Maximum: ₹1,00,000</p>
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <label className="block text-sm text-gray-400 mb-3">Quick Select</label>
        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAmount(amt)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                amount === amt.toString()
                  ? 'bg-gradient-to-r from-primary to-quantum'
                  : 'bg-bg-darker border border-border-color hover:border-primary'
              }`}
            >
              ₹{amt.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-3">Payment Method</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'upi'
                ? 'border-primary bg-primary/10'
                : 'border-border-color hover:border-primary/50'
            }`}
          >
            <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">UPI</div>
            <div className="text-xs text-gray-400">GPay, PhonePe, Paytm</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'card'
                ? 'border-primary bg-primary/10'
                : 'border-border-color hover:border-primary/50'
            }`}
          >
            <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">Cards</div>
            <div className="text-xs text-gray-400">Debit/Credit Cards</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'netbanking'
                ? 'border-primary bg-primary/10'
                : 'border-border-color hover:border-primary/50'
            }`}
          >
            <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">Net Banking</div>
            <div className="text-xs text-gray-400">All major banks</div>
          </button>
        </div>
      </div>

      {/* Transaction Summary */}
      {amount && parseFloat(amount) >= 10 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Deposit Amount:</span>
            <span className="text-xl font-bold">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Payment Method:</span>
            <span className="font-semibold capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Processing Fee:</span>
            <span className="text-green-400">₹0 (Free)</span>
          </div>
          <div className="border-t border-border-color pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">You will receive:</span>
              <span className="text-2xl font-bold text-green-400">
                ₹{parseFloat(amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <div className="font-semibold text-green-400 mb-1">Secure Payment by Cashfree</div>
            <ul className="space-y-1 text-xs">
              <li>âœ" PCI DSS Level 1 Certified</li>
              <li>âœ" 256-bit SSL Encryption</li>
              <li>âœ" Instant Credit to Wallet</li>
              <li>âœ" 24/7 Customer Support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !amount || parseFloat(amount) < 10}
        className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-opacity flex items-center justify-center gap-2 text-lg"
      >
        {isProcessing ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <IndianRupee className="w-6 h-6" />
            Proceed to Pay ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
          </>
        )}
      </button>

      {/* Info Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-400">
            <strong>Payment Flow:</strong> After clicking &quot;Proceed to Pay&quot;, you will be redirected to Cashfree&apos;s secure payment page. Complete your payment there, and you&apos;ll be redirected back to this page. Your wallet will be credited automatically.
          </div>
        </div>
      </div>
    </form>
  );
}



