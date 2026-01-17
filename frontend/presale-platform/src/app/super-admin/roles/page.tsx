'use client';

import React from 'react';
import { UserCog, Shield } from 'lucide-react';

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Roles & Permissions</h1>
        <p className="text-gray-400">Manage user roles and access control</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 border border-purple-500/20">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Admin</h3>
                <p className="text-sm text-gray-400">Full system access</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>âœ... User management</li>
              <li>âœ... Payment control</li>
              <li>âœ... System configuration</li>
              <li>âœ... All features access</li>
            </ul>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserCog className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold text-white">User</h3>
                <p className="text-sm text-gray-400">Standard user access</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>âœ... Dashboard access</li>
              <li>âœ... Wallet management</li>
              <li>âœ... Buy/Sell tokens</li>
              <li>âŒ Admin features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
