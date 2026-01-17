'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Activity,
  CheckCircle,
  Zap,
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Shield,
  Eye,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  PieChart,
  LineChart,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Search,
} from 'lucide-react';

type NodeStatus = 'active' | 'syncing' | 'offline' | 'warning';
type NodeType = 'validator' | 'full' | 'light' | 'archive';

interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  location: string;
  country: string;
  type: NodeType;
  status: NodeStatus;
  uptime: number;
  latency: number;
  peers: number;
  blockHeight: number;
  version: string;
  cpu: number;
  memory: number;
  disk: number;
  bandwidth: { in: string; out: string };
  lastSeen: string;
  fullAccess: boolean;
}

interface NetworkMetric {
  timestamp: string;
  tps: number;
  blockTime: number;
  gasPrice: number;
  activeNodes: number;
}

const INITIAL_NODES: NetworkNode[] = [
  {
    id: 'n1',
    name: 'VNC-US-East-01',
    ip: '192.168.1.100',
    location: 'New York, USA',
    country: 'US',
    type: 'validator',
    status: 'active',
    uptime: 99.99,
    latency: 12,
    peers: 145,
    blockHeight: 1250000,
    version: '1.2.5',
    cpu: 45,
    memory: 62,
    disk: 78,
    bandwidth: { in: '125 MB/s', out: '98 MB/s' },
    lastSeen: '2026-01-15 12:00:00',
    fullAccess: true,
  },
  {
    id: 'n2',
    name: 'VNC-EU-West-01',
    ip: '192.168.2.100',
    location: 'London, UK',
    country: 'GB',
    type: 'validator',
    status: 'active',
    uptime: 99.95,
    latency: 18,
    peers: 132,
    blockHeight: 1249998,
    version: '1.2.5',
    cpu: 52,
    memory: 58,
    disk: 72,
    bandwidth: { in: '110 MB/s', out: '85 MB/s' },
    lastSeen: '2026-01-15 12:00:15',
    fullAccess: true,
  },
  {
    id: 'n3',
    name: 'VNC-Asia-01',
    ip: '192.168.3.100',
    location: 'Singapore',
    country: 'SG',
    type: 'full',
    status: 'syncing',
    uptime: 98.5,
    latency: 45,
    peers: 89,
    blockHeight: 1249850,
    version: '1.2.4',
    cpu: 68,
    memory: 75,
    disk: 65,
    bandwidth: { in: '95 MB/s', out: '72 MB/s' },
    lastSeen: '2026-01-15 11:59:45',
    fullAccess: false,
  },
  {
    id: 'n4',
    name: 'VNC-SA-01',
    ip: '192.168.4.100',
    location: 'SÃ£o Paulo, Brazil',
    country: 'BR',
    type: 'full',
    status: 'warning',
    uptime: 95.2,
    latency: 120,
    peers: 45,
    blockHeight: 1249500,
    version: '1.2.3',
    cpu: 85,
    memory: 88,
    disk: 92,
    bandwidth: { in: '45 MB/s', out: '32 MB/s' },
    lastSeen: '2026-01-15 11:58:30',
    fullAccess: false,
  },
];

const MOCK_METRICS: NetworkMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${23 - i}h ago`,
  tps: Math.floor(Math.random() * 50000) + 350000,
  blockTime: Math.random() * 0.005 + 0.002,
  gasPrice: Math.random() * 0.5 + 0.1,
  activeNodes: Math.floor(Math.random() * 10) + 40,
}));

export default function NetworkPage() {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [metrics, _setMetrics] = useState<NetworkMetric[]>(MOCK_METRICS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'metrics' | 'analytics'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          cpu: Math.min(95, Math.max(10, n.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.min(95, Math.max(20, n.memory + (Math.random() - 0.5) * 8)),
          latency: Math.max(5, n.latency + (Math.random() - 0.5) * 20),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const stats = useMemo(() => {
    const active = nodes.filter((n) => n.status === 'active').length;
    const syncing = nodes.filter((n) => n.status === 'syncing').length;
    const offline = nodes.filter((n) => n.status === 'offline').length;
    const avgUptime = nodes.reduce((s, n) => s + n.uptime, 0) / nodes.length;
    const avgLatency = nodes.reduce((s, n) => s + n.latency, 0) / nodes.length;
    const totalPeers = nodes.reduce((s, n) => s + n.peers, 0);
    const maxBlockHeight = Math.max(...nodes.map((n) => n.blockHeight));
    const currentTPS = metrics[0]?.tps || 400000;
    return { active, syncing, offline, avgUptime, avgLatency, totalPeers, maxBlockHeight, currentTPS };
  }, [nodes, metrics]);

  const filtered = useMemo(() => {
    return nodes
      .filter((n) => (statusFilter === 'all' ? true : n.status === statusFilter))
      .filter((n) => (typeFilter === 'all' ? true : n.type === typeFilter))
      .filter((n) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return n.name.toLowerCase().includes(q) || n.location.toLowerCase().includes(q) || n.ip.includes(q);
      })
      .sort((a, b) => b.uptime - a.uptime);
  }, [nodes, query, statusFilter, typeFilter]);

  const handleView = (node: NetworkNode) => {
    setSelectedNode(node);
    setShowViewModal(true);
  };

  const handleEdit = (node: NetworkNode) => {
    setSelectedNode(node);
    setShowEditModal(true);
  };

  const saveNode = (updated: NetworkNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setShowEditModal(false);
    alert('Node updated successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, fullAccess: !n.fullAccess } : n)));
  };

  const restartNode = (id: string) => {
    if (confirm('Are you sure you want to restart this node?')) {
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'syncing' as NodeStatus, cpu: 20, memory: 30 } : n))
      );
      setTimeout(() => {
        setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'active' as NodeStatus } : n)));
      }, 3000);
    }
  };

  const removeNode = (id: string) => {
    if (confirm('Are you sure you want to remove this node?')) {
      setNodes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const exportNodes = () => {
    const header = ['id', 'name', 'ip', 'location', 'type', 'status', 'uptime', 'latency', 'peers', 'blockHeight', 'version'];
    const rows = nodes.map((n) => [n.id, n.name, n.ip, n.location, n.type, n.status, n.uptime, n.latency, n.peers, n.blockHeight, n.version]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `\"${String(cell).replace(/\"/g, '\"\"')}\"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_nodes_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Globe className="w-8 h-8 text-green-400" />
            Network Command Center
          </h1>
          <p className="text-gray-400">Real-time network monitoring, analytics, and control</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.avgUptime.toFixed(2)}%</div>
              <div className="text-sm text-gray-400">Avg Uptime</div>
            </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +0.05% from last hour
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.currentTPS.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Current TPS</div>
            </div>
          </div>
          <div className="text-xs text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Peak: 450k TPS
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Server className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.active}</div>
              <div className="text-sm text-gray-400">Active Nodes</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{stats.syncing} syncing, {stats.offline} offline</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-orange-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.avgLatency.toFixed(0)}ms</div>
              <div className="text-sm text-gray-400">Avg Latency</div>
            </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -5ms improvement
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'nodes', label: 'Nodes', icon: Server },
          { id: 'metrics', label: 'Metrics', icon: LineChart },
          { id: 'analytics', label: 'Analytics', icon: PieChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'nodes' | 'metrics' | 'analytics')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Network Health */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Network Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Block Height</div>
                <div className="text-2xl font-bold text-white">{stats.maxBlockHeight.toLocaleString()}</div>
                <div className="text-xs text-green-400 mt-1">+1 block every 0.0025s</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Total Peers</div>
                <div className="text-2xl font-bold text-white">{stats.totalPeers}</div>
                <div className="text-xs text-blue-400 mt-1">Across {nodes.length} nodes</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Network Version</div>
                <div className="text-2xl font-bold text-white">v1.2.5</div>
                <div className="text-xs text-purple-400 mt-1">Latest stable release</div>
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              Geographic Distribution
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['North America', 'Europe', 'Asia Pacific', 'South America'].map((region, i) => (
                <div key={region} className="bg-gray-900 rounded-lg p-4 text-center">
                  <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-white">{region}</div>
                  <div className="text-2xl font-bold text-green-400">{i === 0 ? 12 : i === 1 ? 18 : i === 2 ? 9 : 6}</div>
                  <div className="text-xs text-gray-400">nodes</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Performance */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Live Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Block Time</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">0.0025s</div>
                <div className="text-xs text-green-400 mt-1">Ultra-fast</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Gas Price</span>
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">0.001 VNC</div>
                <div className="text-xs text-green-400 mt-1">Minimal cost</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Network Load</span>
                  <Cpu className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">42%</div>
                <div className="text-xs text-yellow-400 mt-1">Optimal range</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Data Throughput</span>
                  <HardDrive className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">2.4 GB/s</div>
                <div className="text-xs text-green-400 mt-1">High capacity</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nodes Tab */}
      {activeTab === 'nodes' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search nodes"
                  placeholder="Search nodes, location, IP..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                <option value="syncing">Syncing</option>
                <option value="offline">Offline</option>
                <option value="warning">Warning</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Types</option>
                <option value="validator">Validator</option>
                <option value="full">Full Node</option>
                <option value="light">Light Node</option>
                <option value="archive">Archive</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportNodes}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3">Node</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Uptime</th>
                    <th className="px-4 py-3">Latency</th>
                    <th className="px-4 py-3">Resources</th>
                    <th className="px-4 py-3">Peers</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((node) => (
                    <tr key={node.id} className="border-t border-gray-700 hover:bg-gray-900">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{node.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{node.ip}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-white">{node.location}</div>
                            <div className="text-xs text-gray-400">{node.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            node.type === 'validator'
                              ? 'bg-purple-500/20 text-purple-300'
                              : node.type === 'full'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {node.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {node.status === 'active' && <Wifi className="w-4 h-4 text-green-400" />}
                          {node.status === 'syncing' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                          {node.status === 'offline' && <WifiOff className="w-4 h-4 text-red-400" />}
                          {node.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                          <span
                            className={`text-sm font-semibold ${
                              node.status === 'active'
                                ? 'text-green-400'
                                : node.status === 'syncing'
                                ? 'text-blue-400'
                                : node.status === 'warning'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {node.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-white">{node.uptime.toFixed(2)}%</div>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`text-sm font-semibold ${
                            node.latency < 30 ? 'text-green-400' : node.latency < 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}
                        >
                          {node.latency.toFixed(0)}ms
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-blue-400" />
                            <div className="text-xs text-gray-300">CPU: {node.cpu.toFixed(0)}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="w-3 h-3 text-purple-400" />
                            <div className="text-xs text-gray-300">RAM: {node.memory.toFixed(0)}%</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{node.peers}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFullAccess(node.id)}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            node.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {node.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(node)}
                            title="View"
                            className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(node)}
                            title="Edit"
                            className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => restartNode(node.id)}
                            title="Restart"
                            className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeNode(node.id)}
                            title="Remove"
                            className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">24-Hour Performance Trends</h2>
            <div className="space-y-4">
              {metrics.slice(0, 10).map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-gray-400 w-20">{m.timestamp}</div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <div className="text-sm text-white">{m.tps.toLocaleString()} TPS</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <div className="text-sm text-white">{m.blockTime.toFixed(4)}s</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-green-400" />
                      <div className="text-sm text-white">{m.activeNodes} nodes</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Gas: ${m.gasPrice.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Network Comparison</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Network</th>
                  <th className="pb-2">TPS</th>
                  <th className="pb-2">Latency</th>
                  <th className="pb-2">Nodes</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Blockchain', tps: '400,000', latency: '15ms', nodes: 45, rating: 100 },
                  { name: 'Solana', tps: '65,000', latency: '400ms', nodes: 1900, rating: 92 },
                  { name: 'Polygon', tps: '7,000', latency: '2s', nodes: 100, rating: 85 },
                  { name: 'Ethereum', tps: '15', latency: '13s', nodes: 7500, rating: 88 },
                  { name: 'BSC', tps: '160', latency: '3s', nodes: 21, rating: 78 },
                ].map((n) => (
                  <tr key={n.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{n.name}</td>
                    <td className="py-2 text-green-400">{n.tps}</td>
                    <td className="py-2 text-blue-400">{n.latency}</td>
                    <td className="py-2 text-purple-400">{n.nodes}</td>
                    <td className="py-2 text-yellow-400">{n.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Node Type Distribution</h3>
            <div className="space-y-3">
              {[
                { type: 'Validator Nodes', count: 18, color: 'purple' },
                { type: 'Full Nodes', count: 22, color: 'blue' },
                { type: 'Light Nodes', count: 5, color: 'green' },
              ].map((t) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{t.type}</span>
                    <span className="text-sm text-white font-semibold">{t.count}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className={`bg-${t.color}-500 h-2 rounded-full`}
                      style={{ width: `${(t.count / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Bandwidth Usage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Total Inbound</span>
                </div>
                <span className="text-white font-bold">4.2 GB/s</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Total Outbound</span>
                </div>
                <span className="text-white font-bold">3.8 GB/s</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Peak Traffic</span>
                </div>
                <span className="text-white font-bold">8.5 GB/s</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Security Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">DDoS Protection</span>
                </div>
                <span className="text-green-400 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">SSL/TLS Encryption</span>
                </div>
                <span className="text-green-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Security Incidents</span>
                </div>
                <span className="text-green-400 font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedNode.name}</h3>
                <div className="text-sm text-gray-400 font-mono">{selectedNode.ip}</div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">Location</div>
                <div className="text-lg text-white">{selectedNode.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Type</div>
                <div className="text-lg text-white">{selectedNode.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-lg text-white">{selectedNode.status}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Version</div>
                <div className="text-lg text-white">{selectedNode.version}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Uptime</div>
                <div className="text-lg text-green-400">{selectedNode.uptime.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Latency</div>
                <div className="text-lg text-blue-400">{selectedNode.latency.toFixed(0)}ms</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Peers</div>
                <div className="text-lg text-purple-400">{selectedNode.peers}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Block Height</div>
                <div className="text-lg text-yellow-400">{selectedNode.blockHeight.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">CPU Usage</div>
                <div className="text-lg text-white">{selectedNode.cpu.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Memory Usage</div>
                <div className="text-lg text-white">{selectedNode.memory.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Disk Usage</div>
                <div className="text-lg text-white">{selectedNode.disk.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Bandwidth</div>
                <div className="text-sm text-white">
                  ? {selectedNode.bandwidth.in} / ? {selectedNode.bandwidth.out}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedNode && (
        <EditModal node={selectedNode} onCancel={() => setShowEditModal(false)} onSave={saveNode} />
      )}
    </div>
  );
}

function EditModal({ node, onCancel, onSave }: { node: NetworkNode; onCancel: () => void; onSave: (n: NetworkNode) => void }) {
  const [form, setForm] = useState<NetworkNode>({ ...node });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edit Network Node</h3>
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
            <label className="text-xs text-gray-400">IP Address</label>
            <input
              value={form.ip}
              onChange={(e) => setForm({ ...form, ip: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as NodeType })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              <option value="validator">Validator</option>
              <option value="full">Full Node</option>
              <option value="light">Light Node</option>
              <option value="archive">Archive</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as NodeStatus })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            >
              <option value="active">Active</option>
              <option value="syncing">Syncing</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Version</label>
            <input
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
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

