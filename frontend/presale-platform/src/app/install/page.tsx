'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Mail, Lock, Eye, EyeOff, CheckCircle, Database, Server } from 'lucide-react';

export default function InstallPage() {
  const router = useRouter();
  const [step, setStep] = useState<'check' | 'admin' | 'complete'>('check');
  const [showPasswords, setShowPasswords] = useState({
    admin: false,
    confirmAdmin: false,
  });
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    organizationName: 'VNC Blockchain',
    websiteUrl: 'https://vncblockchain.com',
    supportEmail: 'support@vncblockchain.com',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if system is already installed
    const isInstalled = localStorage.getItem('vnc_system_installed');
    if (isInstalled === 'true') {
      router.push('/login');
    } else {
      setStep('admin');
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.adminName || formData.adminName.length < 3) {
      newErrors.adminName = 'Name must be at least 3 characters';
    }

    if (!formData.adminEmail || !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Valid email is required';
    }

    if (!formData.adminPassword || formData.adminPassword.length < 8) {
      newErrors.adminPassword = 'Password must be at least 8 characters';
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.organizationName) {
      newErrors.organizationName = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInstall = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store admin credentials (in production, this would be sent to backend)
    const adminData = {
      name: formData.adminName,
      email: formData.adminEmail,
      password: formData.adminPassword, // In production, never store plain passwords
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const systemConfig = {
      organizationName: formData.organizationName,
      websiteUrl: formData.websiteUrl,
      supportEmail: formData.supportEmail,
      installedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    // Store in localStorage (in production, use database)
    localStorage.setItem('vnc_admin_user', JSON.stringify(adminData));
    localStorage.setItem('vnc_system_config', JSON.stringify(systemConfig));
    localStorage.setItem('vnc_system_installed', 'true');

    // Create default user accounts
    const defaultUsers = [
      {
        email: 'user@vncblockchain.com',
        password: 'User@123456',
        name: 'Demo User',
        role: 'user',
      },
    ];
    localStorage.setItem('vnc_default_users', JSON.stringify(defaultUsers));

    setStep('complete');
  };

  const handleComplete = () => {
    router.push('/login');
  };

  if (step === 'check') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Server className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-400">Checking installation status...</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card-bg border border-border-color rounded-xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Installation Complete!</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              VNC Blockchain platform has been successfully configured.
            </p>

            <div className="bg-bg-darker border border-border-color rounded-xl p-6 mb-8 text-left">
              <h3 className="text-lg font-bold mb-4 text-white">Default Credentials</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Admin Account</div>
                  <div className="font-mono bg-card-bg border border-border-color rounded p-3">
                    <div className="text-sm">
                      <span className="text-gray-400">Email:</span> {formData.adminEmail}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-400">Password:</span> {formData.adminPassword}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Demo User Account</div>
                  <div className="font-mono bg-card-bg border border-border-color rounded p-3">
                    <div className="text-sm">
                      <span className="text-gray-400">Email:</span> user@vncblockchain.com
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-400">Password:</span> User@123456
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <p className="text-sm text-yellow-400">
                  âš ï¸ Please save these credentials securely. Change the default passwords after first login.
                </p>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 rounded-xl font-bold transition-all text-lg"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-12 sm:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">VNC Blockchain Setup</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-2">
            Welcome to VNCBlockchain.com Installation
          </p>
          <p className="text-sm text-gray-500">
            Configure your admin account and system settings
          </p>
        </div>

        {/* Installation Form */}
        <div className="bg-card-bg border border-border-color rounded-xl p-6 sm:p-8">
          <form onSubmit={handleInstall} className="space-y-6">
            {/* Admin Information Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Administrator Account
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 bg-bg-darker border ${errors.adminName ? 'border-red-500' : 'border-border-color'} rounded-xl text-white focus:border-primary focus:outline-none`}
                      required
                    />
                  </div>
                  {errors.adminName && <p className="text-red-400 text-sm mt-1">{errors.adminName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="admin@vncblockchain.com"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 bg-bg-darker border ${errors.adminEmail ? 'border-red-500' : 'border-border-color'} rounded-xl text-white focus:border-primary focus:outline-none`}
                      required
                    />
                  </div>
                  {errors.adminEmail && <p className="text-red-400 text-sm mt-1">{errors.adminEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.admin ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className={`w-full pl-12 pr-12 py-3 bg-bg-darker border ${errors.adminPassword ? 'border-red-500' : 'border-border-color'} rounded-xl text-white focus:border-primary focus:outline-none`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, admin: !showPasswords.admin })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.admin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.adminPassword && <p className="text-red-400 text-sm mt-1">{errors.adminPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.confirmAdmin ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-12 pr-12 py-3 bg-bg-darker border ${errors.confirmPassword ? 'border-red-500' : 'border-border-color'} rounded-xl text-white focus:border-primary focus:outline-none`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirmAdmin: !showPasswords.confirmAdmin })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.confirmAdmin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* System Configuration Section */}
            <div className="border-t border-border-color pt-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                System Configuration
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <p className="text-sm text-gray-300">
                <strong className="text-primary">Security Note:</strong> This installation will create an administrator account with full system access. Make sure to use a strong password and keep your credentials secure.
              </p>
            </div>

            {/* Install Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-quantum hover:opacity-90 hover:scale-105 rounded-xl font-bold transition-all text-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-6 h-6" />
              Install VNC Blockchain
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card-bg border border-border-color rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">Admin Panel</div>
            <div className="text-sm text-gray-400">Full system control</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-quantum mb-1">User Portal</div>
            <div className="text-sm text-gray-400">Dashboard & wallet</div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-4 text-center">
            <div className="text-2xl font-bold gradient-text mb-1">Presale System</div>
            <div className="text-sm text-gray-400">Token sale platform</div>
          </div>
        </div>
      </div>
    </main>
  );
}

