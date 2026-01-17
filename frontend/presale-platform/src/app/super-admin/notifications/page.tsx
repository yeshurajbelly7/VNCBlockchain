'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  BellRing,
  Send,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  User,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Smartphone,
  Lock,
  Unlock,
  Download,
  BarChart3,
  TrendingUp,
  Target,
  Settings,
  Save,
  Copy,
  FileText,
} from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement';
type NotificationStatus = 'draft' | 'scheduled' | 'sent' | 'failed';
type NotificationChannel = 'push' | 'email' | 'sms' | 'in-app' | 'all';
type TargetAudience = 'all' | 'active' | 'inactive' | 'vip' | 'new' | 'custom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  channel: NotificationChannel;
  audience: TargetAudience;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  link?: string;
  imageUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  fullAccess: boolean;
}

interface NotificationStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Feature: Advanced Trading Dashboard',
    message: 'Check out our new trading dashboard with real-time analytics and advanced charting tools!',
    type: 'announcement',
    status: 'sent',
    channel: 'all',
    audience: 'all',
    recipients: 15420,
    delivered: 15318,
    opened: 8945,
    clicked: 3421,
    sentAt: '2026-01-15',
    createdAt: '2026-01-15',
    createdBy: 'Admin',
    tags: ['feature', 'trading', 'dashboard'],
    link: '/trading',
    priority: 'high',
    fullAccess: true,
  },
  {
    id: 'n2',
    title: 'Presale Phase 2 Now Live!',
    message: 'Join Phase 2 of VNC token presale with exclusive bonuses. Limited time offer!',
    type: 'success',
    status: 'sent',
    channel: 'all',
    audience: 'active',
    recipients: 8920,
    delivered: 8850,
    opened: 6234,
    clicked: 4123,
    sentAt: '2026-01-14',
    createdAt: '2026-01-14',
    createdBy: 'Marketing',
    tags: ['presale', 'token', 'urgent'],
    link: '/presale',
    imageUrl: '/notifications/presale-banner.jpg',
    priority: 'urgent',
    fullAccess: true,
  },
  {
    id: 'n3',
    title: 'System Maintenance Scheduled',
    message: 'Our platform will undergo maintenance on Jan 20, 2026 from 2-4 AM UTC. Please plan accordingly.',
    type: 'warning',
    status: 'scheduled',
    channel: 'email',
    audience: 'all',
    recipients: 15420,
    delivered: 0,
    opened: 0,
    clicked: 0,
    scheduledFor: '2026-01-18',
    createdAt: '2026-01-15',
    createdBy: 'Tech Team',
    tags: ['maintenance', 'system', 'scheduled'],
    priority: 'medium',
    fullAccess: true,
  },
  {
    id: 'n4',
    title: 'Security Update: Enable 2FA',
    message: 'Protect your account by enabling two-factor authentication. Enhanced security measures now available.',
    type: 'info',
    status: 'draft',
    channel: 'in-app',
    audience: 'inactive',
    recipients: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    createdAt: '2026-01-15',
    createdBy: 'Security',
    tags: ['security', '2fa', 'account'],
    link: '/settings/security',
    priority: 'high',
    fullAccess: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'analytics' | 'templates' | 'settings'>('notifications');

  const stats: NotificationStats = useMemo(() => {
    const sent = notifications.filter((n) => n.status === 'sent');
    const totalSent = sent.length;
    const delivered = sent.reduce((s, n) => s + n.delivered, 0);
    const opened = sent.reduce((s, n) => s + n.opened, 0);
    const clicked = sent.reduce((s, n) => s + n.clicked, 0);
    const totalRecipients = sent.reduce((s, n) => s + n.recipients, 0);
    const failed = sent.reduce((s, n) => s + (n.recipients - n.delivered), 0);
    
    return {
      totalSent,
      delivered,
      opened,
      clicked,
      failed,
      deliveryRate: totalRecipients > 0 ? (delivered / totalRecipients) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
    };
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications
      .filter((n) => (statusFilter === 'all' ? true : n.status === statusFilter))
      .filter((n) => (typeFilter === 'all' ? true : n.type === typeFilter))
      .filter((n) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.createdBy.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, query, statusFilter, typeFilter]);

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const saveNotification = (updated: Notification) => {
    if (updated.id.startsWith('n')) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
      );
    } else {
      setNotifications((prev) => [updated, ...prev]);
    }
    setShowEditModal(false);
    alert('Notification saved successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, fullAccess: !n.fullAccess } : n)));
  };

  const duplicateNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      const newNotification: Notification = {
        ...notification,
        id: `n${Date.now()}`,
        title: `${notification.title} (Copy)`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        recipients: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      alert('Notification duplicated successfully!');
    }
  };

  const deleteNotification = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const sendNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowSendModal(true);
  };

  const exportNotifications = () => {
    const header = ['id', 'title', 'type', 'status', 'channel', 'audience', 'recipients', 'delivered', 'opened', 'clicked', 'sentAt'];
    const rows = notifications.map((n) => [
      n.id,
      n.title,
      n.type,
      n.status,
      n.channel,
      n.audience,
      n.recipients,
      n.delivered,
      n.opened,
      n.clicked,
      n.sentAt || '',
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `\"${String(cell).replace(/\"/g, '\"\"')}\"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notifications_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <BellRing className="w-8 h-8 text-blue-400" />
            Notification Center
          </h1>
          <p className="text-gray-400">Enterprise-grade notification management and delivery system</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedNotification(null);
              setShowEditModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Notification
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Send className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalSent}</div>
              <div className="text-sm text-gray-400">Total Sent</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{stats.delivered.toLocaleString()} delivered</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.deliveryRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Delivery Rate</div>
            </div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% this week
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Eye className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.openRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Open Rate</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{stats.opened.toLocaleString()} opened</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-pink-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.clickRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Click Rate</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">{stats.clicked.toLocaleString()} clicked</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'notifications' | 'analytics' | 'templates' | 'settings')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
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

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search notifications"
                  placeholder="Search by title, message, tags..."
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
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <button
              onClick={exportNotifications}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notification.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                      {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                      {notification.type === 'error' && <span className="w-5 h-5 flex items-center justify-center"><XCircle className="w-5 h-5 text-red-400" /></span>}
                      {notification.type === 'announcement' && <BellRing className="w-5 h-5 text-purple-400" />}
                      <h3 className="text-xl font-bold text-white">{notification.title}</h3>
                      {notification.priority === 'urgent' && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{notification.message}</p>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          notification.status === 'sent'
                            ? 'bg-green-500/20 text-green-300'
                            : notification.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-300'
                            : notification.status === 'draft'
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {notification.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                        {notification.channel.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        {notification.audience}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" />
                        {notification.createdBy}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {notification.sentAt || notification.scheduledFor || notification.createdAt}
                      </div>
                    </div>

                    {notification.status === 'sent' && (
                      <div className="flex items-center gap-6 mb-3">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Send className="w-4 h-4 text-blue-400" />
                          {notification.recipients.toLocaleString()} sent
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {notification.delivered.toLocaleString()} delivered
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Eye className="w-4 h-4 text-purple-400" />
                          {notification.opened.toLocaleString()} opened
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Target className="w-4 h-4 text-pink-400" />
                          {notification.clicked.toLocaleString()} clicked
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {notification.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleFullAccess(notification.id)}
                      className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                        notification.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                      title="1000% Access"
                    >
                      {notification.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleView(notification)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {notification.status === 'draft' && (
                      <button
                        onClick={() => sendNotification(notification)}
                        className="p-2 bg-green-800/20 border border-green-700 rounded hover:bg-green-800/30 text-green-400"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => duplicateNotification(notification.id)}
                      className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Performance Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Total Recipients</span>
                </div>
                <span className="text-white font-bold">
                  {notifications.reduce((s, n) => s + n.recipients, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Delivery Success</span>
                </div>
                <span className="text-green-400 font-bold">{stats.deliveryRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Engagement Rate</span>
                </div>
                <span className="text-purple-400 font-bold">{stats.openRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-gray-300">Conversion Rate</span>
                </div>
                <span className="text-pink-400 font-bold">{stats.clickRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Channel Performance</h3>
            <div className="space-y-3">
              {[
                { channel: 'Push', rate: 92, icon: Smartphone },
                { channel: 'Email', rate: 88, icon: Mail },
                { channel: 'In-App', rate: 95, icon: Bell },
                { channel: 'SMS', rate: 85, icon: MessageSquare },
              ].map((item) => (
                <div key={item.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{item.channel}</span>
                    </div>
                    <span className="text-sm text-white font-semibold">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Notifications</h3>
            <div className="space-y-3">
              {notifications
                .filter((n) => n.status === 'sent')
                .sort((a, b) => b.clicked - a.clicked)
                .slice(0, 5)
                .map((notification, i) => (
                  <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl font-bold text-blue-400">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white truncate">{notification.title}</div>
                        <div className="text-xs text-gray-400">{notification.clicked} clicks</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Delivery</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Notifications', delivery: '99.2%', rating: 100 },
                  { name: 'OneSignal', delivery: '96.5%', rating: 92 },
                  { name: 'Firebase', delivery: '95.8%', rating: 90 },
                  { name: 'Pusher', delivery: '94.2%', rating: 88 },
                ].map((platform) => (
                  <tr key={platform.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{platform.name}</td>
                    <td className="py-2 text-green-400">{platform.delivery}</td>
                    <td className="py-2 text-yellow-400">{platform.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 't1',
              name: 'Welcome Message',
              description: 'Greet new users with a warm welcome',
              icon: '??',
              type: 'success',
            },
            {
              id: 't2',
              name: 'Security Alert',
              description: 'Notify users of security-related events',
              icon: '??',
              type: 'warning',
            },
            {
              id: 't3',
              name: 'Promotion Alert',
              description: 'Announce special offers and promotions',
              icon: '??',
              type: 'announcement',
            },
            {
              id: 't4',
              name: 'System Update',
              description: 'Inform about platform updates',
              icon: '??',
              type: 'info',
            },
            {
              id: 't5',
              name: 'Transaction Confirmation',
              description: 'Confirm successful transactions',
              icon: '?',
              type: 'success',
            },
            {
              id: 't6',
              name: 'Account Verification',
              description: 'Verify user account details',
              icon: '??',
              type: 'info',
            },
          ].map((template) => (
            <div
              key={template.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize">
                  {template.type}
                </span>
                <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded text-sm">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Notification Channels</h3>
            <div className="space-y-3">
              {[
                { name: 'Push Notifications', icon: Smartphone, enabled: true },
                { name: 'Email Notifications', icon: Mail, enabled: true },
                { name: 'SMS Notifications', icon: MessageSquare, enabled: true },
                { name: 'In-App Notifications', icon: Bell, enabled: true },
              ].map((channel) => (
                <div key={channel.name} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <div className="flex items-center gap-2">
                    <channel.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">{channel.name}</span>
                  </div>
                  <button
                    className={`px-3 py-1 rounded text-xs ${
                      channel.enabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {channel.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Delivery Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Rate Limit (per minute)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="1000"
                  defaultValue="1000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Retry Attempts</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="3"
                  defaultValue="3"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Retry Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="60"
                  defaultValue="60"
                />
              </div>
              <button className="px-4 py-2 bg-green-600 rounded text-white">Save Settings</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Audience Segments</h3>
            <div className="space-y-2">
              {['All Users', 'Active Users', 'Inactive Users', 'VIP Users', 'New Users'].map((segment) => (
                <div key={segment} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                  <span className="text-sm text-white">{segment}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1 bg-gray-800 rounded text-gray-300 hover:text-white">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full px-3 py-2 bg-purple-600 rounded text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Segment
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">API Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    className="flex-1 px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono"
                    value="vnc_notif_************"
                    readOnly
                  />
                  <button className="px-3 py-2 bg-gray-700 rounded text-white">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Webhook URL</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono text-sm"
                  placeholder="https://api.vnc.com/webhooks/notifications"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 rounded text-white">Test Connection</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNotification && (
        <ViewModal
          notification={selectedNotification}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          notification={selectedNotification}
          onCancel={() => setShowEditModal(false)}
          onSave={saveNotification}
        />
      )}

      {/* Send Modal */}
      {showSendModal && selectedNotification && (
        <SendModal
          notification={selectedNotification}
          onClose={() => setShowSendModal(false)}
          onConfirm={() => {
            setShowSendModal(false);
            alert('Notification sent successfully!');
          }}
        />
      )}
    </div>
  );
}

function ViewModal({
  notification,
  onClose,
  onEdit,
}: {
  notification: Notification;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">{notification.title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="px-3 py-2 bg-blue-600 rounded text-white">
              Edit
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">
              Close
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Message</div>
          <div className="text-base text-gray-300">{notification.message}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-400">Type</div>
            <div className="text-lg text-white capitalize">{notification.type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-lg text-white capitalize">{notification.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Channel</div>
            <div className="text-lg text-white uppercase">{notification.channel}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Audience</div>
            <div className="text-lg text-white capitalize">{notification.audience}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Priority</div>
            <div className="text-lg text-white capitalize">{notification.priority}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Created By</div>
            <div className="text-lg text-white">{notification.createdBy}</div>
          </div>
        </div>

        {notification.status === 'sent' && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-bold text-white mb-3">Delivery Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-400">Recipients</div>
                <div className="text-xl font-bold text-blue-400">{notification.recipients.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Delivered</div>
                <div className="text-xl font-bold text-green-400">{notification.delivered.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Opened</div>
                <div className="text-xl font-bold text-purple-400">{notification.opened.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Clicked</div>
                <div className="text-xl font-bold text-pink-400">{notification.clicked.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {notification.tags && notification.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {notification.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                  #{tag}
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
  notification,
  onCancel,
  onSave,
}: {
  notification: Notification | null;
  onCancel: () => void;
  onSave: (notification: Notification) => void;
}) {
  const [form, setForm] = useState<Notification>(
    notification || {
      id: `n${Date.now()}`,
      title: '',
      message: '',
      type: 'info',
      status: 'draft',
      channel: 'all',
      audience: 'all',
      recipients: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      tags: [],
      priority: 'medium',
      fullAccess: true,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            {notification ? 'Edit Notification' : 'Create Notification'}
          </h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              rows={4}
              placeholder="Notification message..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as NotificationType })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Channel</label>
              <select
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value as NotificationChannel })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="all">All Channels</option>
                <option value="push">Push</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="in-app">In-App</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Audience</label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value as TargetAudience })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
                <option value="vip">VIP Users</option>
                <option value="new">New Users</option>
                <option value="custom">Custom Segment</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Link (Optional)</label>
              <input
                value={form.link || ''}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="/page-url"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Schedule For (Optional)</label>
            <input
              type="date"
              value={form.scheduledFor || ''}
              onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Full Access (1000%)</label>
            <button
              onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })}
              className={`px-3 py-2 rounded ${
                form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              {form.fullAccess ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Notification
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SendModal({
  notification,
  onClose,
  onConfirm,
}: {
  notification: Notification;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Send Notification</h3>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-lg font-bold text-white mb-2">{notification.title}</div>
          <div className="text-sm text-gray-300 mb-4">{notification.message}</div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Channel:</span>
              <span className="text-white ml-2 uppercase">{notification.channel}</span>
            </div>
            <div>
              <span className="text-gray-400">Audience:</span>
              <span className="text-white ml-2 capitalize">{notification.audience}</span>
            </div>
            <div>
              <span className="text-gray-400">Priority:</span>
              <span className="text-white ml-2 capitalize">{notification.priority}</span>
            </div>
            <div>
              <span className="text-gray-400">Estimated Recipients:</span>
              <span className="text-white ml-2">~15,000 users</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-yellow-300 mb-1">Important</div>
              <div className="text-xs text-yellow-200">
                This notification will be sent to all selected users immediately. This action cannot be undone.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Now
          </button>
        </div>
      </div>
    </div>
  );
}

