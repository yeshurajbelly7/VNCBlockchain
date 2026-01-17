'use client';
import { useState } from 'react';
import { Database, Zap, Settings, Shield, Activity, TrendingUp, Lock, Cpu, Network, Server, CheckCircle, AlertCircle, Edit2, Save, X, BarChart3, Globe, Clock, Award, Target, Boxes, Eye, Copy, RefreshCw, Terminal, FileCode, Gauge } from 'lucide-react';

interface BlockchainConfig {
  blockTime: number;
  maxValidators: number;
  minStake: string;
  gasPrice: string;
  blockGasLimit: string;
  maxBlockSize: string;
  consensusAlgorithm: string;
  networkId: string;
  chainId: number;
}

interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  activeValidators: number;
  networkHashrate: string;
  avgBlockTime: string;
  tps: number;
  pendingTransactions: number;
  memPoolSize: string;
}

interface Validator {
  id: string;
  address: string;
  name: string;
  stake: string;
  uptime: string;
  blocksValidated: number;
  status: 'active' | 'inactive' | 'jailed';
  commission: string;
  votingPower: string;
}

export default function BlockchainPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'configuration' | 'validators' | 'network' | 'smart-contracts' | 'comparison'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [networkStatus, _setNetworkStatus] = useState<'running' | 'paused' | 'maintenance'>('running');

  const [config, setConfig] = useState<BlockchainConfig>({
    blockTime: 2,
    maxValidators: 101,
    minStake: '100000',
    gasPrice: '20',
    blockGasLimit: '30000000',
    maxBlockSize: '2',
    consensusAlgorithm: 'Proof of Stake (PoS)',
    networkId: 'vnc-mainnet',
    chainId: 1337
  });

  const [stats, _setStats] = useState<NetworkStats>({
    totalBlocks: 15847392,
    totalTransactions: 234567890,
    activeValidators: 95,
    networkHashrate: '1.2 PH/s',
    avgBlockTime: '0.0025s',
    tps: 400000,
    pendingTransactions: 1234,
    memPoolSize: '45.6 MB'
  });

  const [validators, setValidators] = useState<Validator[]>([
    { id: '1', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7', name: 'VNC Validator #1', stake: '5,000,000 VNC', uptime: '99.98%', blocksValidated: 284567, status: 'active', commission: '5%', votingPower: '5.2%' },
    { id: '2', address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', name: 'VNC Validator #2', stake: '3,500,000 VNC', uptime: '99.95%', blocksValidated: 198432, status: 'active', commission: '7%', votingPower: '3.6%' },
    { id: '3', address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', name: 'VNC Validator #3', stake: '2,800,000 VNC', uptime: '99.92%', blocksValidated: 156789, status: 'active', commission: '10%', votingPower: '2.9%' },
    { id: '4', address: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', name: 'VNC Validator #4', stake: '2,200,000 VNC', uptime: '98.45%', blocksValidated: 98765, status: 'inactive', commission: '8%', votingPower: '2.3%' },
    { id: '5', address: '0xdBdDa0d139C3d7932162d8F4A2dD4F3e6e6E8347', name: 'VNC Validator #5', stake: '1,500,000 VNC', uptime: '95.20%', blocksValidated: 45678, status: 'jailed', commission: '12%', votingPower: '1.6%' },
  ]);

  const handleConfigChange = (field: keyof BlockchainConfig, value: string | number) => {
    setConfig({ ...config, [field]: value });
  };

  const handleSaveConfig = () => {
    setIsEditing(false);
    alert('Blockchain configuration saved successfully!');
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  // Validator modals / actions
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [showValidatorModal, setShowValidatorModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [validatorForm, setValidatorForm] = useState<Validator | null>(null);

  const handleViewValidator = (validator: Validator) => {
    setSelectedValidator(validator);
    setShowValidatorModal(true);
  };

  const handleManageValidator = (validator: Validator) => {
    setSelectedValidator(validator);
    setValidatorForm(validator);
    setShowManageModal(true);
  };

  const handleCloseModals = () => {
    setShowValidatorModal(false);
    setShowManageModal(false);
    setSelectedValidator(null);
    setValidatorForm(null);
  };

  const handleSaveValidator = (updated: Validator) => {
    setValidators(vs => vs.map(v => (v.id === updated.id ? updated : v)));
    handleCloseModals();
    alert('Validator updated');
  };

  const blockchainComparison = [
    { name: 'VNC Blockchain', tps: 400000, blockTime: '0.0025s', finality: 'Instant', gasPrice: '20 GWEI', consensus: 'PoS', sharding: 'Yes', evm: 'Yes', rating: 100 },
    { name: 'Ethereum', tps: 30, blockTime: '12s', finality: '15 min', gasPrice: '25 GWEI', consensus: 'PoS', sharding: 'Planned', evm: 'Yes', rating: 85 },
    { name: 'Binance Smart Chain', tps: 160, blockTime: '3s', finality: '75s', gasPrice: '5 GWEI', consensus: 'PoSA', sharding: 'No', evm: 'Yes', rating: 82 },
    { name: 'Polygon', tps: 7200, blockTime: '2s', finality: '2.3s', gasPrice: '30 GWEI', consensus: 'PoS', sharding: 'No', evm: 'Yes', rating: 88 },
    { name: 'Solana', tps: 65000, blockTime: '0.4s', finality: '0.4s', gasPrice: 'Low', consensus: 'PoH', sharding: 'No', evm: 'No', rating: 90 },
    { name: 'Avalanche', tps: 4500, blockTime: '1s', finality: '1s', gasPrice: '25 GWEI', consensus: 'Avalanche', sharding: 'Yes', evm: 'Yes', rating: 87 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <Database className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            VNC Blockchain Management
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Enterprise-grade blockchain configuration & monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            networkStatus === 'running' ? 'bg-green-500/20 border border-green-500/30' :
            networkStatus === 'paused' ? 'bg-yellow-500/20 border border-yellow-500/30' :
            'bg-red-500/20 border border-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              networkStatus === 'running' ? 'bg-green-400' :
              networkStatus === 'paused' ? 'bg-yellow-400' :
              'bg-red-400'
            }`}></div>
            <span className={`font-semibold text-sm ${
              networkStatus === 'running' ? 'text-green-400' :
              networkStatus === 'paused' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {networkStatus === 'running' ? 'Network Active' : networkStatus === 'paused' ? 'Network Paused' : 'Maintenance'}
            </span>
          </div>
          <button className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-semibold flex items-center gap-2 text-sm md:text-base transition-all transform hover:scale-105">
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
            Sync Network
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 md:mb-8 bg-gray-800 p-2 rounded-xl border border-purple-500/20">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Activity },
          { id: 'configuration', label: 'Configuration', icon: Settings },
          { id: 'validators', label: 'Validators', icon: Shield },
          { id: 'network', label: 'Network Monitor', icon: Network },
          { id: 'smart-contracts', label: 'Smart Contracts', icon: FileCode },
          { id: 'comparison', label: 'Comparison', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'configuration' | 'validators' | 'network' | 'smart-contracts' | 'comparison')}
            className={`flex-1 min-w-[120px] px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Network Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="Total Blocks" value={stats.totalBlocks.toLocaleString()} subtext="Height: Latest" icon={<Boxes className="w-6 h-6 text-blue-400" />} color="blue" />
            <StatCard title="Total Transactions" value={(stats.totalTransactions / 1000000).toFixed(1) + 'M'} subtext={`TPS: ${stats.tps.toLocaleString()}`} icon={<TrendingUp className="w-6 h-6 text-green-400" />} color="green" />
            <StatCard title="Active Validators" value={stats.activeValidators + '/' + config.maxValidators} subtext="Network Health: 95%" icon={<Shield className="w-6 h-6 text-purple-400" />} color="purple" />
            <StatCard title="Network Hashrate" value={stats.networkHashrate} subtext={`Avg: ${stats.avgBlockTime}`} icon={<Cpu className="w-6 h-6 text-yellow-400" />} color="yellow" />
          </div>

          {/* Real-time Performance */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-green-400" />
              Real-time Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Transactions Per Second</span>
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stats.tps.toLocaleString()}</div>
                <div className="text-sm text-green-400">+12.5% from yesterday</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Pending Transactions</span>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stats.pendingTransactions.toLocaleString()}</div>
                <div className="text-sm text-gray-400">MemPool: {stats.memPoolSize}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Average Block Time</span>
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stats.avgBlockTime}</div>
                <div className="text-sm text-blue-400">Target: {config.blockTime}s</div>
              </div>
            </div>
          </div>

          {/* Core Parameters Overview */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Core Blockchain Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ParamCard label="Block Time" value={config.blockTime + ' seconds'} icon="?" />
              <ParamCard label="Max Validators" value={config.maxValidators.toString()} icon="???" />
              <ParamCard label="Min Stake" value={parseInt(config.minStake).toLocaleString() + ' VNC'} icon="??" />
              <ParamCard label="Gas Price" value={config.gasPrice + ' GWEI'} icon="?" />
              <ParamCard label="Block Gas Limit" value={(parseInt(config.blockGasLimit) / 1000000).toFixed(1) + 'M'} icon="??" />
              <ParamCard label="Max Block Size" value={config.maxBlockSize + ' MB'} icon="??" />
              <ParamCard label="Consensus" value={config.consensusAlgorithm.split('(')[0].trim()} icon="??" />
              <ParamCard label="Chain ID" value={config.chainId.toString()} icon="??" />
            </div>
          </div>

          {/* Top Validators */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Top Validators
              </h2>
              <button 
                onClick={() => setActiveTab('validators')}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                View All ?
              </button>
            </div>
            <div className="space-y-3">
              {validators.slice(0, 3).map(validator => (
                <div key={validator.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      validator.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      validator.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{validator.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{validator.address.slice(0, 10)}...{validator.address.slice(-8)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{validator.stake}</div>
                    <div className="text-xs text-green-400">Uptime: {validator.uptime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'configuration' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-400" />
                Blockchain Configuration
              </h2>
              <button
                onClick={() => isEditing ? handleSaveConfig() : setIsEditing(true)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  isEditing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                }`}
              >
                {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                {isEditing ? 'Save Configuration' : 'Edit Configuration'}
              </button>
            </div>

            {isEditing && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-400 mb-1">Configuration Edit Mode</div>
                  <div className="text-sm text-gray-300">
                    Changes will affect the entire network. Please review carefully before saving. A network restart may be required.
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConfigField
                label="Block Time (seconds)"
                value={config.blockTime}
                onChange={(v) => handleConfigChange('blockTime', v)}
                isEditing={isEditing}
                type="number"
                description="Time between block generation"
              />
              <ConfigField
                label="Maximum Validators"
                value={config.maxValidators}
                onChange={(v) => handleConfigChange('maxValidators', v)}
                isEditing={isEditing}
                type="number"
                description="Maximum number of active validators"
              />
              <ConfigField
                label="Minimum Stake (VNC)"
                value={config.minStake}
                onChange={(v) => handleConfigChange('minStake', v)}
                isEditing={isEditing}
                type="text"
                description="Minimum stake required to become validator"
              />
              <ConfigField
                label="Gas Price (GWEI)"
                value={config.gasPrice}
                onChange={(v) => handleConfigChange('gasPrice', v)}
                isEditing={isEditing}
                type="text"
                description="Base gas price for transactions"
              />
              <ConfigField
                label="Block Gas Limit"
                value={config.blockGasLimit}
                onChange={(v) => handleConfigChange('blockGasLimit', v)}
                isEditing={isEditing}
                type="text"
                description="Maximum gas per block"
              />
              <ConfigField
                label="Max Block Size (MB)"
                value={config.maxBlockSize}
                onChange={(v) => handleConfigChange('maxBlockSize', v)}
                isEditing={isEditing}
                type="text"
                description="Maximum block size in megabytes"
              />
              <ConfigField
                label="Network ID"
                value={config.networkId}
                onChange={(v) => handleConfigChange('networkId', v)}
                isEditing={isEditing}
                type="text"
                description="Unique network identifier"
              />
              <ConfigField
                label="Chain ID"
                value={config.chainId}
                onChange={(v) => handleConfigChange('chainId', v)}
                isEditing={isEditing}
                type="number"
                description="EVM chain identifier"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm text-gray-400 mb-2 block">Consensus Algorithm</label>
              <select
                value={config.consensusAlgorithm}
                onChange={(e) => handleConfigChange('consensusAlgorithm', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white ${
                  isEditing ? 'border-purple-500' : 'border-gray-700'
                }`}
              >
                <option value="Proof of Stake (PoS)">Proof of Stake (PoS)</option>
                <option value="Delegated Proof of Stake (DPoS)">Delegated Proof of Stake (DPoS)</option>
                <option value="Proof of Authority (PoA)">Proof of Authority (PoA)</option>
                <option value="Byzantine Fault Tolerance (BFT)">Byzantine Fault Tolerance (BFT)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Consensus mechanism for block validation</p>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white font-semibold transition-all"
                >
                  Save & Apply Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-400" />
              Advanced Network Settings
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">EVM Compatibility</div>
                  <div className="text-sm text-gray-400">Enable Ethereum Virtual Machine support</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" disabled={!isEditing} />
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Sharding Enabled</div>
                  <div className="text-sm text-gray-400">Enable blockchain sharding for scalability</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" disabled={!isEditing} />
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Cross-Chain Bridge</div>
                  <div className="text-sm text-gray-400">Enable cross-chain asset transfers</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" disabled={!isEditing} />
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Smart Contract Auditing</div>
                  <div className="text-sm text-gray-400">Automatic security auditing for deployed contracts</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" disabled={!isEditing} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validators Tab */}
      {activeTab === 'validators' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Validator</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Stake</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Uptime</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Blocks</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Commission</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Voting Power</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {validators.map(validator => (
                    <tr key={validator.id} className="hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{validator.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">{validator.address.slice(0, 10)}...{validator.address.slice(-8)}</span>
                          <button onClick={() => handleCopyAddress(validator.address)} className="p-1 hover:bg-gray-700 rounded">
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{validator.stake}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${parseFloat(validator.uptime) > 99 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {validator.uptime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{validator.blocksValidated.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-blue-400">{validator.commission}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-purple-400 font-semibold">{validator.votingPower}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          validator.status === 'active' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                          validator.status === 'inactive' ? 'bg-gray-500/20 border border-gray-500/30 text-gray-400' :
                          'bg-red-500/20 border border-red-500/30 text-red-400'
                        }`}>
                          {validator.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleViewValidator(validator)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleManageValidator(validator)} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400" title="Manage">
                            <Settings className="w-4 h-4" />
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

      {/* Network Monitor Tab */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Network Nodes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">Full Nodes</span>
                  <span className="text-white font-bold">1,247</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">Light Nodes</span>
                  <span className="text-white font-bold">8,956</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">Archive Nodes</span>
                  <span className="text-white font-bold">156</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Geographic Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">?? Asia Pacific</span>
                  <span className="text-white font-bold">45%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">?? Europe</span>
                  <span className="text-white font-bold">30%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400">?? Americas</span>
                  <span className="text-white font-bold">25%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              Network Console
            </h3>
            <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1">
              <div className="text-green-400">[INFO] Network Status: Running</div>
              <div className="text-blue-400">[INFO] Latest Block: #{stats.totalBlocks.toLocaleString()}</div>
              <div className="text-yellow-400">[WARN] MemPool Size: {stats.memPoolSize}</div>
              <div className="text-green-400">[INFO] Active Validators: {stats.activeValidators}/{config.maxValidators}</div>
              <div className="text-blue-400">[INFO] Current TPS: {stats.tps.toLocaleString()}</div>
              <div className="text-green-400">[INFO] Network Sync: 100%</div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Contracts Tab */}
      {activeTab === 'smart-contracts' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileCode className="w-6 h-6 text-blue-400" />
              Deployed Smart Contracts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-white mb-2">2,456</div>
                <div className="text-sm text-gray-400">Total Contracts</div>
              </div>
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-green-400 mb-2">98.5%</div>
                <div className="text-sm text-gray-400">Verified Contracts</div>
              </div>
              <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-blue-400 mb-2">156</div>
                <div className="text-sm text-gray-400">Active Today</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-4">Contract Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <div className="text-2xl mb-2">??</div>
                <div className="text-2xl font-bold text-white">456</div>
                <div className="text-sm text-gray-400">Token Contracts</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <div className="text-2xl mb-2">??</div>
                <div className="text-2xl font-bold text-white">892</div>
                <div className="text-sm text-gray-400">NFT Contracts</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <div className="text-2xl mb-2">??</div>
                <div className="text-2xl font-bold text-white">234</div>
                <div className="text-sm text-gray-400">DeFi Protocols</div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg text-center">
                <div className="text-2xl mb-2">??</div>
                <div className="text-2xl font-bold text-white">874</div>
                <div className="text-sm text-gray-400">Gaming/Other</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
              Blockchain Comparison Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Blockchain</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">TPS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Block Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Finality</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Gas Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Consensus</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Sharding</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">EVM</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {blockchainComparison.map((chain, idx) => (
                    <tr key={idx} className={`hover:bg-gray-900/50 ${idx === 0 ? 'bg-purple-500/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${idx === 0 ? 'text-purple-400' : 'text-white'} flex items-center gap-2`}>
                          {chain.name}
                          {idx === 0 && <span className="text-xs px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">OUR CHAIN</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${idx === 0 ? 'text-green-400' : 'text-white'}`}>{chain.tps.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{chain.blockTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{chain.finality}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{chain.gasPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
                          {chain.consensus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {chain.sharding === 'Yes' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : chain.sharding === 'Planned' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {chain.evm === 'Yes' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`font-bold ${idx === 0 ? 'text-purple-400' : 'text-white'}`}>{chain.rating}/100</div>
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${idx === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}
                              style={{ width: `${chain.rating}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-yellow-400" />
              VNC Blockchain Advantages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Ultra-Fast TPS</div>
                  <div className="text-sm text-gray-300">4,500+ transactions per second with instant finality</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Low Gas Fees</div>
                  <div className="text-sm text-gray-300">Competitive gas prices with predictable costs</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">EVM Compatible</div>
                  <div className="text-sm text-gray-300">Full Ethereum compatibility for easy migration</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Sharding Enabled</div>
                  <div className="text-sm text-gray-300">Built-in sharding for horizontal scalability</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Enterprise-Grade Security</div>
                  <div className="text-sm text-gray-300">Advanced security features and auditing</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Cross-Chain Bridges</div>
                  <div className="text-sm text-gray-300">Native support for cross-chain asset transfers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validator View Modal */}
      {showValidatorModal && selectedValidator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Validator Details</h3>
                <div className="text-sm text-gray-400">{selectedValidator.name}</div>
              </div>
              <button onClick={handleCloseModals} className="p-2 rounded bg-gray-800/60 hover:bg-gray-800">
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">Address</div>
                <div className="font-mono text-sm text-white flex items-center gap-2">
                  {selectedValidator.address}
                  <button onClick={() => handleCopyAddress(selectedValidator.address)} className="p-1 hover:bg-gray-800 rounded">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Stake</div>
                <div className="text-sm font-bold text-white">{selectedValidator.stake}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Uptime</div>
                <div className="text-sm text-green-400">{selectedValidator.uptime}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Voting Power</div>
                <div className="text-sm text-purple-400 font-semibold">{selectedValidator.votingPower}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Blocks Validated</div>
                <div className="text-sm text-white">{selectedValidator.blocksValidated.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Commission</div>
                <div className="text-sm text-blue-400">{selectedValidator.commission}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowValidatorModal(false); setShowManageModal(true); setValidatorForm(selectedValidator); }} className="px-4 py-2 bg-blue-500 rounded text-white">Edit</button>
              <button onClick={handleCloseModals} className="px-4 py-2 bg-gray-700 rounded text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Validator Manage Modal */}
      {showManageModal && validatorForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl bg-gray-900 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Manage Validator</h3>
                <div className="text-sm text-gray-400">Edit validator parameters</div>
              </div>
              <button onClick={handleCloseModals} className="p-2 rounded bg-gray-800/60 hover:bg-gray-800">
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Name</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.name} onChange={(e) => setValidatorForm({ ...validatorForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Stake</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.stake} onChange={(e) => setValidatorForm({ ...validatorForm, stake: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Commission</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.commission} onChange={(e) => setValidatorForm({ ...validatorForm, commission: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Status</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.status} onChange={(e) => setValidatorForm({ ...validatorForm, status: e.target.value as 'active' | 'inactive' | 'jailed' })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="jailed">Jailed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400">Voting Power</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.votingPower} onChange={(e) => setValidatorForm({ ...validatorForm, votingPower: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Uptime</label>
                <input className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white" value={validatorForm.uptime} onChange={(e) => setValidatorForm({ ...validatorForm, uptime: e.target.value })} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => validatorForm && handleSaveValidator(validatorForm)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white">Save</button>
              <button onClick={handleCloseModals} className="px-4 py-2 bg-gray-700 rounded text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, subtext, icon, color }: { title: string; value: string | number; subtext?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-${color}-500/20`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`bg-${color}-500/20 p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </div>
  );
}

function ParamCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function ConfigField({ label, value, onChange, isEditing, type, description }: { label: string; value: string | number; onChange: (val: string | number) => void; isEditing: boolean; type: string; description: string }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
        readOnly={!isEditing}
        className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white ${
          isEditing ? 'border-purple-500' : 'border-gray-700'
        }`}
      />
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

