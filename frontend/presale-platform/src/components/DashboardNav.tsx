'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, BarChart3, User, Wallet, Ticket, Award, Search, Atom } from 'lucide-react';

interface DashboardNavProps {
  currentPath?: string;
}

export default function DashboardNav({ currentPath = '' }: DashboardNavProps) {
  const dashboards = [
    {
      name: 'Super Admin',
      path: '/super-admin',
      icon: Shield,
      color: 'red',
      description: 'God Mode Control',
      accessLevel: 'super-admin',
    },
    {
      name: 'Admin Ops',
      path: '/admin',
      icon: BarChart3,
      color: 'purple',
      description: 'Operations',
      accessLevel: 'admin',
    },
    {
      name: 'User',
      path: '/dashboard',
      icon: User,
      color: 'blue',
      description: 'My Dashboard',
      accessLevel: 'user',
    },
    {
      name: 'Quantum Wallet',
      path: '/quantum-wallet',
      icon: Atom,
      color: 'pink',
      description: 'Unhackable',
      accessLevel: 'user',
    },
    {
      name: 'Wallet System',
      path: '/wallet-system-admin',
      icon: Wallet,
      color: 'green',
      description: 'Hot/Cold Wallets',
      accessLevel: 'admin',
    },
    {
      name: 'Presale',
      path: '/presale-admin',
      icon: Ticket,
      color: 'yellow',
      description: 'Token Sale',
      accessLevel: 'admin',
    },
    {
      name: 'Validator',
      path: '/validator-dashboard',
      icon: Award,
      color: 'indigo',
      description: 'Node Ops',
      accessLevel: 'validator',
    },
    {
      name: 'Explorer',
      path: '/blockchain-explorer',
      icon: Search,
      color: 'cyan',
      description: 'Public',
      accessLevel: 'public',
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg border-2 border-gray-700 rounded-2xl shadow-2xl p-4">
        <div className="flex items-center space-x-2">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            const colors = colorClasses[dashboard.color];
            const isActive = currentPath === dashboard.path;

            return (
              <Link key={dashboard.path} href={dashboard.path}>
                <div
                  className={`
                    group relative px-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${isActive 
                      ? `${colors.bg} ${colors.border} scale-110` 
                      : 'bg-gray-800 border-gray-700 hover:scale-105'}
                  `}
                >
                  <Icon 
                    className={`w-6 h-6 ${isActive ? colors.text : 'text-gray-400 group-hover:text-white'}`} 
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <div className="font-bold text-white text-sm">{dashboard.name}</div>
                      <div className="text-xs text-gray-400">{dashboard.description}</div>
                      <div className={`text-xs ${colors.text} mt-1`}>
                        {dashboard.accessLevel}
                      </div>
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 mx-auto"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dashboard Counter */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-400">
            7 Dashboards â€¢ Professional Blockchain
          </div>
        </div>
      </div>
    </div>
  );
}
