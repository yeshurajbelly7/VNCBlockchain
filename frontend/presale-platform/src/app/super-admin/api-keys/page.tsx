'use client';

import React, { useState, useMemo } from 'react';
import {
  Key,
  Shield,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Download,
  Clock,
  Code,
  Zap,
  BarChart3,
  TrendingUp,
  Settings,
  Search,
  Terminal,
} from 'lucide-react';

type ApiKeyStatus = 'active' | 'expired' | 'revoked' | 'suspended';
type ApiKeyType = 'full-access' | 'read-only' | 'write-only' | 'custom';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  type: ApiKeyType;
  status: ApiKeyStatus;
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  requests: number;
  rateLimit: number;
  permissions: string[];
  ipWhitelist: string[];
  fullAccess: boolean;
  createdBy: string;
}

interface ApiStats {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  activeKeys: number;
}

const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'k1',
    name: 'Production API Key',
    key: 'vnc_live_pk_7x9m2n4p6q8r0s1t3u5v7w9y',
    secret: 'vnc_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4',
    type: 'full-access',
    status: 'active',
    createdAt: '2026-01-10',
    expiresAt: '2027-01-10',
    lastUsed: '2026-01-15 14:23:45',
    requests: 1245678,
    rateLimit: 10000,
    permissions: ['read', 'write', 'delete', 'admin'],
    ipWhitelist: ['192.168.1.100', '10.0.0.50'],
    fullAccess: true,
    createdBy: 'Admin',
  },
  {
    id: 'k2',
    name: 'Mobile App Key',
    key: 'vnc_live_pk_b2c3d4e5f6g7h8i9j0k1l2m3n4o5',
    secret: 'vnc_live_sk_p5q6r7s8t9u0v1w2x3y4z5a6b7c8',
    type: 'read-only',
    status: 'active',
    createdAt: '2026-01-12',
    expiresAt: '2026-07-12',
    lastUsed: '2026-01-15 13:45:22',
    requests: 456789,
    rateLimit: 5000,
    permissions: ['read'],
    ipWhitelist: [],
    fullAccess: true,
    createdBy: 'Developer',
  },
  {
    id: 'k3',
    name: 'Testing Key',
    key: 'vnc_test_pk_c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    secret: 'vnc_test_sk_q6r7s8t9u0v1w2x3y4z5a6b7c8d9',
    type: 'custom',
    status: 'suspended',
    createdAt: '2026-01-05',
    expiresAt: '2026-02-05',
    lastUsed: '2026-01-14 09:12:33',
    requests: 12345,
    rateLimit: 1000,
    permissions: ['read', 'write'],
    ipWhitelist: ['127.0.0.1'],
    fullAccess: false,
    createdBy: 'QA Team',
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'keys' | 'analytics' | 'logs' | 'settings'>('keys');

  const stats: ApiStats = useMemo(() => {
    const totalRequests = apiKeys.reduce((sum, key) => sum + key.requests, 0);
    const activeKeys = apiKeys.filter((k) => k.status === 'active').length;
    return {
      totalRequests,
      successRate: 99.8,
      avgResponseTime: 45,
      activeKeys,
    };
  }, [apiKeys]);

  const filteredKeys = useMemo(() => {
    return apiKeys
      .filter((k) => (statusFilter === 'all' ? true : k.status === statusFilter))
      .filter((k) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          k.name.toLowerCase().includes(q) ||
          k.key.toLowerCase().includes(q) ||
          k.type.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.requests - a.requests);
  }, [apiKeys, searchQuery, statusFilter]);

  const handleView = (key: ApiKey) => {
    setSelectedKey(key);
    setShowViewModal(true);
  };

  const handleEdit = (key: ApiKey) => {
    setSelectedKey(key);
    setShowEditModal(true);
  };

  const saveApiKey = (updated: ApiKey) => {
    setApiKeys((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
    setShowEditModal(false);
    setShowViewModal(false);
    alert('API Key updated successfully!');
  };

  const createNewKey = () => {
    const newKey: ApiKey = {
      id: `k${Date.now()}`,
      name: 'New API Key',
      key: `vnc_live_pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      secret: `vnc_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      type: 'full-access',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUsed: 'Never',
      requests: 0,
      rateLimit: 10000,
      permissions: ['read', 'write'],
      ipWhitelist: [],
      fullAccess: true,
      createdBy: 'Admin',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setShowCreateModal(false);
    alert('New API Key created successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, fullAccess: !k.fullAccess } : k)));
  };

  const revokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as ApiKeyStatus } : k)));
      alert('API Key revoked successfully!');
    }
  };

  const regenerateKey = (id: string) => {
    if (confirm('Regenerate API key? The old key will no longer work.')) {
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === id
            ? {
                ...k,
                key: `vnc_live_pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
                secret: `vnc_live_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
              }
            : k
        )
      );
      alert('API Key regenerated successfully!');
    }
  };

  const deleteKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      alert('API Key deleted successfully!');
    }
  };

  const exportKeys = () => {
    const header = ['id', 'name', 'key', 'type', 'status', 'createdAt', 'expiresAt', 'requests', 'rateLimit', 'fullAccess'];
    const rows = apiKeys.map((k) => [
      k.id,
      k.name,
      k.key,
      k.type,
      k.status,
      k.createdAt,
      k.expiresAt,
      k.requests,
      k.rateLimit,
      k.fullAccess,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api_keys_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-400" />
            API Keys Management
          </h1>
          <p className="text-gray-400">Enterprise API authentication & access control</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Key
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Key className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.activeKeys}</div>
              <div className="text-sm text-gray-400">Active Keys</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalRequests.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.avgResponseTime}ms</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700 overflow-x-auto">
        {[
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'logs', label: 'Activity Logs', icon: Terminal },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'keys' | 'analytics' | 'logs' | 'settings')}
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

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search API keys"
                  placeholder="Search API keys, name, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportKeys}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-white">{apiKey.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          apiKey.status === 'active'
                            ? 'bg-green-500/20 text-green-300'
                            : apiKey.status === 'expired'
                            ? 'bg-red-500/20 text-red-300'
                            : apiKey.status === 'suspended'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {apiKey.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold">
                        {apiKey.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">API Key</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-white font-mono flex-1 truncate">
                            {showSecrets[apiKey.id] ? apiKey.key : 'ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½'}
                          </code>
                          <button
                            onClick={() =>
                              setShowSecrets((prev) => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))
                            }
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            {showSecrets[apiKey.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(apiKey.key);
                              alert('API Key copied to clipboard!');
                            }}
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Secret Key</div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-white font-mono flex-1 truncate">
                            {showSecrets[`${apiKey.id}-secret`]
                              ? apiKey.secret
                              : 'ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½'}
                          </code>
                          <button
                            onClick={() =>
                              setShowSecrets((prev) => ({
                                ...prev,
                                [`${apiKey.id}-secret`]: !prev[`${apiKey.id}-secret`],
                              }))
                            }
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            {showSecrets[`${apiKey.id}-secret`] ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(apiKey.secret);
                              alert('Secret Key copied to clipboard!');
                            }}
                            className="p-1 hover:bg-gray-800 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-gray-400">Requests</div>
                        <div className="text-white font-semibold">{apiKey.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Rate Limit</div>
                        <div className="text-white font-semibold">{apiKey.rateLimit}/min</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Created</div>
                        <div className="text-white font-semibold">{apiKey.createdAt}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Last Used</div>
                        <div className="text-white font-semibold">{apiKey.lastUsed}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleFullAccess(apiKey.id)}
                      className={`px-3 py-2 rounded text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${
                        apiKey.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                      title="1000% Access"
                    >
                      {apiKey.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {apiKey.fullAccess ? '1000%' : 'Limited'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(apiKey)}
                        title="View"
                        className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(apiKey)}
                        title="Edit"
                        className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => regenerateKey(apiKey.id)}
                        title="Regenerate"
                        className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => revokeKey(apiKey.id)}
                        title="Revoke"
                        className="p-2 bg-yellow-800/20 border border-yellow-700 rounded hover:bg-yellow-800/30 text-yellow-400"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteKey(apiKey.id)}
                        title="Delete"
                        className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredKeys.length === 0 && (
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No API Keys Found</h3>
                <p className="text-gray-400">Create a new API key to get started</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Response Time</th>
                  <th className="pb-2">Success Rate</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC API', time: '45ms', rate: '99.8%', rating: 100 },
                  { name: 'AWS API Gateway', time: '120ms', rate: '99.5%', rating: 92 },
                  { name: 'Google Cloud', time: '95ms', rate: '99.6%', rating: 94 },
                  { name: 'Azure API', time: '110ms', rate: '99.4%', rating: 91 },
                  { name: 'Cloudflare', time: '85ms', rate: '99.7%', rating: 95 },
                ].map((p) => (
                  <tr key={p.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{p.name}</td>
                    <td className="py-2 text-green-400">{p.time}</td>
                    <td className="py-2 text-blue-400">{p.rate}</td>
                    <td className="py-2 text-yellow-400">{p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Request Distribution</h3>
            <div className="space-y-3">
              {[
                { endpoint: '/api/blockchain/blocks', requests: 456789, color: 'blue' },
                { endpoint: '/api/validators/list', requests: 234567, color: 'green' },
                { endpoint: '/api/transactions/query', requests: 123456, color: 'purple' },
                { endpoint: '/api/tokens/balance', requests: 89012, color: 'yellow' },
              ].map((item) => (
                <div key={item.endpoint}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-mono truncate">{item.endpoint}</span>
                    <span className="text-sm text-white font-semibold">{item.requests.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full`}
                      style={{ width: `${(item.requests / 456789) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Response Time Trends</h3>
            <div className="space-y-3">
              {[
                { time: '00:00', avg: 42, icon: Clock },
                { time: '06:00', avg: 38, icon: Clock },
                { time: '12:00', avg: 52, icon: Clock },
                { time: '18:00', avg: 45, icon: Clock },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{item.time}</span>
                  </div>
                  <span className="text-white font-bold">{item.avg}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Error Rate Analysis</h3>
            <div className="space-y-3">
              {[
                { code: '200 Success', count: 1214567, rate: 99.8, color: 'green' },
                { code: '400 Bad Request', count: 1234, rate: 0.1, color: 'yellow' },
                { code: '401 Unauthorized', count: 567, rate: 0.05, color: 'orange' },
                { code: '500 Server Error', count: 234, rate: 0.05, color: 'red' },
              ].map((item) => (
                <div key={item.code} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div>
                    <div className="text-sm text-white font-semibold">{item.code}</div>
                    <div className="text-xs text-gray-400">{item.count.toLocaleString()} requests</div>
                  </div>
                  <span className={`text-${item.color}-400 font-bold`}>{item.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              {
                time: '2026-01-15 14:23:45',
                key: 'Production API Key',
                action: 'API Request',
                endpoint: '/api/blockchain/blocks',
                status: 'success',
              },
              {
                time: '2026-01-15 14:20:12',
                key: 'Mobile App Key',
                action: 'Rate Limit Exceeded',
                endpoint: '/api/validators/list',
                status: 'warning',
              },
              {
                time: '2026-01-15 14:15:33',
                key: 'Production API Key',
                action: 'API Request',
                endpoint: '/api/transactions/query',
                status: 'success',
              },
              {
                time: '2026-01-15 14:10:22',
                key: 'Testing Key',
                action: 'Authentication Failed',
                endpoint: '/api/tokens/transfer',
                status: 'error',
              },
              {
                time: '2026-01-15 14:05:11',
                key: 'Production API Key',
                action: 'Key Regenerated',
                endpoint: 'N/A',
                status: 'info',
              },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-sm text-gray-400 w-40">{log.time}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{log.key}</div>
                    <div className="text-xs text-gray-400">{log.action}</div>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">{log.endpoint}</div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    log.status === 'success'
                      ? 'bg-green-500/20 text-green-300'
                      : log.status === 'warning'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : log.status === 'error'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Default Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Default Rate Limit (per minute)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="10000"
                  defaultValue="10000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Key Expiration (days)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="365"
                  defaultValue="365"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Max Keys Per User</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="10"
                  defaultValue="10"
                />
              </div>
              <button className="px-4 py-2 bg-green-600 rounded text-white">Save Settings</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
            <div className="space-y-3">
              {[
                { name: 'Require IP Whitelist', enabled: true },
                { name: 'Enable Rate Limiting', enabled: true },
                { name: 'Auto-Revoke Expired Keys', enabled: true },
                { name: 'Two-Factor Authentication', enabled: false },
              ].map((setting) => (
                <div key={setting.name} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <span className="text-sm text-white">{setting.name}</span>
                  <button
                    className={`px-3 py-1 rounded text-xs ${
                      setting.enabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {setting.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Webhook Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Webhook URL</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono text-sm"
                  placeholder="https://api.example.com/webhooks"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Events</label>
                <select className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white">
                  <option>All Events</option>
                  <option>Key Created</option>
                  <option>Key Revoked</option>
                  <option>Rate Limit Exceeded</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 rounded text-white">Test Webhook</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">API Documentation</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center justify-between p-3 bg-gray-900 rounded hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">Getting Started Guide</span>
                </div>
                <span className="text-gray-400">?</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 bg-gray-900 rounded hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">API Reference</span>
                </div>
                <span className="text-gray-400">?</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 bg-gray-900 rounded hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white">Security Best Practices</span>
                </div>
                <span className="text-gray-400">?</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedKey && (
        <ViewModal
          apiKey={selectedKey}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedKey && (
        <EditModal apiKey={selectedKey} onCancel={() => setShowEditModal(false)} onSave={saveApiKey} />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Create New API Key</h3>
            <p className="text-gray-400 mb-6">
              A new API key will be generated with default settings. You can customize it after creation.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-700 rounded text-white">
                Cancel
              </button>
              <button
                onClick={createNewKey}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewModal({ apiKey, onClose, onEdit }: { apiKey: ApiKey; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{apiKey.name}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="px-3 py-2 bg-blue-600 rounded text-white">
              Edit
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-400">Type</div>
            <div className="text-lg text-white capitalize">{apiKey.type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-lg text-white capitalize">{apiKey.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Created</div>
            <div className="text-lg text-white">{apiKey.createdAt}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Expires</div>
            <div className="text-lg text-white">{apiKey.expiresAt}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Requests</div>
            <div className="text-lg text-green-400">{apiKey.requests.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Rate Limit</div>
            <div className="text-lg text-blue-400">{apiKey.rateLimit}/min</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">Permissions</div>
          <div className="flex flex-wrap gap-2">
            {apiKey.permissions.map((perm) => (
              <span key={perm} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                {perm.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {apiKey.ipWhitelist.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2">IP Whitelist</div>
            <div className="flex flex-wrap gap-2">
              {apiKey.ipWhitelist.map((ip) => (
                <span key={ip} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-mono">
                  {ip}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EditModal({
  apiKey,
  onCancel,
  onSave,
}: {
  apiKey: ApiKey;
  onCancel: () => void;
  onSave: (key: ApiKey) => void;
}) {
  const [form, setForm] = useState<ApiKey>({ ...apiKey });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edit API Key</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ApiKeyType })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              <option value="full-access">Full Access</option>
              <option value="read-only">Read Only</option>
              <option value="write-only">Write Only</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ApiKeyStatus })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Rate Limit (per minute)</label>
            <input
              type="number"
              value={form.rateLimit}
              onChange={(e) => setForm({ ...form, rateLimit: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Expires At</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Full Access (1000%)</label>
            <button
              onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })}
              className={`px-3 py-2 rounded ${form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              {form.fullAccess ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white"
          >
            Save Changes
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

