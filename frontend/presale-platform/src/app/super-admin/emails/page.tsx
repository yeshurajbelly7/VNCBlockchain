'use client';

import React, { useMemo, useState } from 'react';
import {
  Mail,
  Send,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  Copy,
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
  Zap,
  Lock,
  Unlock,
  Globe,
  Server,
  Shield,
  Target,
  Calendar,
  Plus,
  Save,
} from 'lucide-react';

type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'failed';
type EmailType = 'transactional' | 'marketing' | 'newsletter' | 'notification' | 'announcement';
type EmailPriority = 'low' | 'normal' | 'high' | 'urgent';

interface Email {
  id: string;
  subject: string;
  preview: string;
  type: EmailType;
  status: EmailStatus;
  recipients: number;
  opened: number;
  clicked: number;
  bounced: number;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  priority: EmailPriority;
  fromName: string;
  fromEmail: string;
  fullAccess: boolean;
}

interface EmailStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

const INITIAL_EMAILS: Email[] = [
  {
    id: 'e1',
    subject: 'Welcome to VNC Blockchain Platform',
    preview: 'Get started with your account and explore our features...',
    type: 'transactional',
    status: 'sent',
    recipients: 5420,
    opened: 4836,
    clicked: 3254,
    bounced: 12,
    sentAt: '2026-01-14',
    createdAt: '2026-01-14',
    createdBy: 'Admin',
    tags: ['onboarding', 'welcome'],
    priority: 'high',
    fromName: 'VNC Team',
    fromEmail: 'noreply@vncblockchain.com',
    fullAccess: true,
  },
  {
    id: 'e2',
    subject: 'January Newsletter - Blockchain Updates',
    preview: 'Discover the latest updates, features, and news...',
    type: 'newsletter',
    status: 'sent',
    recipients: 12500,
    opened: 8750,
    clicked: 4250,
    bounced: 35,
    sentAt: '2026-01-10',
    createdAt: '2026-01-08',
    createdBy: 'Admin',
    tags: ['newsletter', 'monthly'],
    priority: 'normal',
    fromName: 'VNC Newsletter',
    fromEmail: 'newsletter@vncblockchain.com',
    fullAccess: true,
  },
  {
    id: 'e3',
    subject: 'Exclusive: 50% Off Premium Plans',
    preview: 'Limited time offer for our valued customers...',
    type: 'marketing',
    status: 'scheduled',
    recipients: 8900,
    opened: 0,
    clicked: 0,
    bounced: 0,
    scheduledFor: '2026-01-20',
    createdAt: '2026-01-12',
    createdBy: 'Admin',
    tags: ['promotion', 'sale'],
    priority: 'urgent',
    fromName: 'VNC Marketing',
    fromEmail: 'marketing@vncblockchain.com',
    fullAccess: false,
  },
  {
    id: 'e4',
    subject: 'Security Alert: New Login Detected',
    preview: 'We detected a new login to your account from...',
    type: 'notification',
    status: 'draft',
    recipients: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    createdAt: '2026-01-15',
    createdBy: 'Admin',
    tags: ['security', 'alert'],
    priority: 'urgent',
    fromName: 'VNC Security',
    fromEmail: 'security@vncblockchain.com',
    fullAccess: true,
  },
];

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'emails' | 'analytics' | 'templates' | 'settings'>('emails');

  const stats = useMemo<EmailStats>(() => {
    const sent = emails.filter((e) => e.status === 'sent');
    const totalSent = sent.length;
    const totalRecipients = sent.reduce((s, e) => s + e.recipients, 0);
    const delivered = totalRecipients - sent.reduce((s, e) => s + e.bounced, 0);
    const opened = sent.reduce((s, e) => s + e.opened, 0);
    const clicked = sent.reduce((s, e) => s + e.clicked, 0);
    const bounced = sent.reduce((s, e) => s + e.bounced, 0);

    return {
      totalSent,
      delivered,
      opened,
      clicked,
      bounced,
      deliveryRate: totalRecipients > 0 ? (delivered / totalRecipients) * 100 : 0,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
    };
  }, [emails]);

  const filtered = useMemo(() => {
    return emails
      .filter((e) => (statusFilter === 'all' ? true : e.status === statusFilter))
      .filter((e) => (typeFilter === 'all' ? true : e.type === typeFilter))
      .filter((e) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          e.subject.toLowerCase().includes(q) ||
          e.preview.toLowerCase().includes(q) ||
          e.fromEmail.toLowerCase().includes(q) ||
          e.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [emails, query, statusFilter, typeFilter]);

  const handleView = (email: Email) => {
    setSelectedEmail(email);
    setShowViewModal(true);
  };

  const handleEdit = (email: Email) => {
    setSelectedEmail(email);
    setShowEditModal(true);
  };

  const saveEmail = (updated: Email) => {
    if (updated.id.startsWith('e')) {
      setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      setEmails((prev) => [...prev, updated]);
    }
    setShowEditModal(false);
    setShowViewModal(false);
    alert('Email saved successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, fullAccess: !e.fullAccess } : e)));
  };

  const duplicateEmail = (id: string) => {
    const email = emails.find((e) => e.id === id);
    if (email) {
      const duplicate: Email = {
        ...email,
        id: `e${Date.now()}`,
        subject: `${email.subject} (Copy)`,
        status: 'draft',
        recipients: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        sentAt: undefined,
        scheduledFor: undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEmails((prev) => [...prev, duplicate]);
      alert('Email duplicated!');
    }
  };

  const deleteEmail = (id: string) => {
    if (confirm('Are you sure you want to delete this email?')) {
      setEmails((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const sendEmail = (email: Email) => {
    if (confirm(`Send "${email.subject}" to ${email.recipients} recipients?`)) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === email.id
            ? { ...e, status: 'sent' as EmailStatus, sentAt: new Date().toISOString().split('T')[0] }
            : e
        )
      );
      alert('Email sent successfully!');
    }
  };

  const exportEmails = () => {
    const header = ['id', 'subject', 'type', 'status', 'recipients', 'opened', 'clicked', 'bounced', 'sentAt'];
    const rows = emails.map((e) => [
      e.id,
      e.subject,
      e.type,
      e.status,
      e.recipients,
      e.opened,
      e.clicked,
      e.bounced,
      e.sentAt || '',
    ]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-400" />
            Email Marketing Hub
          </h1>
          <p className="text-gray-400">Enterprise email management, bulk sending & marketing automation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Configure
          </button>
          <button
            onClick={() => {
              setSelectedEmail(null);
              setShowEditModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Email
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <Send className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalSent}</div>
              <div className="text-sm text-gray-400">Total Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.deliveryRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Delivery Rate</div>
            </div>
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
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-pink-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.clickRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Click Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'emails', label: 'Emails', icon: Mail },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'emails' | 'analytics' | 'templates' | 'settings')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Emails Tab */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-2/3">
              <div className="relative flex-1">
                <input
                  aria-label="Search emails"
                  placeholder="Search emails, subject, tags..."
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
                <option value="transactional">Transactional</option>
                <option value="marketing">Marketing</option>
                <option value="newsletter">Newsletter</option>
                <option value="notification">Notification</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportEmails}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((email) => (
              <div
                key={email.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{email.subject}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          email.status === 'sent'
                            ? 'bg-green-500/20 text-green-300'
                            : email.status === 'scheduled'
                            ? 'bg-blue-500/20 text-blue-300'
                            : email.status === 'draft'
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {email.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                        {email.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{email.preview}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{email.recipients.toLocaleString()} recipients</span>
                      </div>
                      {email.status === 'sent' && (
                        <>
                          <div className="flex items-center gap-1 text-purple-400">
                            <Eye className="w-4 h-4" />
                            <span>{email.opened.toLocaleString()} opens</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-400">
                            <Target className="w-4 h-4" />
                            <span>{email.clicked.toLocaleString()} clicks</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-1 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{email.fromEmail}</span>
                      </div>
                      {email.scheduledFor && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Calendar className="w-4 h-4" />
                          <span>Scheduled: {email.scheduledFor}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {email.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleFullAccess(email.id)}
                      className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                        email.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                      title="1000% Access"
                    >
                      {email.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => handleView(email)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(email)}
                      className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {email.status === 'draft' && (
                      <button
                        onClick={() => sendEmail(email)}
                        className="p-2 bg-green-800/20 border border-green-700 rounded hover:bg-green-800/30 text-green-400"
                        title="Send Now"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => duplicateEmail(email.id)}
                      className="p-2 bg-blue-800/20 border border-blue-700 rounded hover:bg-blue-800/30 text-blue-400"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEmail(email.id)}
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
            <h3 className="text-lg font-bold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Total Recipients</span>
                </div>
                <span className="text-white font-bold">
                  {emails.reduce((s, e) => s + e.recipients, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Delivered</span>
                </div>
                <span className="text-green-400 font-bold">{stats.delivered.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Opened</span>
                </div>
                <span className="text-purple-400 font-bold">{stats.opened.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-400" />
                  <span className="text-sm text-gray-300">Clicked</span>
                </div>
                <span className="text-pink-400 font-bold">{stats.clicked.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">Bounced</span>
                </div>
                <span className="text-red-400 font-bold">{stats.bounced.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Top Performing Emails</h3>
            <div className="space-y-3">
              {emails
                .filter((e) => e.status === 'sent')
                .sort((a, b) => b.opened - a.opened)
                .slice(0, 5)
                .map((email, i) => (
                  <div key={email.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl font-bold text-blue-400">#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white truncate">{email.subject}</div>
                        <div className="text-xs text-gray-400">{email.opened} opens</div>
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
                  { name: 'VNC Email Hub', delivery: '99.8%', rating: 100 },
                  { name: 'SendGrid', delivery: '97.5%', rating: 92 },
                  { name: 'Mailchimp', delivery: '96.8%', rating: 88 },
                  { name: 'Amazon SES', delivery: '98.2%', rating: 90 },
                  { name: 'Sendinblue', delivery: '95.5%', rating: 85 },
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

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Email Type Distribution</h3>
            <div className="space-y-3">
              {[
                { type: 'Transactional', count: 5420, color: 'blue' },
                { type: 'Marketing', count: 8900, color: 'purple' },
                { type: 'Newsletter', count: 12500, color: 'green' },
                { type: 'Notification', count: 3200, color: 'yellow' },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{item.type}</span>
                    <span className="text-sm text-white font-semibold">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full`}
                      style={{ width: `${(item.count / 30020) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 't1',
              name: 'Welcome Email',
              description: 'Greet new users with a professional welcome',
              icon: '??',
              type: 'transactional',
            },
            {
              id: 't2',
              name: 'Password Reset',
              description: 'Secure password reset instructions',
              icon: '??',
              type: 'transactional',
            },
            {
              id: 't3',
              name: 'Promotional Campaign',
              description: 'Drive sales with special offers',
              icon: '??',
              type: 'marketing',
            },
            {
              id: 't4',
              name: 'Newsletter Template',
              description: 'Engage subscribers with monthly updates',
              icon: '??',
              type: 'newsletter',
            },
            {
              id: 't5',
              name: 'Product Launch',
              description: 'Announce new products to your audience',
              icon: '??',
              type: 'announcement',
            },
            {
              id: 't6',
              name: 'Transaction Receipt',
              description: 'Professional payment confirmation',
              icon: '??',
              type: 'transactional',
            },
          ].map((template) => (
            <div
              key={template.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded capitalize">
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              SMTP Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">SMTP Server</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="smtp.vncblockchain.com"
                  defaultValue="smtp.vncblockchain.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Port</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                    placeholder="587"
                    defaultValue="587"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Encryption</label>
                  <select className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white">
                    <option>TLS</option>
                    <option>SSL</option>
                    <option>None</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Username</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="noreply@vncblockchain.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>
              <button className="px-4 py-2 bg-green-600 rounded text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Test Connection
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Domain Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Primary Domain</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="vncblockchain.com"
                  defaultValue="vncblockchain.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">DKIM Selector</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono text-sm"
                  placeholder="vnc"
                  defaultValue="vnc"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">SPF Record</label>
                <input
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono text-sm"
                  placeholder="v=spf1 include:_spf.vncblockchain.com ~all"
                  defaultValue="v=spf1 include:_spf.vncblockchain.com ~all"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">DMARC Policy</label>
                <select className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white">
                  <option>None</option>
                  <option>Quarantine</option>
                  <option>Reject</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 rounded text-white flex items-center gap-2">
                <Shield className="w-4 h-4" /> Verify Domain
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Sending Limits
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Daily Send Limit</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="100000"
                  defaultValue="100000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Hourly Rate Limit</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                  placeholder="5000"
                  defaultValue="5000"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Batch Size</label>
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
              <button className="px-4 py-2 bg-purple-600 rounded text-white">Save Settings</button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Anti-Spam Protection
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">DKIM Signing</span>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-green-600 text-white">Enabled</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">SPF Verification</span>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-green-600 text-white">Enabled</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Bounce Handling</span>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-green-600 text-white">Enabled</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Unsubscribe Link</span>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-green-600 text-white">Required</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">Spam Score Check</span>
                </div>
                <button className="px-3 py-1 rounded text-xs bg-green-600 text-white">Enabled</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEmail && (
        <ViewModal
          email={selectedEmail}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal email={selectedEmail} onCancel={() => setShowEditModal(false)} onSave={saveEmail} />
      )}

      {/* Config Modal */}
      {showConfigModal && <ConfigModal onClose={() => setShowConfigModal(false)} />}
    </div>
  );
}

function ViewModal({ email, onClose, onEdit }: { email: Email; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">{email.subject}</h3>
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
          <div className="text-sm text-gray-400 mb-2">Preview</div>
          <div className="text-base text-gray-300">{email.preview}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-gray-400">Type</div>
            <div className="text-lg text-white capitalize">{email.type}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <div className="text-lg text-white capitalize">{email.status}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">From</div>
            <div className="text-sm text-white">
              {email.fromName} &lt;{email.fromEmail}&gt;
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Priority</div>
            <div className="text-lg text-white capitalize">{email.priority}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Recipients</div>
            <div className="text-lg text-blue-400">{email.recipients.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Created By</div>
            <div className="text-lg text-white">{email.createdBy}</div>
          </div>
        </div>

        {email.status === 'sent' && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-bold text-white mb-3">Delivery Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-400">Delivered</div>
                <div className="text-xl font-bold text-green-400">
                  {(email.recipients - email.bounced).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Opened</div>
                <div className="text-xl font-bold text-purple-400">{email.opened.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Clicked</div>
                <div className="text-xl font-bold text-pink-400">{email.clicked.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Bounced</div>
                <div className="text-xl font-bold text-red-400">{email.bounced.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {email.tags && email.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {email.tags.map((tag) => (
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
  email,
  onCancel,
  onSave,
}: {
  email: Email | null;
  onCancel: () => void;
  onSave: (email: Email) => void;
}) {
  const [form, setForm] = useState<Email>(
    email || {
      id: `e${Date.now()}`,
      subject: '',
      preview: '',
      type: 'transactional',
      status: 'draft',
      recipients: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      tags: [],
      priority: 'normal',
      fromName: 'VNC Team',
      fromEmail: 'noreply@vncblockchain.com',
      fullAccess: true,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{email ? 'Edit Email' : 'Create New Email'}</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="Email subject line"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Preview Text</label>
            <textarea
              value={form.preview}
              onChange={(e) => setForm({ ...form, preview: e.target.value })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              rows={2}
              placeholder="Email preview text..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EmailType })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="transactional">Transactional</option>
                <option value="marketing">Marketing</option>
                <option value="newsletter">Newsletter</option>
                <option value="notification">Notification</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EmailStatus })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as EmailPriority })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">From Name</label>
              <input
                value={form.fromName}
                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="VNC Team"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">From Email</label>
              <input
                value={form.fromEmail}
                onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="noreply@vncblockchain.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Recipients Count</label>
            <input
              type="number"
              value={form.recipients}
              onChange={(e) => setForm({ ...form, recipients: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="0"
            />
          </div>

          {form.status === 'scheduled' && (
            <div>
              <label className="text-xs text-gray-400">Schedule For</label>
              <input
                type="date"
                value={form.scheduledFor || ''}
                onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
            </div>
          )}

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
            Save Email
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfigModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Quick Configuration</h3>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-green-300 mb-1">Domain Verified</div>
              <div className="text-xs text-gray-300">vncblockchain.com is authenticated and ready</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <span className="text-sm text-white">Daily Send Limit</span>
            <span className="text-green-400 font-bold">100,000</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <span className="text-sm text-white">Current Usage</span>
            <span className="text-blue-400 font-bold">26,820 (26.8%)</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <span className="text-sm text-white">Spam Score</span>
            <span className="text-green-400 font-bold">2.1/10 (Excellent)</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

