'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Database, Users, Settings, Zap, Activity, 
  TrendingUp, DollarSign, CreditCard, UserCog,
  Bell, FileText,
  ArrowUpRight, ArrowDownRight, Wallet, Eye
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string | number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface SystemStatusCardProps {
  title: string;
  status: string;
  icon: React.ReactNode;
  onToggle: () => void;
}

interface ControlPanelStat {
  label: string;
  value: string | number;
  alert?: boolean;
}

interface ControlPanelAction {
  label: string;
  href: string;
}

interface ControlPanelProps {
  title: string;
  icon: React.ReactNode;
  stats: ControlPanelStat[];
  actions: ControlPanelAction[];
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [systemStatus, setSystemStatus] = useState({
    blockchain: 'running',
    presale: 'active',
    validators: 'active',
    api: 'running',
    payments: 'active',
    database: 'running',
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingKYC: 0,
    activeValidators: 0,
    blockHeight: 0,
    networkTPS: 0,
  });

  // Check authentication and authorization
  useEffect(() => {
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');

    if (!token) {
      alert('Please login to access super admin panel');
      router.push('/login');
      return;
    }

    // Only super-admin and admin roles can access this page
    if (userRole !== 'super-admin' && userRole !== 'admin') {
      alert('Access denied! Only administrators can access this page.');
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // Load real-time stats
  useEffect(() => {
    if (!isAuthorized) return;
    
    // Simulate loading stats - replace with actual API calls
    setStats({
      totalUsers: 15234,
      activeUsers: 8456,
      totalTransactions: 45678,
      totalRevenue: 12500000,
      pendingKYC: 234,
      activeValidators: 21,
      blockHeight: 1250000,
      networkTPS: 2500,
    });
  }, [isAuthorized]);

  // Show loading while checking authorization
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-400">Checking authorization...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Complete control over VNC Blockchain Platform</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
          <div className="bg-gray-800 rounded-lg px-4 md:px-6 py-3 border border-green-500/30">
            <div className="text-xs md:text-sm text-gray-400">System Status</div>
            <div className="text-xl md:text-2xl font-bold text-green-400 flex items-center">
              <span className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Online
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 md:px-6 py-3 border border-red-500/30">
            <div className="text-xs md:text-sm text-gray-400">Access Level</div>
            <div className="text-xl md:text-2xl font-bold text-red-400">GOD MODE</div>
          </div>
        </div>
      </div>


      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Users className="w-6 h-6 text-blue-400" />}
          color="blue"
        />
        <StatCard
          title="Active Users (24h)"
          value={stats.activeUsers.toLocaleString()}
          change="+8.3%"
          trend="up"
          icon={<Activity className="w-6 h-6 text-green-400" />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000000).toFixed(2)}M`}
          change="+15.2%"
          trend="up"
          icon={<DollarSign className="w-6 h-6 text-purple-400" />}
          color="purple"
        />
        <StatCard
          title="Transactions (24h)"
          value={stats.totalTransactions.toLocaleString()}
          change="+5.7%"
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
          color="orange"
        />
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <SystemStatusCard
          title="Blockchain"
          status={systemStatus.blockchain}
          icon={<Database className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, blockchain: systemStatus.blockchain === 'running' ? 'paused' : 'running'})}
        />
        <SystemStatusCard
          title="Presale"
          status={systemStatus.presale}
          icon={<DollarSign className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, presale: systemStatus.presale === 'active' ? 'paused' : 'active'})}
        />
        <SystemStatusCard
          title="Validators"
          status={systemStatus.validators}
          icon={<Shield className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, validators: systemStatus.validators === 'active' ? 'paused' : 'active'})}
        />
        <SystemStatusCard
          title="API Gateway"
          status={systemStatus.api}
          icon={<Zap className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, api: systemStatus.api === 'running' ? 'stopped' : 'running'})}
        />
        <SystemStatusCard
          title="Payments"
          status={systemStatus.payments}
          icon={<CreditCard className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, payments: systemStatus.payments === 'active' ? 'paused' : 'active'})}
        />
        <SystemStatusCard
          title="Database"
          status={systemStatus.database}
          icon={<Database className="w-5 h-5" />}
          onToggle={() => setSystemStatus({...systemStatus, database: systemStatus.database === 'running' ? 'stopped' : 'running'})}
        />
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* User Management */}
        <ControlPanel
          title="User Management"
          icon={<Users className="w-6 h-6 text-blue-400" />}
          stats={[
            { label: 'Total Users', value: stats.totalUsers.toLocaleString() },
            { label: 'Active Today', value: stats.activeUsers.toLocaleString() },
            { label: 'Pending KYC', value: stats.pendingKYC.toString(), alert: true },
          ]}
          actions={[
            { label: 'View All Users', href: '/super-admin/users' },
            { label: 'KYC Approvals', href: '/super-admin/kyc' },
            { label: 'Roles & Permissions', href: '/super-admin/roles' },
          ]}
        />

        {/* Financial Control */}
        <ControlPanel
          title="Financial Management"
          icon={<Wallet className="w-6 h-6 text-green-400" />}
          stats={[
            { label: 'Total Revenue', value: `$${(stats.totalRevenue / 1000000).toFixed(2)}M` },
            { label: 'Transactions', value: stats.totalTransactions.toLocaleString() },
            { label: 'Pending Withdrawals', value: '12', alert: true },
          ]}
          actions={[
            { label: 'Wallet Management', href: '/super-admin/wallets' },
            { label: 'Transactions', href: '/super-admin/transactions' },
            { label: 'Payment Gateway', href: '/super-admin/payments' },
          ]}
        />

        {/* Blockchain Control */}
        <ControlPanel
          title="Blockchain Control"
          icon={<Database className="w-6 h-6 text-purple-400" />}
          stats={[
            { label: 'Block Height', value: stats.blockHeight.toLocaleString() },
            { label: 'Network TPS', value: stats.networkTPS.toLocaleString() },
            { label: 'Active Validators', value: stats.activeValidators.toString() },
          ]}
          actions={[
            { label: 'Blockchain Settings', href: '/super-admin/blockchain' },
            { label: 'Validator Management', href: '/super-admin/validators' },
            { label: 'Network Status', href: '/super-admin/network' },
          ]}
        />

        {/* Presale Control */}
        <ControlPanel
          title="Presale Management"
          icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
          stats={[
            { label: 'Current Stage', value: 'Stage 3' },
            { label: 'Tokens Sold', value: '5.2M VNC' },
            { label: 'Total Raised', value: '$8.5M' },
          ]}
          actions={[
            { label: 'Presale Dashboard', href: '/super-admin/presale' },
            { label: 'Stage Management', href: '/super-admin/presale/stages' },
            { label: 'Investor List', href: '/super-admin/presale/investors' },
          ]}
        />

        {/* Content Management */}
        <ControlPanel
          title="Content & Communications"
          icon={<FileText className="w-6 h-6 text-cyan-400" />}
          stats={[
            { label: 'Blog Posts', value: '48' },
            { label: 'Notifications Sent', value: '1,234' },
            { label: 'Email Templates', value: '15' },
          ]}
          actions={[
            { label: 'CMS Dashboard', href: '/super-admin/cms' },
            { label: 'Blog Management', href: '/super-admin/blog' },
            { label: 'Send Notification', href: '/super-admin/notifications' },
          ]}
        />

        {/* System Settings */}
        <ControlPanel
          title="System Configuration"
          icon={<Settings className="w-6 h-6 text-red-400" />}
          stats={[
            { label: 'Uptime', value: '99.99%' },
            { label: 'API Keys', value: '8' },
            { label: 'Active Sessions', value: '234' },
          ]}
          actions={[
            { label: 'System Settings', href: '/super-admin/settings' },
            { label: 'API Management', href: '/super-admin/api-keys' },
            { label: 'Security Settings', href: '/super-admin/security' },
          ]}
        />

      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
            <Activity className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-400" />
            Recent System Activity
          </h2>
          <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 text-sm whitespace-nowrap">
            View All Logs
          </button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'user', message: 'New user registered: user@example.com', time: '2 mins ago', severity: 'info' },
            { type: 'payment', message: 'Payment received: $5,000 from yeshurajbelly7@gmail.com', time: '5 mins ago', severity: 'success' },
            { type: 'kyc', message: 'KYC approval pending for 3 users', time: '10 mins ago', severity: 'warning' },
            { type: 'validator', message: 'Validator 0x1234...5678 produced 50 blocks', time: '15 mins ago', severity: 'info' },
            { type: 'system', message: 'System backup completed successfully', time: '1 hour ago', severity: 'success' },
          ].map((activity, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-900/70 transition-all">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.severity === 'success' ? 'bg-green-500' :
                  activity.severity === 'warning' ? 'bg-yellow-500' :
                  activity.severity === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="text-white">{activity.message}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
              <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <QuickActionButton
          icon={<Bell className="w-6 h-6" />}
          label="Send Notification"
          description="Broadcast to all users"
          color="blue"
        />
        <QuickActionButton
          icon={<UserCog className="w-6 h-6" />}
          label="Approve KYC"
          description={`${stats.pendingKYC} pending`}
          color="green"
        />
        <QuickActionButton
          icon={<Shield className="w-6 h-6" />}
          label="Add Validator"
          description="Approve new validator"
          color="purple"
        />
        <QuickActionButton
          icon={<Settings className="w-6 h-6" />}
          label="System Backup"
          description="Create full backup"
          color="red"
        />
      </div>
    </div>
  );
}

// Component: StatCard
function StatCard({ title, value, change, trend, icon, color }: StatCardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-${color}-500/20`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-${color}-500/20 p-3 rounded-lg`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}

// Component: SystemStatusCard
function SystemStatusCard({ title, status, icon, onToggle }: SystemStatusCardProps) {
  const isActive = status === 'running' || status === 'active';
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border ${isActive ? 'border-green-500/30' : 'border-red-500/30'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${isActive ? 'text-green-400' : 'text-red-400'}`}>
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      </div>
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className={`text-xs ${isActive ? 'text-green-400' : 'text-red-400'} mb-3`}>
        {isActive ? 'Active' : 'Stopped'}
      </div>
      <button
        onClick={onToggle}
        className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium ${
          isActive
            ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
            : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
        }`}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}

// Component: ControlPanel
function ControlPanel({ title, icon, stats, actions }: ControlPanelProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gray-900 p-2 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <div className="space-y-2 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{stat.label}</span>
            <span className={`text-sm font-semibold ${stat.alert ? 'text-yellow-400' : 'text-white'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-700">
        {actions.map((action, i) => (
          <a
            key={i}
            href={action.href}
            className="block px-4 py-2 bg-gray-900 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
          >
            {action.label} â†'
          </a>
        ))}
      </div>
    </div>
  );
}

// Component: QuickActionButton
function QuickActionButton({ icon, label, description, color }: QuickActionButtonProps) {
  return (
    <button className={`bg-gray-800 hover:bg-gray-700 rounded-xl p-4 border border-${color}-500/20 hover:border-${color}-500/40 transition-all text-left`}>
      <div className={`bg-${color}-500/20 p-3 rounded-lg inline-block mb-3 text-${color}-400`}>
        {icon}
      </div>
      <div className="text-white font-semibold mb-1">{label}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </button>
  );
}

