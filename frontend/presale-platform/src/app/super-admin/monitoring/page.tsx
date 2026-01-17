'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Server,
  Database,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Search,
  BarChart3,
  LineChart,
  Lock,
  Unlock,
  Bell,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

type MetricStatus = 'healthy' | 'warning' | 'critical' | 'offline';
type MetricCategory = 'system' | 'network' | 'database' | 'application' | 'security';

interface SystemMetric {
  id: string;
  name: string;
  category: MetricCategory;
  value: number;
  unit: string;
  status: MetricStatus;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  fullAccess: boolean;
}

interface AlertItem {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  source: string;
}

const INITIAL_METRICS: SystemMetric[] = [
  {
    id: 'm1',
    name: 'CPU Usage',
    category: 'system',
    value: 24.5,
    unit: '%',
    status: 'healthy',
    threshold: 80,
    trend: 'stable',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm2',
    name: 'Memory Usage',
    category: 'system',
    value: 38.2,
    unit: '%',
    status: 'healthy',
    threshold: 85,
    trend: 'up',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm3',
    name: 'Disk I/O',
    category: 'system',
    value: 156.8,
    unit: 'MB/s',
    status: 'healthy',
    threshold: 500,
    trend: 'stable',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm4',
    name: 'Network Latency',
    category: 'network',
    value: 15.3,
    unit: 'ms',
    status: 'healthy',
    threshold: 100,
    trend: 'down',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm5',
    name: 'Active Connections',
    category: 'network',
    value: 1248,
    unit: 'conns',
    status: 'healthy',
    threshold: 5000,
    trend: 'up',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm6',
    name: 'Database Queries',
    category: 'database',
    value: 342,
    unit: 'qps',
    status: 'healthy',
    threshold: 1000,
    trend: 'stable',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm7',
    name: 'Error Rate',
    category: 'application',
    value: 0.12,
    unit: '%',
    status: 'healthy',
    threshold: 1,
    trend: 'down',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm8',
    name: 'Response Time',
    category: 'application',
    value: 142,
    unit: 'ms',
    status: 'healthy',
    threshold: 500,
    trend: 'stable',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm9',
    name: 'Failed Login Attempts',
    category: 'security',
    value: 3,
    unit: 'count',
    status: 'healthy',
    threshold: 20,
    trend: 'stable',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
  {
    id: 'm10',
    name: 'Active Users',
    category: 'application',
    value: 234,
    unit: 'users',
    status: 'healthy',
    threshold: 1000,
    trend: 'up',
    lastUpdated: '2026-01-15 13:30:00',
    fullAccess: true,
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    severity: 'warning',
    title: 'High Memory Usage',
    message: 'Memory usage has reached 85% on node-2',
    timestamp: '2026-01-15 12:45:00',
    resolved: false,
    source: 'System Monitor',
  },
  {
    id: 'a2',
    severity: 'info',
    title: 'Scheduled Maintenance',
    message: 'System backup completed successfully',
    timestamp: '2026-01-15 11:30:00',
    resolved: true,
    source: 'Backup Service',
  },
  {
    id: 'a3',
    severity: 'critical',
    title: 'Database Connection Timeout',
    message: 'Unable to connect to replica database',
    timestamp: '2026-01-15 10:15:00',
    resolved: true,
    source: 'Database Monitor',
  },
];

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>(INITIAL_METRICS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'alerts' | 'logs' | 'analytics'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const stats = useMemo(() => {
    const healthy = metrics.filter((m) => m.status === 'healthy').length;
    const warning = metrics.filter((m) => m.status === 'warning').length;
    const critical = metrics.filter((m) => m.status === 'critical').length;
    const unresolvedAlerts = alerts.filter((a) => !a.resolved).length;
    return { healthy, warning, critical, unresolvedAlerts };
  }, [metrics, alerts]);

  const filtered = useMemo(() => {
    return metrics
      .filter((m) => (categoryFilter === 'all' ? true : m.category === categoryFilter))
      .filter((m) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      });
  }, [metrics, query, categoryFilter]);

  const toggleFullAccess = (id: string) => {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, fullAccess: !m.fullAccess } : m)));
  };

  const refreshMetrics = () => {
    alert('Metrics refreshed successfully!');
  };

  const exportData = () => {
    const header = ['id', 'name', 'category', 'value', 'unit', 'status', 'threshold', 'trend', 'lastUpdated'];
    const rows = metrics.map((m) => [m.id, m.name, m.category, m.value, m.unit, m.status, m.threshold, m.trend, m.lastUpdated]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monitoring_data_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const getStatusColor = (status: MetricStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      case 'offline':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: MetricStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            System Monitoring
          </h1>
          <p className="text-gray-400">Real-time monitoring & performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-Refresh' : 'Manual'}
          </button>
          <button onClick={refreshMetrics} className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.healthy}</div>
              <div className="text-sm text-gray-400">Healthy</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.warning}</div>
              <div className="text-sm text-gray-400">Warning</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.critical}</div>
              <div className="text-sm text-gray-400">Critical</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Bell className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.unresolvedAlerts}</div>
              <div className="text-sm text-gray-400">Active Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'metrics', label: 'Metrics', icon: BarChart3 },
          { id: 'alerts', label: 'Alerts', icon: Bell },
          { id: 'logs', label: 'Logs', icon: Database },
          { id: 'analytics', label: 'Analytics', icon: LineChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'metrics' | 'alerts' | 'logs' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'
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
          {/* Real-time Metrics Grid */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Real-time Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(0, 6).map((metric) => (
                <div key={metric.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="text-sm font-semibold text-white">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-400" />}
                      {metric.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-400" />}
                      {metric.trend === 'stable' && <TrendingUp className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">{metric.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Threshold</div>
                      <div className="text-sm text-gray-400">{metric.threshold} {metric.unit}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                System Resources
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'CPU', value: 24.5, max: 100, color: 'blue' },
                  { label: 'Memory', value: 38.2, max: 100, color: 'purple' },
                  { label: 'Disk', value: 62.8, max: 100, color: 'yellow' },
                  { label: 'Network', value: 15.3, max: 100, color: 'green' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2">
                      <div
                        className={`bg-${item.color}-500 h-2 rounded-full transition-all`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white mb-1">{alert.title}</div>
                        <div className="text-xs text-gray-400">{alert.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
                      </div>
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              24-Hour Performance Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Avg Response Time', value: '142ms', change: '-8%', trend: 'down' },
                { label: 'Requests/Min', value: '1,248', change: '+12%', trend: 'up' },
                { label: 'Error Rate', value: '0.12%', change: '-5%', trend: 'down' },
                { label: 'Uptime', value: '99.98%', change: '+0.1%', trend: 'up' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">{item.label}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div
                      className={`text-sm font-semibold ${
                        item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search metrics"
                  placeholder="Search metrics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Categories</option>
                <option value="system">System</option>
                <option value="network">Network</option>
                <option value="database">Database</option>
                <option value="application">Application</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
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
                    <th className="px-4 py-3">Metric</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Current Value</th>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Trend</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Access</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((metric) => (
                    <tr key={metric.id} className="border-t border-gray-700 hover:bg-gray-900">
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-white">{metric.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 capitalize">
                          {metric.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-white">
                          {metric.value.toLocaleString()} {metric.unit}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {metric.threshold} {metric.unit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(metric.status)}
                          <span className={`text-sm font-semibold ${getStatusColor(metric.status)} capitalize`}>
                            {metric.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {metric.trend === 'up' && (
                            <>
                              <ArrowUp className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400">Up</span>
                            </>
                          )}
                          {metric.trend === 'down' && (
                            <>
                              <ArrowDown className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400">Down</span>
                            </>
                          )}
                          {metric.trend === 'stable' && (
                            <>
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">Stable</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{metric.lastUpdated}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFullAccess(metric.id)}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            metric.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {metric.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Active & Recent Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.resolved
                      ? 'bg-gray-900 border-gray-700 opacity-60'
                      : alert.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/30'
                      : alert.severity === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div>
                        {alert.severity === 'critical' && <XCircle className="w-5 h-5 text-red-400" />}
                        {alert.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                        {alert.severity === 'info' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{alert.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              alert.severity === 'critical'
                                ? 'bg-red-500/20 text-red-300'
                                : alert.severity === 'warning'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                          {alert.resolved && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-300">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">{alert.message}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </div>
                          <div className="flex items-center gap-1">
                            <Server className="w-3 h-3" />
                            {alert.source}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded text-sm font-semibold"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            System Logs
          </h2>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-1">
            {[
              '[2026-01-15 13:30:45] INFO: System health check completed - All services operational',
              '[2026-01-15 13:29:12] WARN: Memory usage reached 85% on node-2',
              '[2026-01-15 13:28:03] INFO: Database backup completed successfully',
              '[2026-01-15 13:27:21] INFO: User authentication successful - user_id: 12345',
              '[2026-01-15 13:26:54] DEBUG: Cache cleared - 1,234 entries removed',
              '[2026-01-15 13:25:33] INFO: API request processed - endpoint: /api/users - latency: 142ms',
              '[2026-01-15 13:24:18] WARN: Rate limit reached for IP: 192.168.1.100',
              '[2026-01-15 13:23:45] INFO: Scheduled task executed - task: data_cleanup',
              '[2026-01-15 13:22:29] ERROR: Connection timeout to replica database - retrying...',
              '[2026-01-15 13:21:07] INFO: New user registration - email: user@example.com',
            ].map((log, i) => (
              <div
                key={i}
                className={`py-1 ${
                  log.includes('ERROR')
                    ? 'text-red-400'
                    : log.includes('WARN')
                    ? 'text-yellow-400'
                    : log.includes('DEBUG')
                    ? 'text-purple-400'
                    : 'text-green-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Uptime</th>
                  <th className="pb-2">Response</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Platform', uptime: '99.98%', response: '142ms', rating: 100 },
                  { name: 'AWS', uptime: '99.95%', response: '230ms', rating: 95 },
                  { name: 'Azure', uptime: '99.92%', response: '265ms', rating: 93 },
                  { name: 'GCP', uptime: '99.90%', response: '285ms', rating: 91 },
                ].map((platform) => (
                  <tr key={platform.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{platform.name}</td>
                    <td className="py-2 text-green-400">{platform.uptime}</td>
                    <td className="py-2 text-blue-400">{platform.response}</td>
                    <td className="py-2 text-yellow-400">{platform.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Resource Usage Trends</h3>
            <div className="space-y-4">
              {[
                { label: 'Peak CPU Usage', value: '45%', time: '13:15 PM' },
                { label: 'Peak Memory', value: '72%', time: '12:30 PM' },
                { label: 'Max Connections', value: '2,456', time: '14:20 PM' },
                { label: 'Highest Latency', value: '285ms', time: '11:45 AM' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.time}</div>
                  </div>
                  <div className="text-lg font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Alert Statistics</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Alerts (24h)', value: 23, color: 'blue' },
                { label: 'Critical', value: 2, color: 'red' },
                { label: 'Warning', value: 8, color: 'yellow' },
                { label: 'Info', value: 13, color: 'green' },
                { label: 'Resolved', value: 20, color: 'purple' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className={`text-lg font-bold text-${item.color}-400`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Performance Score</h3>
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                98.5
              </div>
              <div className="text-sm text-gray-400">Overall System Health</div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-400">100</div>
                  <div className="text-xs text-gray-400">Availability</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">95</div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">98</div>
                  <div className="text-xs text-gray-400">Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

