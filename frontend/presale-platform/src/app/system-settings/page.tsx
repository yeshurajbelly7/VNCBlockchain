'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Shield, Mail, Globe, Calendar, User, Lock, Save } from 'lucide-react';

export default function SystemSettingsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [systemConfig, setSystemConfig] = useState<Record<string, unknown> | null>(null);
  const [adminUser, setAdminUser] = useState<Record<string, unknown> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    websiteUrl: '',
    supportEmail: '',
  });

  useEffect(() => {
    // Check authentication and admin role
    const token = localStorage.getItem('vnc_auth_token');
    const role = localStorage.getItem('vnc_user_role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role !== 'admin') {
      alert('Access denied! Admin privileges required.');
      router.push('/dashboard');
      return;
    }

    setIsAdmin(true);

    // Load system configuration
    const config = JSON.parse(localStorage.getItem('vnc_system_config') || '{}');
    const admin = JSON.parse(localStorage.getItem('vnc_admin_user') || '{}');
    
    setSystemConfig(config);
    setAdminUser(admin);
    setFormData({
      organizationName: config.organizationName || '',
      websiteUrl: config.websiteUrl || '',
      supportEmail: config.supportEmail || '',
    });
    setLoading(false);
  }, [router]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedConfig = {
      ...systemConfig,
      organizationName: formData.organizationName,
      websiteUrl: formData.websiteUrl,
      supportEmail: formData.supportEmail,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('vnc_system_config', JSON.stringify(updatedConfig));
    setSystemConfig(updatedConfig);
    setIsEditing(false);
    alert('System settings updated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-400">Loading system settings...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-quantum rounded-xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                <span className="gradient-text">System Settings</span>
              </h1>
              <p className="text-gray-400">Manage your VNC Blockchain configuration</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration Form */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Organization Settings
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary hover:opacity-90 rounded-lg transition-all"
                  >
                    Edit Settings
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveSettings} className="space-y-4">
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

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-quantum hover:opacity-90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        if (systemConfig) {
                          setFormData({
                            organizationName: String(systemConfig.organizationName || ''),
                            websiteUrl: String(systemConfig.websiteUrl || ''),
                            supportEmail: String(systemConfig.supportEmail || ''),
                          });
                        }
                      }}
                      className="px-6 py-3 bg-bg-darker border border-border-color hover:border-primary rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                    <Globe className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Organization Name</div>
                      <div className="text-lg font-semibold text-white">{String(systemConfig?.organizationName || '')}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                    <Globe className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Website URL</div>
                      <div className="text-lg font-semibold text-white">{String(systemConfig?.websiteUrl || '')}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Support Email</div>
                      <div className="text-lg font-semibold text-white">{String(systemConfig?.supportEmail || '')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Account Info */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-quantum" />
                Administrator Account
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                  <User className="w-5 h-5 text-quantum mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Full Name</div>
                    <div className="text-lg font-semibold text-white">{String(adminUser?.name || '')}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                  <Mail className="w-5 h-5 text-quantum mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Email Address</div>
                    <div className="text-lg font-semibold text-white">{String(adminUser?.email || '')}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-bg-darker border border-border-color rounded-lg">
                  <Lock className="w-5 h-5 text-quantum mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Password</div>
                    <div className="text-lg font-semibold text-white">â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  âš ï¸ To change admin credentials, use the reset installation feature.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Installation Info */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Installation Info
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400">Version</div>
                  <div className="text-lg font-semibold text-white">{String(systemConfig?.version || '1.0.0')}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-400">Installed At</div>
                  <div className="text-sm text-white">
                    {systemConfig?.installedAt ? new Date(String(systemConfig.installedAt)).toLocaleString() : 'N/A'}
                  </div>
                </div>

                {systemConfig?.updatedAt ? (
                  <div>
                    <div className="text-sm text-gray-400">Last Updated</div>
                    <div className="text-sm text-white">
                      {new Date(String(systemConfig.updatedAt)).toLocaleString()}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card-bg border border-border-color rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/super-admin')}
                  className="w-full px-4 py-3 bg-primary hover:opacity-90 rounded-lg transition-all text-left"
                >
                  Admin Dashboard
                </button>

                <button
                  onClick={() => router.push('/rbac-matrix')}
                  className="w-full px-4 py-3 bg-quantum hover:opacity-90 rounded-lg transition-all text-left"
                >
                  User Permissions
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to go to reset installation page?')) {
                      router.push('/reset-installation');
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-left"
                >
                  Reset Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

