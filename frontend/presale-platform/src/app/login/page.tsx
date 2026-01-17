'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);

  // Check if system is installed
  useEffect(() => {
    const isInstalled = localStorage.getItem('vnc_system_installed');
    if (!isInstalled || isInstalled !== 'true') {
      router.push('/install');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored admin and default users
    const adminUser = JSON.parse(localStorage.getItem('vnc_admin_user') || '{}');
    const defaultUsers = JSON.parse(localStorage.getItem('vnc_default_users') || '[]');
    
    // Check credentials
    let isValid = false;
    let userRole = 'user';
    
    if (formData.email === adminUser.email && formData.password === adminUser.password) {
      isValid = true;
      userRole = 'super-admin'; // Fixed: should be super-admin, not admin
    } else {
      const user = defaultUsers.find((u: Record<string, unknown>) => u.email === formData.email && u.password === formData.password);
      if (user) {
        isValid = true;
        userRole = user.role;
      }
    }
    
    if (isValid) {
      // Store auth token
      localStorage.setItem('vnc_auth_token', 'token_' + Date.now());
      localStorage.setItem('vnc_user_email', formData.email);
      localStorage.setItem('vnc_user_role', userRole);
      
      // Check if 2FA is enabled (simulate)
      const has2FA = false; // Disabled for demo
      if (has2FA) {
        setShow2FA(true);
      } else {
        // Redirect based on user role
        if (userRole === 'super-admin' || userRole === 'admin') {
          alert('Admin login successful! Redirecting to super admin panel...');
          router.push('/super-admin');
        } else if (userRole === 'validator') {
          alert('Validator login successful! Redirecting to validator dashboard...');
          router.push('/validator-dashboard');
        } else if (userRole === 'presale-admin') {
          alert('Presale Admin login successful! Redirecting to presale admin...');
          router.push('/presale-admin');
        } else {
          alert('Login successful! Redirecting to dashboard...');
          router.push('/dashboard');
        }
      }
    } else {
      alert('Invalid email or password!');
    }
  };

  const handleVerify2FA = () => {
    const code = twoFactorCode.join('');
    if (code.length === 6) {
      const userRole = localStorage.getItem('vnc_user_role') || 'user';
      localStorage.setItem('vnc_auth_token', 'token_' + Date.now());
      localStorage.setItem('vnc_user_email', formData.email);
      
      // Redirect based on role
      if (userRole === 'super-admin' || userRole === 'admin') {
        alert('2FA verified! Redirecting to super admin panel...');
        router.push('/super-admin');
      } else if (userRole === 'validator') {
        alert('2FA verified! Redirecting to validator dashboard...');
        router.push('/validator-dashboard');
      } else if (userRole === 'presale-admin') {
        alert('2FA verified! Redirecting to presale admin...');
        router.push('/presale-admin');
      } else {
        alert('2FA verified! Redirecting to dashboard...');
        router.push('/dashboard');
      }
    }
  };

  const handle2FAChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...twoFactorCode];
      newCode[index] = value;
      setTwoFactorCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`2fa-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <main className="min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Welcome Back</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Login to access your VNC Blockchain account
          </p>
        </div>

        {!show2FA ? (
          <div className="bg-card-bg border border-border-color rounded-xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold mb-6">Sign In</h3>
            
            <form className="space-y-6" onSubmit={handleLogin}>
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
                <label className="block text-sm text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-gray-400">don&apos;t have an account? </span>
              <Link href="/signup" className="text-primary hover:underline font-semibold">
                Sign Up
              </Link>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-color"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card-bg text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button className="px-3 sm:px-4 py-2 sm:py-3 bg-bg-darker border border-border-color hover:border-primary hover:scale-105 rounded-xl font-semibold transition-all text-sm sm:text-base">
                Google
              </button>
              <button className="px-3 sm:px-4 py-2 sm:py-3 bg-bg-darker border border-border-color hover:border-primary hover:scale-105 rounded-xl font-semibold transition-all text-sm sm:text-base">
                MetaMask
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg border border-border-color rounded-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-center">Two-Factor Authentication</h3>
            <p className="text-gray-400 mb-8 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
            
            <div className="flex gap-3 justify-center mb-8">
              {twoFactorCode.map((digit, index) => (
                <input
                  key={index}
                  id={`2fa-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handle2FAChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-bg-darker border-2 border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleVerify2FA}
              disabled={twoFactorCode.join('').length !== 6}
              className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Verify Code
            </button>

            <div className="text-center mt-6">
              <button className="text-primary hover:underline text-sm">
                Use backup code instead
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


