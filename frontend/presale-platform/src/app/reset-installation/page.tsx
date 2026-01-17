'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Lock } from 'lucide-react';

export default function ResetInstallationPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Master reset password (in production, this would be more secure)
    const MASTER_RESET_PASSWORD = 'VNC@Reset2026';
    
    if (password !== MASTER_RESET_PASSWORD) {
      setError('Invalid reset password!');
      return;
    }

    if (!confirmed) {
      setError('Please confirm that you want to reset the installation');
      return;
    }

    // Clear all installation data
    localStorage.removeItem('vnc_system_installed');
    localStorage.removeItem('vnc_admin_user');
    localStorage.removeItem('vnc_system_config');
    localStorage.removeItem('vnc_default_users');
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user_email');
    localStorage.removeItem('vnc_user_role');

    alert('Installation has been reset successfully! Redirecting to installation page...');
    router.push('/install');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <div className="bg-card-bg border border-red-500/50 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-500">Reset Installation</h1>
              <p className="text-gray-400">Clear all system data and start fresh</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-400 mb-2">
              <strong>âš ï¸ WARNING:</strong> This action will permanently delete:
            </p>
            <ul className="text-sm text-red-400 ml-4 list-disc space-y-1">
              <li>All administrator accounts</li>
              <li>All user accounts and data</li>
              <li>System configuration settings</li>
              <li>All authentication tokens</li>
            </ul>
            <p className="text-sm text-red-400 mt-2">
              This action cannot be undone!
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Master Reset Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter master reset password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-bg-darker border border-border-color rounded-xl text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Default: VNC@Reset2026 (change this in production)
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  setError('');
                }}
                className="mt-1 w-5 h-5"
              />
              <label htmlFor="confirm" className="text-sm text-gray-400 cursor-pointer">
                I understand that this will permanently delete all data and reset the installation to factory defaults. This action cannot be undone.
              </label>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-8 py-4 bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reset Installation
            </button>

            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full px-8 py-3 bg-bg-darker border border-border-color hover:border-primary rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support at support@vncblockchain.com
          </p>
        </div>
      </div>
    </main>
  );
}
