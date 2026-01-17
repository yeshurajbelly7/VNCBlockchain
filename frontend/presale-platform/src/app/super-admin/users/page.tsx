'use client';

import React, { useState } from 'react';
import {
  Users, Search, Edit, Trash2, Lock, Mail, Phone,
  CheckCircle, XCircle, Clock, Download, UserPlus, Eye
} from 'lucide-react';export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Yeshuraj Belly',
      email: 'yeshurajbelly7@gmail.com',
      phone: '+91 9876543210',
      role: 'admin',
      status: 'active',
      kycStatus: 'approved',
      walletBalance: '$125,500',
      vncBalance: '10,000 VNC',
      joinDate: '2024-12-15',
      lastActive: '2 mins ago'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543211',
      role: 'user',
      status: 'active',
      kycStatus: 'pending',
      walletBalance: '$50,000',
      vncBalance: '5,000 VNC',
      joinDate: '2025-01-10',
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543212',
      role: 'user',
      status: 'active',
      kycStatus: 'approved',
      walletBalance: '$75,000',
      vncBalance: '7,500 VNC',
      joinDate: '2025-01-08',
      lastActive: '5 hours ago'
    },
    {
      id: 4,
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+91 9876543213',
      role: 'user',
      status: 'suspended',
      kycStatus: 'rejected',
      walletBalance: '$0',
      vncBalance: '0 VNC',
      joinDate: '2025-01-05',
      lastActive: '2 days ago'
    },
  ];

  const stats = {
    totalUsers: 15234,
    activeUsers: 8456,
    pendingKYC: 234,
    suspendedUsers: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage all platform users and their permissions</p>
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-semibold">
          <UserPlus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-green-400 text-sm font-semibold">+12.5%</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">Total Users</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Active</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-400 mt-1">Active Users</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">Pending</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{stats.pendingKYC}</div>
          <div className="text-sm text-gray-400 mt-1">Pending KYC</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">Suspended</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{stats.suspendedUsers}</div>
          <div className="text-sm text-gray-400 mt-1">Suspended</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-purple-500/20">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <select className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="all">All KYC</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 whitespace-nowrap">
            <span className="hidden sm:inline">More Filters</span>
            <span className="sm:hidden">Filters</span>
          </button>
          <button className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">KYC</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Last Active</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : user.status === 'suspended'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.kycStatus === 'approved'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : user.kycStatus === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {user.kycStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">{user.walletBalance}</div>
                    <div className="text-xs text-gray-400">{user.vncBalance}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">{user.lastActive}</div>
                    <div className="text-xs text-gray-500">{user.joinDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 transition-colors" title="Suspend">
                        <Lock className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-900 border-t border-gray-700">
          <div className="text-xs md:text-sm text-gray-400 text-center md:text-left">
            Showing 1 to 4 of 15,234 users
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm whitespace-nowrap">
              Previous
            </button>
            <button className="px-3 md:px-4 py-2 bg-purple-500 text-white rounded-lg text-sm whitespace-nowrap">1</button>
            <button className="px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm whitespace-nowrap">2</button>
            <button className="hidden sm:block px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm whitespace-nowrap">3</button>
            <span className="text-gray-500 text-sm">...</span>
            <button className="px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm whitespace-nowrap">3,809</button>
            <button className="px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm whitespace-nowrap">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

