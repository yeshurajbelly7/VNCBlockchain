'use client';

import React, { useMemo, useState } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Activity,
  Clock,
  Download,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Fingerprint,
  MapPin,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';
type SecurityEventType = 'login' | 'access' | 'modification' | 'breach' | 'scan' | 'block';
type SessionStatus = 'active' | 'expired' | 'suspicious' | 'terminated';

interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: ThreatLevel;
  title: string;
  description: string;
  ipAddress: string;
  location: string;
  timestamp: string;
  user: string;
  device: string;
  resolved: boolean;
  fullAccess: boolean;
}

interface ActiveSession {
  id: string;
  user: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActivity: string;
  status: SessionStatus;
  suspicious: boolean;
  fullAccess: boolean;
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: ThreatLevel;
  category: string;
  lastTriggered: string;
  triggerCount: number;
  fullAccess: boolean;
}

const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: 'e1',
    type: 'login',
    severity: 'medium',
    title: 'Failed Login Attempt',
    description: 'Multiple failed login attempts from unknown IP',
    ipAddress: '192.168.1.105',
    location: 'New York, USA',
    timestamp: '2026-01-15 13:25:00',
    user: 'admin@vnc.com',
    device: 'Windows 11',
    resolved: false,
    fullAccess: true,
  },
  {
    id: 'e2',
    type: 'access',
    severity: 'low',
    title: 'Successful Admin Login',
    description: 'Admin user logged in successfully',
    ipAddress: '203.0.113.45',
    location: 'London, UK',
    timestamp: '2026-01-15 13:20:00',
    user: 'superadmin@vnc.com',
    device: 'MacOS',
    resolved: true,
    fullAccess: true,
  },
  {
    id: 'e3',
    type: 'breach',
    severity: 'critical',
    title: 'Unauthorized Access Attempt',
    description: 'Attempt to access restricted admin panel',
    ipAddress: '198.51.100.23',
    location: 'Unknown',
    timestamp: '2026-01-15 12:45:00',
    user: 'Unknown',
    device: 'Linux',
    resolved: true,
    fullAccess: true,
  },
];

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 's1',
    user: 'superadmin@vnc.com',
    ipAddress: '203.0.113.45',
    location: 'London, UK',
    device: 'MacBook Pro',
    browser: 'Chrome 120',
    loginTime: '2026-01-15 13:20:00',
    lastActivity: '2026-01-15 13:30:00',
    status: 'active',
    suspicious: false,
    fullAccess: true,
  },
  {
    id: 's2',
    user: 'admin@vnc.com',
    ipAddress: '192.168.1.100',
    location: 'New York, USA',
    device: 'Windows 11',
    browser: 'Edge 120',
    loginTime: '2026-01-15 12:00:00',
    lastActivity: '2026-01-15 13:28:00',
    status: 'active',
    suspicious: false,
    fullAccess: true,
  },
  {
    id: 's3',
    user: 'moderator@vnc.com',
    ipAddress: '198.51.100.88',
    location: 'Tokyo, Japan',
    device: 'iPhone 15',
    browser: 'Safari 17',
    loginTime: '2026-01-15 11:30:00',
    lastActivity: '2026-01-15 11:45:00',
    status: 'suspicious',
    suspicious: true,
    fullAccess: false,
  },
];

const INITIAL_RULES: SecurityRule[] = [
  {
    id: 'r1',
    name: 'Brute Force Protection',
    description: 'Block IP after 5 failed login attempts',
    enabled: true,
    severity: 'high',
    category: 'Authentication',
    lastTriggered: '2026-01-15 13:25:00',
    triggerCount: 3,
    fullAccess: true,
  },
  {
    id: 'r2',
    name: 'Geographic Anomaly Detection',
    description: 'Flag logins from unusual locations',
    enabled: true,
    severity: 'medium',
    category: 'Access Control',
    lastTriggered: '2026-01-15 12:10:00',
    triggerCount: 1,
    fullAccess: true,
  },
  {
    id: 'r3',
    name: 'SQL Injection Scanner',
    description: 'Detect and block SQL injection attempts',
    enabled: true,
    severity: 'critical',
    category: 'Attack Prevention',
    lastTriggered: '2026-01-15 10:30:00',
    triggerCount: 0,
    fullAccess: true,
  },
  {
    id: 'r4',
    name: 'DDoS Protection',
    description: 'Rate limiting and traffic analysis',
    enabled: true,
    severity: 'critical',
    category: 'Network Security',
    lastTriggered: 'Never',
    triggerCount: 0,
    fullAccess: true,
  },
  {
    id: 'r5',
    name: 'Two-Factor Authentication',
    description: 'Require 2FA for all admin accounts',
    enabled: true,
    severity: 'high',
    category: 'Authentication',
    lastTriggered: '2026-01-15 13:20:00',
    triggerCount: 234,
    fullAccess: true,
  },
];

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [rules, setRules] = useState<SecurityRule[]>(INITIAL_RULES);
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'sessions' | 'rules' | 'analytics'>('overview');

  const stats = useMemo(() => {
    const criticalEvents = events.filter((e) => e.severity === 'critical').length;
    const unresolvedEvents = events.filter((e) => !e.resolved).length;
    const activeSessions = sessions.filter((s) => s.status === 'active').length;
    const suspiciousSessions = sessions.filter((s) => s.suspicious).length;
    const enabledRules = rules.filter((r) => r.enabled).length;
    const totalBlocks = rules.reduce((sum, r) => sum + r.triggerCount, 0);
    return { criticalEvents, unresolvedEvents, activeSessions, suspiciousSessions, enabledRules, totalBlocks };
  }, [events, sessions, rules]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => (severityFilter === 'all' ? true : e.severity === severityFilter))
      .filter((e) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.ipAddress.includes(q) ||
          e.user.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, query, severityFilter]);

  const toggleFullAccess = (id: string, type: 'event' | 'session' | 'rule') => {
    if (type === 'event') {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, fullAccess: !e.fullAccess } : e)));
    } else if (type === 'session') {
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, fullAccess: !s.fullAccess } : s)));
    } else {
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, fullAccess: !r.fullAccess } : r)));
    }
  };

  const resolveEvent = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, resolved: true } : e)));
  };

  const terminateSession = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'terminated' as SessionStatus } : s)));
    alert('Session terminated successfully!');
  };

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const exportSecurityLog = () => {
    const header = ['id', 'type', 'severity', 'title', 'description', 'ipAddress', 'location', 'timestamp', 'user', 'device', 'resolved'];
    const rows = events.map((e) => [e.id, e.type, e.severity, e.title, e.description, e.ipAddress, e.location, e.timestamp, e.user, e.device, e.resolved]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security_audit_log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: ThreatLevel) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-blue-400';
      case 'none':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: ThreatLevel) => {
    switch (severity) {
      case 'critical':
        return <ShieldOff className="w-5 h-5 text-red-400" />;
      case 'high':
        return <ShieldAlert className="w-5 h-5 text-orange-400" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'low':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'none':
        return <ShieldCheck className="w-5 h-5 text-green-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            Security & Audit Center
          </h1>
          <p className="text-gray-400">Enterprise-grade security monitoring & threat intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportSecurityLog}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Log
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Run Security Scan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between mb-3">
            <ShieldOff className="w-8 h-8 text-red-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.criticalEvents}</div>
              <div className="text-sm text-gray-400">Critical Threats</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.unresolvedEvents}</div>
              <div className="text-sm text-gray-400">Unresolved Events</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.activeSessions}</div>
              <div className="text-sm text-gray-400">Active Sessions</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalBlocks}</div>
              <div className="text-sm text-gray-400">Threats Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'events', label: 'Security Events', icon: AlertTriangle },
          { id: 'sessions', label: 'Active Sessions', icon: Activity },
          { id: 'rules', label: 'Security Rules', icon: Settings },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'events' | 'sessions' | 'rules' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' : 'text-gray-400 hover:text-white'
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
          {/* Security Score */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              Security Score
            </h2>
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  98.5
                </div>
                <div className="text-center text-sm text-gray-400 mt-2">Out of 100</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Authentication', score: 100, color: 'green' },
                { label: 'Network Security', score: 98, color: 'green' },
                { label: 'Data Protection', score: 99, color: 'green' },
                { label: 'Access Control', score: 97, color: 'blue' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">{item.label}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">{item.score}</div>
                    <CheckCircle className={`w-5 h-5 text-${item.color}-400`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Recent Security Events
            </h2>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    event.severity === 'critical'
                      ? 'bg-red-500/10 border-red-500/30'
                      : event.severity === 'high'
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : event.severity === 'medium'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(event.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{event.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              event.severity === 'critical'
                                ? 'bg-red-500/20 text-red-300'
                                : event.severity === 'high'
                                ? 'bg-orange-500/20 text-orange-300'
                                : event.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {event.severity.toUpperCase()}
                          </span>
                          {event.resolved && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-300">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300 mb-2">{event.description}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.ipAddress} - {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!event.resolved && (
                      <button
                        onClick={() => resolveEvent(event.id)}
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

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Active Security Rules
              </h3>
              <div className="space-y-3">
                {rules.slice(0, 5).map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white mb-1">{rule.name}</div>
                      <div className="text-xs text-gray-400">{rule.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-400' : 'bg-gray-600'}`}
                      ></span>
                      <span className="text-sm text-gray-300">{rule.enabled ? 'Active' : 'Disabled'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-purple-400" />
                Authentication Methods
              </h3>
              <div className="space-y-3">
                {[
                  { method: 'Two-Factor Authentication (2FA)', enabled: true, users: 234 },
                  { method: 'Biometric Authentication', enabled: true, users: 156 },
                  { method: 'Hardware Security Keys', enabled: true, users: 89 },
                  { method: 'Single Sign-On (SSO)', enabled: true, users: 312 },
                  { method: 'Email Verification', enabled: true, users: 456 },
                ].map((item) => (
                  <div key={item.method} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{item.method}</div>
                      <div className="text-xs text-gray-400">{item.users} users enrolled</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search events"
                  placeholder="Search security events..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">IP / Location</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-t border-gray-700 hover:bg-gray-900">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{event.title}</div>
                          <div className="text-xs text-gray-400">{event.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(event.severity)}
                          <span className={`text-sm font-semibold ${getSeverityColor(event.severity)} capitalize`}>
                            {event.severity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-mono">{event.ipAddress}</div>
                        <div className="text-xs text-gray-400">{event.location}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{event.user}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{event.timestamp}</td>
                      <td className="px-4 py-3">
                        {event.resolved ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                            Resolved
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFullAccess(event.id, 'event')}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            event.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {event.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {!event.resolved && (
                          <button
                            onClick={() => resolveEvent(event.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">IP / Location</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Browser</th>
                  <th className="px-4 py-3">Login Time</th>
                  <th className="px-4 py-3">Last Activity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Access</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-t border-gray-700 hover:bg-gray-900">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white">{session.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white font-mono">{session.ipAddress}</div>
                      <div className="text-xs text-gray-400">{session.location}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{session.device}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{session.browser}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{session.loginTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{session.lastActivity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {session.status === 'active' && <Activity className="w-4 h-4 text-green-400" />}
                        {session.suspicious && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                        <span
                          className={`text-sm font-semibold ${
                            session.status === 'active' ? 'text-green-400' : 'text-red-400'
                          } capitalize`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFullAccess(session.id, 'session')}
                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                          session.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {session.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {session.status === 'active' && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold"
                        >
                          Terminate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{rule.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        rule.severity === 'critical'
                          ? 'bg-red-500/20 text-red-300'
                          : rule.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {rule.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300">
                      {rule.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{rule.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div>Last Triggered: {rule.lastTriggered}</div>
                    <div>Trigger Count: {rule.triggerCount}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFullAccess(rule.id, 'rule')}
                    className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                      rule.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {rule.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {rule.fullAccess ? '100% Access' : 'Limited'}
                  </button>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      rule.enabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Security Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">2FA</th>
                  <th className="pb-2">Encryption</th>
                  <th className="pb-2">DDoS</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Platform', tfa: 'Yes', encryption: 'AES-256', ddos: 'Advanced', rating: 100 },
                  { name: 'AWS', tfa: 'Yes', encryption: 'AES-256', ddos: 'Standard', rating: 92 },
                  { name: 'Azure', tfa: 'Yes', encryption: 'AES-256', ddos: 'Standard', rating: 90 },
                  { name: 'Google Cloud', tfa: 'Yes', encryption: 'AES-128', ddos: 'Basic', rating: 88 },
                  { name: 'Heroku', tfa: 'Limited', encryption: 'SSL', ddos: 'Basic', rating: 75 },
                ].map((platform) => (
                  <tr key={platform.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{platform.name}</td>
                    <td className="py-2 text-green-400">{platform.tfa}</td>
                    <td className="py-2 text-blue-400">{platform.encryption}</td>
                    <td className="py-2 text-purple-400">{platform.ddos}</td>
                    <td className="py-2 text-yellow-400 font-bold">{platform.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Security Metrics (24h)</h3>
            <div className="space-y-3">
              {[
                { label: 'Threats Blocked', value: 237, change: '+12%', trend: 'down' },
                { label: 'Security Scans', value: 48, change: '+5%', trend: 'up' },
                { label: 'Failed Logins', value: 3, change: '-67%', trend: 'down' },
                { label: 'Suspicious Activities', value: 1, change: '-80%', trend: 'down' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">{item.label}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        item.trend === 'down' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Threat Intelligence</h3>
            <div className="space-y-3">
              {[
                { type: 'SQL Injection', blocked: 125, severity: 'critical' },
                { type: 'XSS Attacks', blocked: 87, severity: 'high' },
                { type: 'Brute Force', blocked: 15, severity: 'medium' },
                { type: 'DDoS Attempts', blocked: 10, severity: 'high' },
              ].map((threat) => (
                <div key={threat.type} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(threat.severity as ThreatLevel)}
                    <span className="text-sm text-white">{threat.type}</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{threat.blocked} blocked</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Compliance & Certifications</h3>
            <div className="space-y-3">
              {[
                { name: 'ISO 27001', status: 'Certified', color: 'green' },
                { name: 'SOC 2 Type II', status: 'Certified', color: 'green' },
                { name: 'GDPR Compliant', status: 'Certified', color: 'green' },
                { name: 'PCI DSS', status: 'Certified', color: 'green' },
                { name: 'HIPAA', status: 'Certified', color: 'green' },
              ].map((cert) => (
                <div key={cert.name} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <span className="text-sm text-white">{cert.name}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 text-${cert.color}-400`} />
                    <span className={`text-sm font-semibold text-${cert.color}-400`}>{cert.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

