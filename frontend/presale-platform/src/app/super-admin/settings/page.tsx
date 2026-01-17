'use client';

import React, { useState, useMemo } from 'react';
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Mail,
  Lock,
  Database,
  Palette,
  Code,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  Cpu,
  HardDrive,
  Wifi,
  Link,
  AlertTriangle,
  Info,
  BarChart3,
} from 'lucide-react';

type SettingCategory = 'general' | 'security' | 'api' | 'notifications' | 'email' | 'appearance' | 'integrations' | 'advanced';

interface SystemSetting {
  id: string;
  category: SettingCategory;
  name: string;
  description: string;
  value: string | boolean | number;
  type: 'text' | 'password' | 'number' | 'boolean' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
  fullAccess: boolean;
  lastModified: string;
  modifiedBy: string;
}

const INITIAL_SETTINGS: SystemSetting[] = [
  {
    id: 's1',
    category: 'general',
    name: 'Platform Name',
    description: 'Display name for the platform',
    value: 'VNC Blockchain',
    type: 'text',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's2',
    category: 'general',
    name: 'Platform URL',
    description: 'Primary domain URL',
    value: 'https://www.vncblockchain.com',
    type: 'text',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's3',
    category: 'general',
    name: 'Support Email',
    description: 'Primary support contact email',
    value: 'support@vncblockchain.com',
    type: 'text',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's4',
    category: 'general',
    name: 'Maintenance Mode',
    description: 'Enable platform maintenance mode',
    value: false,
    type: 'boolean',
    required: false,
    fullAccess: true,
    lastModified: '2026-01-14',
    modifiedBy: 'Admin',
  },
  {
    id: 's5',
    category: 'security',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all users',
    value: true,
    type: 'boolean',
    required: false,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Security Team',
  },
  {
    id: 's6',
    category: 'security',
    name: 'Session Timeout',
    description: 'Auto logout after inactivity (minutes)',
    value: 30,
    type: 'number',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Security Team',
  },
  {
    id: 's7',
    category: 'security',
    name: 'Password Policy',
    description: 'Minimum password strength requirement',
    value: 'Strong',
    type: 'select',
    options: ['Weak', 'Medium', 'Strong', 'Very Strong'],
    required: true,
    fullAccess: true,
    lastModified: '2026-01-14',
    modifiedBy: 'Security Team',
  },
  {
    id: 's8',
    category: 'api',
    name: 'API Rate Limit',
    description: 'Requests per minute per user',
    value: 1000,
    type: 'number',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's9',
    category: 'api',
    name: 'API Version',
    description: 'Current API version',
    value: 'v2.1',
    type: 'select',
    options: ['v1.0', 'v2.0', 'v2.1', 'v3.0-beta'],
    required: true,
    fullAccess: true,
    lastModified: '2026-01-12',
    modifiedBy: 'Dev Team',
  },
  {
    id: 's10',
    category: 'notifications',
    name: 'Push Notifications',
    description: 'Enable push notifications',
    value: true,
    type: 'boolean',
    required: false,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's11',
    category: 'email',
    name: 'SMTP Server',
    description: 'Outgoing mail server address',
    value: 'smtp.vncblockchain.com',
    type: 'text',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
  {
    id: 's12',
    category: 'email',
    name: 'SMTP Port',
    description: 'SMTP server port',
    value: 587,
    type: 'number',
    required: true,
    fullAccess: true,
    lastModified: '2026-01-15',
    modifiedBy: 'Admin',
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<SettingCategory>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const stats = useMemo(() => {
    const total = settings.length;
    const withFullAccess = settings.filter((s) => s.fullAccess).length;
    const modified24h = settings.filter((s) => {
      const diff = Date.now() - new Date(s.lastModified).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length;
    return { total, withFullAccess, modified24h };
  }, [settings]);

  const filteredSettings = useMemo(() => {
    return settings
      .filter((s) => s.category === activeTab)
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          String(s.value).toLowerCase().includes(q)
        );
      });
  }, [settings, activeTab, searchQuery]);

  const updateSetting = (id: string, value: string | boolean | number) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, value, lastModified: new Date().toISOString().split('T')[0], modifiedBy: 'Admin' }
          : s
      )
    );
    setUnsavedChanges(true);
  };

  const toggleFullAccess = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, fullAccess: !s.fullAccess } : s))
    );
    setUnsavedChanges(true);
  };

  const saveAllSettings = () => {
    alert('All settings saved successfully!');
    setUnsavedChanges(false);
  };

  const exportSettings = () => {
    const json = JSON.stringify(settings, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vnc_settings_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      setSettings(INITIAL_SETTINGS);
      setUnsavedChanges(true);
      alert('Settings reset to defaults');
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            Platform Settings
          </h1>
          <p className="text-gray-400">Enterprise configuration & system management</p>
        </div>
        <div className="flex items-center gap-2">
          {unsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-300">Unsaved Changes</span>
            </div>
          )}
          <button
            onClick={saveAllSettings}
            disabled={!unsavedChanges}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              unsavedChanges
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" /> Save All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Settings className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Settings</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <Lock className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.withFullAccess}</div>
              <div className="text-sm text-gray-400">1000% Access</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.modified24h}</div>
              <div className="text-sm text-gray-400">Modified 24h</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-400">System Health</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <div className="relative flex-1 w-full md:w-auto">
          <input
            aria-label="Search settings"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
          />
          <Settings className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportSettings}
            className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setShowBackupModal(true)}
            className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white flex items-center gap-2"
          >
            <Database className="w-4 h-4" /> Backup
          </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 rounded-lg bg-red-800/20 border border-red-700 text-red-400 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700 overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'api', label: 'API', icon: Code },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'integrations', label: 'Integrations', icon: Link },
          { id: 'advanced', label: 'Advanced', icon: Cpu },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingCategory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        {filteredSettings.map((setting) => (
          <div
            key={setting.id}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{setting.name}</h3>
                  {setting.required && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                      Required
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Modified: {setting.lastModified} by {setting.modifiedBy}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{setting.description}</p>

                {/* Setting Input */}
                <div className="flex items-center gap-3">
                  {setting.type === 'text' && (
                    <input
                      type="text"
                      value={String(setting.value)}
                      onChange={(e) => updateSetting(setting.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                      placeholder={setting.name}
                    />
                  )}

                  {setting.type === 'password' && (
                    <div className="flex-1 relative">
                      <input
                        type={showPasswords[setting.id] ? 'text' : 'password'}
                        value={String(setting.value)}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                        className="w-full px-4 py-2 pr-20 rounded-lg bg-gray-900 border border-gray-700 text-white font-mono"
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() =>
                            setShowPasswords((prev) => ({ ...prev, [setting.id]: !prev[setting.id] }))
                          }
                          className="p-1 hover:bg-gray-800 rounded"
                        >
                          {showPasswords[setting.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(String(setting.value))}
                          className="p-1 hover:bg-gray-800 rounded"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  {setting.type === 'number' && (
                    <input
                      type="number"
                      value={Number(setting.value)}
                      onChange={(e) => updateSetting(setting.id, parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                      placeholder={setting.name}
                    />
                  )}

                  {setting.type === 'boolean' && (
                    <button
                      onClick={() => updateSetting(setting.id, !setting.value)}
                      className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                        setting.value
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {setting.value ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Enabled
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Disabled
                        </>
                      )}
                    </button>
                  )}

                  {setting.type === 'select' && setting.options && (
                    <select
                      value={String(setting.value)}
                      onChange={(e) => updateSetting(setting.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                    >
                      {setting.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {setting.type === 'textarea' && (
                    <textarea
                      value={String(setting.value)}
                      onChange={(e) => updateSetting(setting.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                      rows={3}
                      placeholder={setting.name}
                    />
                  )}
                </div>
              </div>

              {/* 1000% Access Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFullAccess(setting.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                    setting.fullAccess
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  title="1000% Access"
                >
                  {setting.fullAccess ? (
                    <>
                      <Lock className="w-4 h-4" /> 1000% Access
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Limited
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSettings.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Settings Found</h3>
            <p className="text-gray-400">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* System Status Dashboard */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" />
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CPU Usage', value: '24%', status: 'good', icon: Cpu },
            { label: 'Memory', value: '38%', status: 'good', icon: HardDrive },
            { label: 'Storage', value: '62%', status: 'warning', icon: Database },
            { label: 'Network', value: '99.9%', status: 'good', icon: Wifi },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-5 h-5 text-blue-400" />
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    item.status === 'good'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-400 mb-1">{item.label}</div>
              <div className="text-2xl font-bold text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Comparison */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Platform Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="pb-3">Platform</th>
                <th className="pb-3">Configuration</th>
                <th className="pb-3">Security</th>
                <th className="pb-3">Flexibility</th>
                <th className="pb-3">Performance</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'VNC Platform', config: '1000+', security: 'Military', flexibility: 'Unlimited', performance: '99.99%', rating: 100 },
                { name: 'WordPress', config: '200', security: 'Standard', flexibility: 'High', performance: '95%', rating: 78 },
                { name: 'Shopify', config: '150', security: 'Good', flexibility: 'Medium', performance: '97%', rating: 82 },
                { name: 'Magento', config: '300', security: 'High', flexibility: 'High', performance: '93%', rating: 85 },
                { name: 'Custom', config: '500', security: 'Variable', flexibility: 'High', performance: '90%', rating: 80 },
              ].map((platform) => (
                <tr key={platform.name} className="border-t border-gray-700">
                  <td className="py-3 text-white font-semibold">{platform.name}</td>
                  <td className="py-3 text-blue-400">{platform.config}</td>
                  <td className="py-3 text-green-400">{platform.security}</td>
                  <td className="py-3 text-purple-400">{platform.flexibility}</td>
                  <td className="py-3 text-pink-400">{platform.performance}</td>
                  <td className="py-3 text-yellow-400 font-bold">{platform.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-400" />
              Backup & Restore
            </h3>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-white">Last Backup</div>
                    <div className="text-xs text-gray-400">2026-01-15 03:00 AM</div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-xs text-gray-400">Size: 245 MB â€¢ Status: Success</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-blue-600 rounded-lg text-white flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Backup
                </button>
                <button className="px-4 py-3 bg-purple-600 rounded-lg text-white flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Backup
                </button>
                <button className="px-4 py-3 bg-green-600 rounded-lg text-white flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Create Backup
                </button>
                <button className="px-4 py-3 bg-orange-600 rounded-lg text-white flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Restore
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-yellow-300 mb-1">Important</div>
                    <div className="text-xs text-yellow-200">
                      Restoring a backup will overwrite all current settings. This action cannot be undone.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowBackupModal(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

