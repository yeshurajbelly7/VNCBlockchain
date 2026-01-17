'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'otp' | 'wallet'>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [wallet, setWallet] = useState({
    address: '',
    mnemonic: '',
  });
  const [mnemonicVerified, setMnemonicVerified] = useState(false);

  const handleSendOTP = () => {
    // Simulate OTP sending
    alert('OTP sent to ' + formData.email + ' and ' + formData.phone);
    setStep('otp');
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Generate wallet
      const generatedWallet = {
        address: '0x' + Math.random().toString(16).slice(2, 42),
        mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      };
      setWallet(generatedWallet);
      setStep('wallet');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleCompleteSignup = () => {
    if (mnemonicVerified) {
      // Create new user and store in default users list
      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: 'user', // Default role for new signups
        walletAddress: wallet.address,
        mnemonic: wallet.mnemonic,
        createdAt: new Date().toISOString()
      };
      
      // Get existing users and add new user
      const existingUsers = JSON.parse(localStorage.getItem('vnc_default_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('vnc_default_users', JSON.stringify(existingUsers));
      
      // Store auth token and login
      localStorage.setItem('vnc_auth_token', 'token_' + Date.now());
      localStorage.setItem('vnc_user_email', formData.email);
      localStorage.setItem('vnc_user_role', 'user');
      
      alert('Signup complete! Redirecting to dashboard...');
      router.push('/dashboard');
    } else {
      alert('Please verify your recovery phrase first!');
    }
  };

  return (
    <main className="min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Create Account</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Join VNC Blockchain and start your crypto journey
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step === 'details' ? 'bg-gradient-to-r from-primary to-quantum' : 'bg-green-500'
            }`}>
              {step === 'details' ? '1' : <CheckCircle className="w-6 h-6" />}
            </div>
            <span className="text-sm font-semibold">Details</span>
          </div>
          <div className="flex-1 h-1 bg-border-color mx-4" />
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step === 'otp' ? 'bg-gradient-to-r from-primary to-quantum' : 
              step === 'wallet' ? 'bg-green-500' : 'bg-card-bg border-2 border-border-color'
            }`}>
              {step === 'wallet' ? <CheckCircle className="w-6 h-6" /> : '2'}
            </div>
            <span className="text-sm font-semibold">Verify</span>
          </div>
          <div className="flex-1 h-1 bg-border-color mx-4" />
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step === 'wallet' ? 'bg-gradient-to-r from-primary to-quantum' : 'bg-card-bg border-2 border-border-color'
            }`}>
              3
            </div>
            <span className="text-sm font-semibold">Wallet</span>
          </div>
        </div>

        {/* Step 1: User Details */}
        {step === 'details' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Your Information</h3>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" required />
                  <label className="text-sm text-gray-300">
                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-opacity flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-gray-400">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Login
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Verify Your Identity</h3>
            <p className="text-gray-400 mb-8">
              We&apos;ve sent a 6-digit code to {formData.email} and {formData.phone}
            </p>
            
            <div className="flex gap-3 justify-center mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-bg-darker border-2 border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={otp.join('').length !== 6}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify OTP
            </button>

            <div className="text-center mt-6">
              <button className="text-primary hover:underline">
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Wallet Creation */}
        {step === 'wallet' && (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Your Wallet is Ready! ðŸŽ‰</h3>
            <p className="text-gray-400 mb-8">
              We&apos;ve created a secure wallet for you. Please save your recovery phrase safely.
            </p>

            <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-yellow-400 text-2xl">âš ï¸</div>
                <div>
                  <div className="font-bold text-yellow-400 mb-2">IMPORTANT: Save Your Recovery Phrase</div>
                  <div className="text-sm text-gray-300">
                    Write down these 12 words in order and keep them safe. You&apos;ll need them to recover your wallet. Never share them with anyone!
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-card-bg p-4 rounded-lg">
                {wallet.mnemonic.split(' ').map((word, index) => (
                  <div key={index} className="bg-bg-darker px-4 py-3 rounded-lg">
                    <span className="text-xs text-gray-400">{index + 1}.</span> <span className="font-mono font-semibold">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card-bg/50 border border-border-color rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">Your Wallet Address</div>
              <div className="font-mono text-primary font-semibold break-all">{wallet.address}</div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={mnemonicVerified}
                  onChange={(e) => setMnemonicVerified(e.target.checked)}
                />
                <label className="text-sm text-gray-300">
                  I have written down my recovery phrase and stored it in a safe place. I understand that losing it means losing access to my funds permanently.
                </label>
              </div>
            </div>

            <button
              onClick={handleCompleteSignup}
              disabled={!mnemonicVerified}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Complete Signup <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

