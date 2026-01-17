'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Key, Lock, FileText } from 'lucide-react';

// Permission Matrix Visualization Component
// Based on the RBAC Permission Table from the blueprint

export default function PermissionMatrixViewer() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // THE GOLDEN RULE: Least Privilege Permission Matrix
  const permissionMatrix = [
    { 
      action: 'View blockchain status', 
      superAdmin: true, 
      adminOps: true, 
      user: false, 
      validator: true,
      description: 'Read-only access to blockchain metrics'
    },
    { 
      action: 'Pause blockchain', 
      superAdmin: true, 
      adminOps: false, 
      user: false, 
      validator: false,
      description: 'Emergency stop for maintenance'
    },
    { 
      action: 'Mint / burn token', 
      superAdmin: true, 
      adminOps: false, 
      user: false, 
      validator: false,
      description: 'Critical supply management'
    },
    { 
      action: 'Approve KYC', 
      superAdmin: false, 
      adminOps: true, 
      user: false, 
      validator: false,
      description: 'Verify user identity documents'
    },
    { 
      action: 'Freeze user wallet', 
      superAdmin: true, 
      adminOps: true, 
      user: false, 
      validator: false,
      description: 'Lock suspicious accounts'
    },
    { 
      action: 'Buy presale', 
      superAdmin: false, 
      adminOps: false, 
      user: true, 
      validator: false,
      description: 'Purchase tokens during presale'
    },
    { 
      action: 'View own wallet', 
      superAdmin: false, 
      adminOps: false, 
      user: true, 
      validator: false,
      description: 'Access personal wallet balance'
    },
    { 
      action: 'Validate blocks', 
      superAdmin: false, 
      adminOps: false, 
      user: false, 
      validator: true,
      description: 'Produce and validate blockchain blocks'
    },
    { 
      action: 'Slash validator', 
      superAdmin: true, 
      adminOps: false, 
      user: false, 
      validator: false,
      description: 'Penalize misbehaving validators'
    },
    { 
      action: 'View audit logs', 
      superAdmin: true, 
      adminOps: false, 
      user: false, 
      validator: false,
      description: 'Full system audit trail (Admin Ops: Partial)'
    },
  ];

  const roles = [
    { 
      id: 'superAdmin', 
      name: 'Super Admin', 
      icon: 'ðŸ"´', 
      color: 'red',
      description: 'God Mode - Full System Control',
      count: '2-3 users'
    },
    { 
      id: 'adminOps', 
      name: 'Admin Ops', 
      icon: 'ðŸŸ ', 
      color: 'orange',
      description: 'Operations & Support Team',
      count: '10-20 users'
    },
    { 
      id: 'user', 
      name: 'User', 
      icon: 'ðŸŸ¢', 
      color: 'green',
      description: 'Regular Investors',
      count: '8,500+ users'
    },
    { 
      id: 'validator', 
      name: 'Validator', 
      icon: 'ðŸŸ£', 
      color: 'purple',
      description: 'Node Operators',
      count: '21 validators'
    },
  ];

  const getRolePermissions = (roleId: string) => {
    return permissionMatrix.filter(p => p[roleId as keyof typeof p] === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Shield className="w-10 h-10 mr-3 text-purple-400" />
            RBAC Permission Matrix
          </h1>
          <p className="text-gray-400">
            ðŸ§  THE GOLDEN RULE: Least Privilege - Each role has minimal necessary permissions
          </p>
        </div>

        {/* Security Principle Banner */}
        <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <Lock className="w-8 h-8 text-purple-400 mr-4 flex-shrink-0" />
            <div>
              <div className="font-bold text-purple-400 text-xl mb-2">
                Security Architecture Principles
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <div className="font-bold text-white mb-1">ðŸ›¡ï¸ Trust Boundaries</div>
                  <div>Dashboards = Trust Boundaries</div>
                  <div>APIs = Power Boundaries</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">ðŸ" Access Control</div>
                  <div>PEP â†' PDP â†' PAP verification</div>
                  <div>Every action is validated</div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">ðŸ" Audit Trail</div>
                  <div>All admin actions logged</div>
                  <div>Immutable audit records</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {roles.map((role) => {
            const permCount = getRolePermissions(role.id).length;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `bg-${role.color}-500/20 border-${role.color}-500/50 scale-105`
                    : 'bg-gray-800 border-gray-700 hover:scale-105'
                }`}
              >
                <div className="text-4xl mb-2">{role.icon}</div>
                <div className="font-bold text-white mb-1">{role.name}</div>
                <div className="text-xs text-gray-400 mb-2">{role.description}</div>
                <div className="text-2xl font-bold text-white mb-1">{permCount}</div>
                <div className="text-xs text-gray-400">Permissions</div>
                <div className="text-xs text-gray-500 mt-2">{role.count}</div>
              </button>
            );
          })}
        </div>

        {/* Permission Matrix Table */}
        <div className="bg-gray-800 rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="bg-gray-900 p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Key className="w-6 h-6 mr-2 text-purple-400" />
              Permission Matrix - API / Action Access Control
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-400 border-b border-gray-700">
                    API / Action
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-red-400 border-b border-gray-700">
                    ðŸ"´ Super Admin
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-orange-400 border-b border-gray-700">
                    ðŸŸ  Admin Ops
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-green-400 border-b border-gray-700">
                    ðŸŸ¢ User
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-purple-400 border-b border-gray-700">
                    ðŸŸ£ Validator
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((perm, index) => {
                  const isHighlighted = selectedRole ? perm[selectedRole as keyof typeof perm] === true : false;
                  
                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-700 transition-all ${
                        isHighlighted ? 'bg-purple-500/10' : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{perm.action}</div>
                        <div className="text-xs text-gray-400 mt-1">{perm.description}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {perm.superAdmin ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {perm.adminOps ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : perm.action === 'View audit logs' ? (
                          <div title="Partial Access">
                            <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto" />
                          </div>
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {perm.user ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {perm.validator ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span className="font-bold text-white">Granted</span>
            </div>
            <p className="text-sm text-gray-400">
              User role has full permission to perform this action
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center mb-3">
              <XCircle className="w-6 h-6 text-red-500 mr-2" />
              <span className="font-bold text-white">Denied</span>
            </div>
            <p className="text-sm text-gray-400">
              Access forbidden - will return 403 Forbidden error
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="font-bold text-white">Partial</span>
            </div>
            <p className="text-sm text-gray-400">
              Limited access - can only see their own actions
            </p>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-400" />
            Access Control Architecture (3-Layer)
          </h2>
          
          <div className="space-y-6">
            {/* Blockchain Layer */}
            <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
              <div className="font-bold text-blue-400 mb-2">ðŸ"¦ Blockchain Layer</div>
              <div className="text-sm text-gray-300">
                Genesis Block â†' Block 1 â†' ... â†' Block N | Smart Contracts | State DB
              </div>
            </div>

            {/* Gateway Layer */}
            <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-lg p-6">
              <div className="font-bold text-purple-400 mb-2">ðŸŒ Gateway Layer (Smart Gateway)</div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-300 mt-3">
                <div className="bg-gray-900 rounded p-3">
                  <div className="font-bold text-white mb-1">PEP</div>
                  <div className="text-xs">Policy Enforcement Point</div>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <div className="font-bold text-white mb-1">PDP</div>
                  <div className="text-xs">Policy Decision Point</div>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <div className="font-bold text-white mb-1">PAP</div>
                  <div className="text-xs">Policy Administration Point</div>
                </div>
              </div>
            </div>

            {/* Access Layer */}
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6">
              <div className="font-bold text-green-400 mb-2">ðŸ'¥ Access Layer (Users & Admins)</div>
              <div className="grid grid-cols-4 gap-3 text-sm text-gray-300 mt-3">
                <div className="bg-gray-900 rounded p-3 text-center">
                  <div className="text-2xl mb-1">ðŸ"´</div>
                  <div className="font-bold text-xs">Super Admin</div>
                </div>
                <div className="bg-gray-900 rounded p-3 text-center">
                  <div className="text-2xl mb-1">ðŸŸ </div>
                  <div className="font-bold text-xs">Admin Ops</div>
                </div>
                <div className="bg-gray-900 rounded p-3 text-center">
                  <div className="text-2xl mb-1">ðŸŸ¢</div>
                  <div className="font-bold text-xs">Users</div>
                </div>
                <div className="bg-gray-900 rounded p-3 text-center">
                  <div className="text-2xl mb-1">ðŸŸ£</div>
                  <div className="font-bold text-xs">Validators</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            â¬‡ï¸ Every request flows: User â†' Gateway (Auth) â†' Blockchain â†' Response
          </div>
        </div>
      </div>
    </div>
  );
}
