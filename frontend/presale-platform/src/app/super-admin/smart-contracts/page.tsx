'use client';

import React, { useMemo, useState } from 'react';
import {
  Code,
  Shield,
  Eye,
  Download,
  Copy,
  Play,
  Pause,
  CheckCircle,
  Edit,
  Trash2,
  Search,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  Book,
  Rocket,
  Database,
} from 'lucide-react';

type ContractStatus = 'deployed' | 'pending' | 'verified' | 'paused' | 'deprecated';
type ContractLanguage = 'Solidity' | 'Vyper' | 'Rust' | 'Move';

interface SmartContract {
  id: string;
  name: string;
  address: string;
  language: ContractLanguage;
  version: string;
  status: ContractStatus;
  deployedAt: string;
  txCount: number;
  gasUsed: string;
  balance: string;
  verified: boolean;
  audited: boolean;
  fullAccess: boolean;
  owner: string;
  description?: string;
}

const INITIAL_CONTRACTS: SmartContract[] = [
  {
    id: 'c1',
    name: 'VNC Token Contract',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
    language: 'Solidity',
    version: '0.8.20',
    status: 'verified',
    deployedAt: '2026-01-10',
    txCount: 45678,
    gasUsed: '1.2M',
    balance: '1,250,000 VNC',
    verified: true,
    audited: true,
    fullAccess: true,
    owner: '0xAdmin...',
    description: 'Main VNC ERC-20 token contract',
  },
  {
    id: 'c2',
    name: 'Presale Contract',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    language: 'Solidity',
    version: '0.8.19',
    status: 'deployed',
    deployedAt: '2026-01-12',
    txCount: 12345,
    gasUsed: '850K',
    balance: '500,000 VNC',
    verified: true,
    audited: false,
    fullAccess: true,
    owner: '0xAdmin...',
    description: 'Token presale and vesting contract',
  },
  {
    id: 'c3',
    name: 'Staking Contract',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    language: 'Solidity',
    version: '0.8.20',
    status: 'pending',
    deployedAt: '2026-01-14',
    txCount: 0,
    gasUsed: '0',
    balance: '0 VNC',
    verified: false,
    audited: false,
    fullAccess: false,
    owner: '0xAdmin...',
    description: 'Staking rewards distribution',
  },
];

const CONTRACT_TEMPLATES = [
  { id: 't1', name: 'ERC-20 Token', icon: '??', lang: 'Solidity', description: 'Standard fungible token' },
  { id: 't2', name: 'ERC-721 NFT', icon: '???', lang: 'Solidity', description: 'Non-fungible token standard' },
  { id: 't3', name: 'Multisig Wallet', icon: '??', lang: 'Solidity', description: 'Multi-signature wallet' },
  { id: 't4', name: 'DAO Governance', icon: '???', lang: 'Solidity', description: 'Decentralized governance' },
  { id: 't5', name: 'Staking Pool', icon: '??', lang: 'Solidity', description: 'Token staking rewards' },
  { id: 't6', name: 'DEX AMM', icon: '??', lang: 'Solidity', description: 'Automated market maker' },
];

export default function SmartContractsPage() {
  const [contracts, setContracts] = useState<SmartContract[]>(INITIAL_CONTRACTS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<SmartContract | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [_showDeployModal, setShowDeployModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'contracts' | 'deploy' | 'templates' | 'analytics'>('contracts');

  const stats = useMemo(() => {
    const deployed = contracts.filter((c) => c.status === 'deployed' || c.status === 'verified').length;
    const verified = contracts.filter((c) => c.verified).length;
    const audited = contracts.filter((c) => c.audited).length;
    const totalTx = contracts.reduce((s, c) => s + c.txCount, 0);
    return { deployed, verified, audited, totalTx };
  }, [contracts]);

  const filtered = useMemo(() => {
    return contracts
      .filter((c) => (statusFilter === 'all' ? true : c.status === statusFilter))
      .filter((c) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
      })
      .sort((a, b) => b.txCount - a.txCount);
  }, [contracts, query, statusFilter]);

  const handleView = (c: SmartContract) => {
    setSelected(c);
    setShowViewModal(true);
  };

  const handleEdit = (c: SmartContract) => {
    setSelected(c);
    setShowEditModal(true);
  };

  const saveContract = (updated: SmartContract) => {
    setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setShowEditModal(false);
    setShowViewModal(false);
    alert('Contract updated successfully!');
  };

  const toggleFullAccess = (id: string) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, fullAccess: !c.fullAccess } : c)));
  };

  const _toggleVerified = (id: string) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)));
  };

  const pauseContract = (id: string) => {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'paused' ? ('deployed' as ContractStatus) : ('paused' as ContractStatus) } : c)));
  };

  const removeContract = (id: string) => {
    if (confirm('Are you sure you want to remove this contract?')) {
      setContracts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const exportContracts = () => {
    const header = ['id', 'name', 'address', 'language', 'version', 'status', 'deployedAt', 'txCount', 'gasUsed', 'balance', 'verified', 'audited', 'fullAccess'];
    const rows = contracts.map((c) => [c.id, c.name, c.address, c.language, c.version, c.status, c.deployedAt, c.txCount, c.gasUsed, c.balance, c.verified, c.audited, c.fullAccess]);
    const csv = [header, ...rows].map((r) => r.map((cell) => `\"${String(cell).replace(/\"/g, '\"\"')}\"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart_contracts_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Code className="w-8 h-8 text-purple-400" />
            Smart Contract Hub
          </h1>
          <p className="text-gray-400">Enterprise contract deployment, management, and security</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDeployModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
            <Rocket className="w-4 h-4" /> Deploy Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.deployed}</div>
              <div className="text-sm text-gray-400">Deployed</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.verified}</div>
              <div className="text-sm text-gray-400">Verified</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <Lock className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.audited}</div>
              <div className="text-sm text-gray-400">Audited</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{stats.totalTx.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total TX</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700">
        {[
          { id: 'contracts', label: 'Contracts', icon: Database },
          { id: 'deploy', label: 'Deploy', icon: Rocket },
          { id: 'templates', label: 'Templates', icon: Book },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'contracts' | 'deploy' | 'templates' | 'analytics')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="relative w-full">
                <input
                  aria-label="Search contracts"
                  placeholder="Search contracts, address..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white">
                <option value="all">All Status</option>
                <option value="deployed">Deployed</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="paused">Paused</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={exportContracts} className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3">Contract</th>
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3">Transactions</th>
                    <th className="px-4 py-3">Gas Used</th>
                    <th className="px-4 py-3">Balance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Security</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-900">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{c.address}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-300">{c.language}</div>
                        <div className="text-xs text-gray-500">v{c.version}</div>
                      </td>
                      <td className="px-4 py-3 text-white">{c.txCount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-300">{c.gasUsed}</td>
                      <td className="px-4 py-3 text-green-400">{c.balance}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            c.status === 'verified'
                              ? 'bg-green-500/20 text-green-300'
                              : c.status === 'deployed'
                              ? 'bg-blue-500/20 text-blue-300'
                              : c.status === 'paused'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {c.verified && (
                            <span title="Verified">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </span>
                          )}
                          {c.audited && (
                            <span title="Audited">
                              <Shield className="w-4 h-4 text-blue-400" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleFullAccess(c.id)} className={`px-2 py-1 rounded text-xs ${c.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                          {c.fullAccess ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleView(c)} title="View" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEdit(c)} title="Edit" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => pauseContract(c.id)} title="Pause/Resume" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                            {c.status === 'paused' ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-yellow-400" />}
                          </button>
                          <button onClick={() => removeContract(c.id)} title="Remove" className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTRACT_TEMPLATES.map((t) => (
            <div key={t.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer">
              <div className="text-4xl mb-3">{t.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{t.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">{t.lang}</span>
                <button className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-sm">Use Template</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'deploy' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Deploy New Contract</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Contract Name</label>
              <input className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white" placeholder="My Smart Contract" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Language</label>
              <select className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white">
                <option>Solidity</option>
                <option>Vyper</option>
                <option>Rust</option>
                <option>Move</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Contract Code</label>
              <textarea className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white font-mono text-sm" rows={10} placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyContract {
    // Your code here
}"></textarea>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white">Deploy Contract</button>
              <button className="px-6 py-2 bg-gray-700 rounded text-white">Compile Only</button>
              <button className="px-6 py-2 bg-gray-700 rounded text-white">Verify Code</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Platform Comparison</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Deploy Time</th>
                  <th className="pb-2">Gas Cost</th>
                  <th className="pb-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'VNC Blockchain', time: '2s', gas: 'Ultra Low', rating: 100 },
                  { name: 'Ethereum', time: '15min', gas: 'High', rating: 85 },
                  { name: 'Polygon', time: '2min', gas: 'Low', rating: 88 },
                  { name: 'Solana', time: '1s', gas: 'Very Low', rating: 90 },
                  { name: 'BSC', time: '3s', gas: 'Medium', rating: 82 },
                ].map((p) => (
                  <tr key={p.name} className="border-t border-gray-700">
                    <td className="py-2 text-white font-semibold">{p.name}</td>
                    <td className="py-2 text-gray-300">{p.time}</td>
                    <td className="py-2 text-gray-300">{p.gas}</td>
                    <td className="py-2 text-yellow-400">{p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Gas Optimization</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <span className="text-sm text-gray-300">Average Gas Used</span>
                <span className="text-white font-bold">685K</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <span className="text-sm text-gray-300">Gas Saved (Optimized)</span>
                <span className="text-green-400 font-bold">-35%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <span className="text-sm text-gray-300">Total Gas Cost</span>
                <span className="text-white font-bold">$1,234</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <div className="text-sm text-gray-400 font-mono">{selected.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(selected.address)} className="px-3 py-2 bg-gray-800 rounded text-gray-300 flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 rounded text-white"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">Language</div>
                <div className="text-lg text-white">
                  {selected.language} v{selected.version}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-lg text-white">{selected.status}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Transactions</div>
                <div className="text-lg text-green-400">{selected.txCount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Gas Used</div>
                <div className="text-lg text-purple-400">{selected.gasUsed}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-lg text-yellow-400">{selected.balance}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Deployed</div>
                <div className="text-lg text-white">{selected.deployedAt}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Verified</div>
                <div className="text-lg text-white">{selected.verified ? '? Yes' : '? No'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Audited</div>
                <div className="text-lg text-white">{selected.audited ? '? Yes' : '? No'}</div>
              </div>
            </div>

            {selected.description && (
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-1">Description</div>
                <div className="text-sm text-gray-300">{selected.description}</div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-700 rounded text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selected && <EditModal contract={selected} onCancel={() => setShowEditModal(false)} onSave={saveContract} />}
    </div>
  );
}

function EditModal({ contract, onCancel, onSave }: { contract: SmartContract; onCancel: () => void; onSave: (c: SmartContract) => void }) {
  const [form, setForm] = useState<SmartContract>({ ...contract });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edit Smart Contract</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Language</label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as ContractLanguage })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
              <option value="Solidity">Solidity</option>
              <option value="Vyper">Vyper</option>
              <option value="Rust">Rust</option>
              <option value="Move">Move</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Version</label>
            <input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContractStatus })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
              <option value="deployed">Deployed</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="paused">Paused</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Balance</label>
            <input value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Gas Used</label>
            <input value={form.gasUsed} onChange={(e) => setForm({ ...form, gasUsed: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs text-gray-400">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" rows={3} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Verified</label>
            <button onClick={() => setForm({ ...form, verified: !form.verified })} className={`px-3 py-2 rounded ${form.verified ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              {form.verified ? 'Yes' : 'No'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Audited</label>
            <button onClick={() => setForm({ ...form, audited: !form.audited })} className={`px-3 py-2 rounded ${form.audited ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              {form.audited ? 'Yes' : 'No'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400">Full Access (1000%)</label>
            <button onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })} className={`px-3 py-2 rounded ${form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              {form.fullAccess ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white">
            Save Changes
          </button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}




