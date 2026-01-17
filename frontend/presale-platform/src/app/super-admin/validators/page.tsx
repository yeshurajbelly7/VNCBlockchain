'use client';

import React, { useMemo, useState } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Download,
  Copy,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

type ValidatorStatus = 'active' | 'inactive' | 'pending' | 'jailed';

interface Validator {
  id: string;
  name: string;
  address: string;
  stake: number;
  uptime: number;
  blocksValidated: number;
  commission: string;
  votingPower: number;
  status: ValidatorStatus;
  fullAccess?: boolean;
  country?: string;
}

const INITIAL_VALIDATORS: Validator[] = [
  {
    id: 'v1',
    name: 'VNC Validator 1',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7',
    stake: 5000000,
    uptime: 99.98,
    blocksValidated: 284567,
    commission: '5%',
    votingPower: 5.2,
    status: 'active',
    fullAccess: true,
    country: 'US',
  },
  {
    id: 'v2',
    name: 'VNC Validator 2',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    stake: 3500000,
    uptime: 99.95,
    blocksValidated: 198432,
    commission: '7%',
    votingPower: 3.6,
    status: 'active',
    fullAccess: false,
    country: 'IN',
  },
  {
    id: 'v3',
    name: 'VNC Validator 3',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    stake: 2800000,
    uptime: 99.92,
    blocksValidated: 156789,
    commission: '10%',
    votingPower: 2.9,
    status: 'pending',
    fullAccess: false,
    country: 'DE',
  },
];

export default function ValidatorsPage() {
  const [validators, setValidators] = useState<Validator[]>(INITIAL_VALIDATORS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Validator | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const stats = useMemo(() => {
    const active = validators.filter((v) => v.status === 'active').length;
    const pending = validators.filter((v) => v.status === 'pending').length;
    const totalStaked = validators.reduce((s, v) => s + v.stake, 0);
    return { active, pending, totalStaked };
  }, [validators]);

  const filtered = useMemo(() => {
    return validators
      .filter((v) => (statusFilter === 'all' ? true : v.status === statusFilter))
      .filter((v) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q) ||
          v.country?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.votingPower - a.votingPower);
  }, [validators, query, statusFilter]);

  const handleView = (v: Validator) => {
    setSelected(v);
    setShowViewModal(true);
  };

  const handleEdit = (v: Validator) => {
    setSelected(v);
    setShowEditModal(true);
  };

  const toggleActive = (id: string) => {
    setValidators((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === 'active' ? ('inactive' as ValidatorStatus) : ('active' as ValidatorStatus) } : p)));
  };

  const toggleFullAccess = (id: string) => {
    setValidators((prev) => prev.map((p) => (p.id === id ? { ...p, fullAccess: !p.fullAccess } : p)));
  };

  const saveValidator = (updated: Validator) => {
    setValidators((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setShowEditModal(false);
    setShowViewModal(false);
  };

  const removeValidator = (id: string) => {
    setValidators((prev) => prev.filter((p) => p.id !== id));
  };

  const exportCSV = () => {
    const header = ['id', 'name', 'address', 'stake', 'uptime', 'blocksValidated', 'commission', 'votingPower', 'status', 'fullAccess', 'country'];
    const rows = validators.map((v) => [v.id, v.name, v.address, v.stake, v.uptime, v.blocksValidated, v.commission, v.votingPower, v.status, v.fullAccess ? 'yes' : 'no', v.country || '']);
    const csv = [header, ...rows].map((r) => r.map((c) => `\"${String(c).replace(/\"/g, '\"\"')}\"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validators_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[600px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Validator Dashboard</h1>
        <p className="text-gray-400">Global validator control -- secure, auditable, and internationally ready</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-white">{stats.active}</div>
              <div className="text-sm text-gray-400">Active Validators</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-3xl font-bold text-white">{stats.pending}</div>
              <div className="text-sm text-gray-400">Pending Applications</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-3xl font-bold text-white">{(stats.totalStaked / 1_000_000).toFixed(2)}M VNC</div>
              <div className="text-sm text-gray-400">Total Staked</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="relative w-full">
            <input
              aria-label="Search validators"
              placeholder="Search name, address, country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="jailed">Jailed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Validator
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="px-4 py-3">Validator</th>
                <th className="px-4 py-3">Stake</th>
                <th className="px-4 py-3">Uptime</th>
                <th className="px-4 py-3">Blocks</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Voting Power</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-gray-700 hover:bg-gray-900">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{v.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{v.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{v.stake.toLocaleString()} VNC</td>
                  <td className="px-4 py-3">{v.uptime}%</td>
                  <td className="px-4 py-3">{v.blocksValidated.toLocaleString()}</td>
                  <td className="px-4 py-3">{v.commission}</td>
                  <td className="px-4 py-3">{v.votingPower}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === 'active' ? 'bg-green-500/20 text-green-300' : v.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : v.status === 'jailed' ? 'bg-red-500/20 text-red-300' : 'bg-gray-600 text-gray-300'}`}>
                      {v.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleFullAccess(v.id)} className="flex items-center gap-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded">
                        {v.fullAccess ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />} 
                        <span className="text-xs text-gray-300">{v.fullAccess ? '100%' : 'Limited'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(v)} title="View" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(v)} title="Edit" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleActive(v.id)} title="Toggle Active" className="p-2 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 text-gray-300">
                        {v.status === 'active' ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-yellow-400" />}
                      </button>
                      <button onClick={() => removeValidator(v.id)} title="Remove" className="p-2 bg-red-800/20 border border-red-700 rounded hover:bg-red-800/30 text-red-400">
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

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-3">International Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="px-4 py-2">Chain</th>
                <th className="px-4 py-2">TPS</th>
                <th className="px-4 py-2">Block Time</th>
                <th className="px-4 py-2">Finality</th>
                <th className="px-4 py-2">EVM</th>
                <th className="px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                { chain: 'VNC Blockchain', tps: '400,000', block: '0.0025s', finality: 'Instant', evm: 'Yes', rating: 100 },
                { chain: 'Solana', tps: '65,000', block: '0.4s', finality: '0.4s', evm: 'No', rating: 90 },
                { chain: 'Polygon', tps: '7,200', block: '2s', finality: '2.3s', evm: 'Yes', rating: 88 },
                { chain: 'Bitcoin', tps: '7', block: '600s', finality: '60 min', evm: 'No', rating: 70 },
                { chain: 'Ethereum', tps: '30', block: '12s', finality: '15 min', evm: 'Yes', rating: 85 },
              ].map((c) => (
                <tr key={c.chain} className="border-t border-gray-700 hover:bg-gray-900">
                  <td className="px-4 py-2 text-white font-semibold">{c.chain}</td>
                  <td className="px-4 py-2 text-gray-300">{c.tps}</td>
                  <td className="px-4 py-2 text-gray-300">{c.block}</td>
                  <td className="px-4 py-2 text-gray-300">{c.finality}</td>
                  <td className="px-4 py-2 text-gray-300">{c.evm}</td>
                  <td className="px-4 py-2 text-yellow-400">{c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showViewModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                <div className="text-sm text-gray-400">{selected.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { navigator.clipboard.writeText(selected.address); }} className="px-3 py-2 bg-gray-800 rounded text-gray-300 flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</button>
                <button onClick={() => { setShowViewModal(false); setShowEditModal(true); }} className="px-3 py-2 bg-blue-600 rounded text-white">Edit</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">Stake</div>
                <div className="text-lg font-bold text-white">{selected.stake.toLocaleString()} VNC</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Uptime</div>
                <div className="text-lg text-green-400">{selected.uptime}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Voting Power</div>
                <div className="text-lg text-purple-400 font-semibold">{selected.votingPower}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Blocks Validated</div>
                <div className="text-lg text-white">{selected.blocksValidated.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Commission</div>
                <div className="text-lg text-blue-400">{selected.commission}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Status</div>
                <div className="text-lg text-white">{selected.status}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-700 rounded text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selected && (
        <EditModal validator={selected} onCancel={() => setShowEditModal(false)} onSave={saveValidator} />
      )}
    </div>
  );
}

function EditModal({ validator, onCancel, onSave }: { validator: Validator; onCancel: () => void; onSave: (v: Validator) => void }) {
  const [form, setForm] = useState<Validator>({ ...validator });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Edit Validator</h3>
          <button onClick={onCancel} className="px-2 py-1 bg-gray-800 rounded text-gray-300">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Country</label>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Stake (VNC)</label>
            <input type="number" value={form.stake} onChange={(e) => setForm({ ...form, stake: Number(e.target.value) })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Uptime (%)</label>
            <input type="number" value={form.uptime} onChange={(e) => setForm({ ...form, uptime: Number(e.target.value) })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Commission</label>
            <input value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Voting Power (%)</label>
            <input type="number" value={form.votingPower} onChange={(e) => setForm({ ...form, votingPower: Number(e.target.value) })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ValidatorStatus })} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="jailed">Jailed</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 flex items-center gap-3">
            <label className="text-xs text-gray-400">Full Access (100%)</label>
            <button onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })} className={`px-3 py-2 rounded ${form.fullAccess ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
              {form.fullAccess ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white">Save</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded text-white">Cancel</button>
        </div>
      </div>
    </div>
  );
}
