'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Shield,
  Database,
  DollarSign,
  FileText,
  Bell,
  Lock,
  Globe,
  Activity,
  UserCog,
  CreditCard,
  BarChart3,
  Mail,
  Key,
  AlertTriangle,
  CheckCircle,
  Gift,
  Target,
} from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication and authorization
    const token = localStorage.getItem('vnc_auth_token');
    const userRole = localStorage.getItem('vnc_user_role');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Only super-admin and admin roles can access this area
    if (userRole !== 'super-admin' && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    setIsAuthorized(true);
  }, [router]);

  // Don&apos;t render content until authorization is verified
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <div className="text-white text-xl font-semibold">Verifying Access...</div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      category: 'Overview',
      items: [
        { href: '/super-admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { href: '/super-admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/super-admin/activity-logs', label: 'Activity Logs', icon: <Activity className="w-5 h-5" /> },
      ]
    },
    {
      category: 'User Management',
      items: [
        { href: '/super-admin/users', label: 'All Users', icon: <Users className="w-5 h-5" /> },
        { href: '/super-admin/roles', label: 'Roles & Permissions', icon: <UserCog className="w-5 h-5" /> },
        { href: '/super-admin/kyc', label: 'KYC Management', icon: <CheckCircle className="w-5 h-5" /> },
      ]
    },
    {
      category: 'Financial Management',
      items: [
        { href: '/super-admin/wallets', label: 'Wallet Management', icon: <Wallet className="w-5 h-5" /> },
        { href: '/super-admin/transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
        { href: '/super-admin/presale', label: 'Presale Control', icon: <DollarSign className="w-5 h-5" /> },
        { href: '/super-admin/payments', label: 'Payment Gateway', icon: <CreditCard className="w-5 h-5" /> },
      ]
    },
    {
      category: 'Rewards & Incentives',
      items: [
        { href: '/super-admin/airdrops', label: 'Airdrop Management', icon: <Gift className="w-5 h-5" /> },
        { href: '/super-admin/referrals', label: 'Referral System', icon: <Target className="w-5 h-5" /> },
      ]
    },
    {
      category: 'Blockchain Control',
      items: [
        { href: '/super-admin/blockchain', label: 'Blockchain Settings', icon: <Database className="w-5 h-5" /> },
        { href: '/super-admin/validators', label: 'Validators', icon: <Shield className="w-5 h-5" /> },
        { href: '/super-admin/smart-contracts', label: 'Smart Contracts', icon: <FileText className="w-5 h-5" /> },
        { href: '/super-admin/network', label: 'Network Status', icon: <Globe className="w-5 h-5" /> },
      ]
    },
    {
      category: 'Content Management',
      items: [
        { href: '/super-admin/cms', label: 'CMS', icon: <FileText className="w-5 h-5" /> },
        { href: '/super-admin/blog', label: 'Blog Posts', icon: <FileText className="w-5 h-5" /> },
        { href: '/super-admin/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
        { href: '/super-admin/emails', label: 'Email Templates', icon: <Mail className="w-5 h-5" /> },
      ]
    },
    {
      category: 'System Configuration',
      items: [
        { href: '/super-admin/settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
        { href: '/super-admin/api-keys', label: 'API Keys', icon: <Key className="w-5 h-5" /> },
        { href: '/super-admin/security', label: 'Security', icon: <Lock className="w-5 h-5" /> },
        { href: '/super-admin/monitoring', label: 'System Monitoring', icon: <Activity className="w-5 h-5" /> },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Top Warning Bar */}
      <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">SUPER ADMIN MODE</span>
          </div>
          <div className="text-gray-400 text-sm">
            Full System Control â€¢ Use with Caution
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 border-r border-gray-800 min-h-screen p-4">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-8 h-8 text-red-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Super Admin</h2>
                <p className="text-xs text-gray-400">God Mode</p>
              </div>
            </div>
          </div>

          <nav className="space-y-6">
            {menuItems.map((category, idx) => (
              <div key={idx}>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">
                  {category.category}
                </div>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
