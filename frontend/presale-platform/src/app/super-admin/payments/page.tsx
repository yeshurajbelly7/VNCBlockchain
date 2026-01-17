'use client';
import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, XCircle, Download, Search, Eye, RefreshCw, CreditCard, Shield, Wallet, Settings, Activity, ArrowUpRight, Copy, Edit2, Save, Power, AlertCircle, TrendingUp } from 'lucide-react';

interface Gateway {
  id: string;
  name: string;
  enabled: boolean;
  logo: string;
  credentials: {
    [key: string]: string;
  };
  supportedCurrencies: string[];
  feePercentage: number;
}

interface Payment {
  id: string;
  orderId: string;
  user: string;
  amount: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  transactionId: string;
  gateway: string;
  timestamp: string;
  fee: string;
  currency: string;
  walletType: 'INR' | 'USD';
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'gateways' | 'transactions' | 'settings'>('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterGateway, setFilterGateway] = useState('all');
  const [editingGateway, setEditingGateway] = useState<string | null>(null);
  
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: 'cashfree',
      name: 'Cashfree',
      enabled: true,
      logo: '??',
      credentials: {
        appId: 'YOUR_CASHFREE_APP_ID',
        secretKey: 'cfsk_************',
        webhookUrl: 'https://www.vncblockchain.com/api/cashfree/webhook',
        apiVersion: '2023-08-01'
      },
      supportedCurrencies: ['INR'],
      feePercentage: 2.0
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      enabled: true,
      logo: '?',
      credentials: {
        keyId: 'rzp_live_************',
        keySecret: '************',
        webhookSecret: 'whsec_************'
      },
      supportedCurrencies: ['INR'],
      feePercentage: 2.0
    },
    {
      id: 'paypal',
      name: 'PayPal',
      enabled: true,
      logo: '???',
      credentials: {
        clientId: 'AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS',
        clientSecret: 'EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL',
        mode: 'live',
        webhookId: 'WH-2WR32451HC0233013-67976317FL4543714'
      },
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      feePercentage: 2.9
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      enabled: false,
      logo: '??',
      credentials: {
        merchantId: 'PGTESTPAYUAT',
        saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
        saltIndex: '1',
        redirectUrl: 'https://www.vncblockchain.com/api/phonepe/callback'
      },
      supportedCurrencies: ['INR'],
      feePercentage: 1.8
    }
  ]);

  const [payments, _setPayments] = useState<Payment[]>([
    { id: 'PAY_001', orderId: 'ORD_12345', user: 'Yeshuraj Belly', amount: '?50,000', method: 'UPI', status: 'success', transactionId: 'CF123456789', gateway: 'Cashfree', timestamp: '2024-03-20 14:30:00', fee: '?1,000', currency: 'INR', walletType: 'INR' },
    { id: 'PAY_002', orderId: 'ORD_12346', user: 'John Doe', amount: '$500', method: 'Credit Card', status: 'success', transactionId: 'PP987654321', gateway: 'PayPal', timestamp: '2024-03-20 13:15:00', fee: '$14.50', currency: 'USD', walletType: 'USD' },
    { id: 'PAY_003', orderId: 'ORD_12347', user: 'Priya Sharma', amount: '?25,000', method: 'Net Banking', status: 'pending', transactionId: 'RZP456789123', gateway: 'Razorpay', timestamp: '2024-03-20 12:00:00', fee: '?500', currency: 'INR', walletType: 'INR' },
    { id: 'PAY_004', orderId: 'ORD_12348', user: 'Mike Johnson', amount: '$1,000', method: 'PayPal', status: 'success', transactionId: 'PP555666777', gateway: 'PayPal', timestamp: '2024-03-20 11:30:00', fee: '$29.00', currency: 'USD', walletType: 'USD' },
    { id: 'PAY_005', orderId: 'ORD_12349', user: 'Amit Patel', amount: '?75,000', method: 'UPI', status: 'failed', transactionId: 'CF999888777', gateway: 'Cashfree', timestamp: '2024-03-20 10:45:00', fee: '?0', currency: 'INR', walletType: 'INR' },
    { id: 'PAY_006', orderId: 'ORD_12350', user: 'Sarah Wilson', amount: '$2,500', method: 'Debit Card', status: 'success', transactionId: 'PP333444555', gateway: 'PayPal', timestamp: '2024-03-20 09:20:00', fee: '$72.50', currency: 'USD', walletType: 'USD' },
  ]);

  const stats = {
    totalTransactions: 45678,
    successfulPayments: 43210,
    pendingPayments: 234,
    failedPayments: 2234,
    totalRevenue: '?12.5M + $85K',
    netRevenue: '?12.2M + $82.5K',
    successRate: '94.6%',
    inrDeposits: 8234,
    usdDeposits: 1543,
    activeGateways: gateways.filter(g => g.enabled).length
  };

  const handleToggleGateway = (gatewayId: string) => {
    setGateways(gateways.map(g => 
      g.id === gatewayId ? { ...g, enabled: !g.enabled } : g
    ));
  };

  const handleEditGateway = (gatewayId: string) => {
    setEditingGateway(editingGateway === gatewayId ? null : gatewayId);
  };

  const handleSaveGateway = (gatewayId: string) => {
    setEditingGateway(null);
    // In real implementation, this would save to backend
    alert(`Gateway ${gatewayId} configuration saved successfully!`);
  };

  const handleCredentialChange = (gatewayId: string, field: string, value: string) => {
    setGateways(gateways.map(g => 
      g.id === gatewayId 
        ? { ...g, credentials: { ...g.credentials, [field]: value } }
        : g
    ));
  };

  const handleCopyTransaction = (txId: string) => {
    navigator.clipboard.writeText(txId);
  };

  const filteredPayments = payments.filter(payment => {
    if (filterType !== 'all' && payment.status !== filterType) return false;
    if (filterGateway !== 'all' && payment.gateway.toLowerCase() !== filterGateway) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Payment Gateway Management</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage multiple payment providers, deposits & transactions</p>
        </div>
        <button className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-semibold flex items-center gap-2 text-sm md:text-base transition-all transform hover:scale-105 whitespace-nowrap">
          <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
          Sync All Gateways
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 md:mb-8 bg-gray-800 p-2 rounded-xl border border-purple-500/20">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Activity },
          { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
          { id: 'transactions', label: 'All Transactions', icon: TrendingUp },
          { id: 'settings', label: 'Global Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "overview" | "transactions" | "gateways" | "settings")}
            className={`flex-1 min-w-[140px] px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <PaymentStat 
              title="Total Transactions" 
              value={stats.totalTransactions.toLocaleString()} 
              subtext={`Active Gateways: ${stats.activeGateways}/4`}
              icon={<Activity className="w-6 h-6 text-blue-400" />}
              color="blue"
            />
            <PaymentStat 
              title="Success Rate" 
              value={stats.successRate}
              subtext={`${stats.successfulPayments.toLocaleString()} successful`}
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
              color="green"
            />
            <PaymentStat 
              title="Total Revenue" 
              value={stats.totalRevenue}
              subtext={`Net: ${stats.netRevenue}`}
              icon={<DollarSign className="w-6 h-6 text-purple-400" />}
              color="purple"
            />
            <PaymentStat 
              title="Wallet Deposits" 
              value={`${stats.inrDeposits + stats.usdDeposits}`}
              subtext={`INR: ${stats.inrDeposits} | USD: ${stats.usdDeposits}`}
              icon={<Wallet className="w-6 h-6 text-yellow-400" />}
              color="yellow"
            />
          </div>

          {/* Gateway Status Overview */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              Gateway Status Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gateways.map(gateway => (
                <div key={gateway.id} className={`p-4 rounded-xl border-2 ${gateway.enabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/50 border-gray-600/30'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{gateway.logo}</span>
                      <div>
                        <div className="font-bold text-white">{gateway.name}</div>
                        <div className="text-xs text-gray-400">{gateway.supportedCurrencies.join(', ')}</div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${gateway.enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Fee: {gateway.feePercentage}%</span>
                    <span className={`font-semibold ${gateway.enabled ? 'text-green-400' : 'text-gray-500'}`}>
                      {gateway.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Recent Transactions
              </h2>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 5).map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {payment.status === 'success' ? <CheckCircle className="w-5 h-5" /> :
                       payment.status === 'pending' ? <Clock className="w-5 h-5" /> :
                       <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{payment.user}</div>
                      <div className="text-xs text-gray-400">{payment.gateway} â€¢ {payment.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{payment.amount}</div>
                    <div className="text-xs text-gray-400">{payment.walletType} Wallet</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways Tab */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          {gateways.map(gateway => (
            <div key={gateway.id} className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{gateway.logo}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      {gateway.name}
                      <span className={`text-xs px-2 py-1 rounded-full ${gateway.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                        {gateway.enabled ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-400">
                      {gateway.supportedCurrencies.join(', ')} â€¢ Fee: {gateway.feePercentage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleGateway(gateway.id)}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                      gateway.enabled 
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {gateway.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleEditGateway(gateway.id)}
                    className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 rounded-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    {editingGateway === gateway.id ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {editingGateway === gateway.id ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {Object.entries(gateway.credentials).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm text-gray-400 mb-2 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCredentialChange(gateway.id, key, e.target.value)}
                      readOnly={editingGateway !== gateway.id}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-lg font-mono text-sm ${
                        editingGateway === gateway.id
                          ? 'border-purple-500 text-white'
                          : 'border-gray-700 text-gray-400'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {editingGateway === gateway.id && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-400 mb-1">Editing Mode Active</div>
                    <div className="text-sm text-gray-300">
                      Changes will be applied when you click Save. Test the connection after saving to ensure credentials are valid.
                    </div>
                  </div>
                </div>
              )}

              {editingGateway === gateway.id && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleSaveGateway(gateway.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setEditingGateway(null)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {editingGateway !== gateway.id && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors">
                    Test Connection
                  </button>
                  <button className="flex-1 px-4 py-3 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 rounded-lg text-purple-400 font-semibold transition-colors">
                    View Documentation
                  </button>
                  <button className="flex-1 px-4 py-3 bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 rounded-lg text-green-400 font-semibold transition-colors">
                    View Transactions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-purple-500/20">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search by transaction ID, user, or email..."
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm md:text-base"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm md:text-base"
              >
                <option value="all">All Status</option>
                <option value="success">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={filterGateway}
                onChange={(e) => setFilterGateway(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm md:text-base"
              >
                <option value="all">All Gateways</option>
                <option value="cashfree">Cashfree</option>
                <option value="razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
                <option value="phonepe">PhonePe</option>
              </select>
              <button className="px-4 md:px-6 py-2 md:py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 flex items-center justify-center gap-2 text-sm md:text-base transition-colors whitespace-nowrap">
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-gray-800 rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Payment ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Gateway</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Wallet</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Timestamp</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-900/50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-white">{payment.id}</div>
                        <div className="font-mono text-xs text-gray-500">{payment.orderId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-semibold">{payment.user}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">{payment.amount}</div>
                        <div className="text-xs text-gray-400">Fee: {payment.fee}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-400">
                          {payment.gateway}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {payment.status === 'success' && (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-semibold">Success</span>
                            </>
                          )}
                          {payment.status === 'pending' && (
                            <>
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400 font-semibold">Pending</span>
                            </>
                          )}
                          {payment.status === 'failed' && (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400 font-semibold">Failed</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.walletType === 'INR' 
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                            : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                        }`}>
                          {payment.walletType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-xs text-gray-400">{payment.transactionId}</div>
                          <button 
                            onClick={() => handleCopyTransaction(payment.transactionId)}
                            className="p-1 hover:bg-gray-700 rounded"
                            title="Copy Transaction ID"
                          >
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">{payment.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'pending' && (
                            <button className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400" title="Verify Payment">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {payment.status === 'failed' && (
                            <button className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400" title="Retry Payment">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                Showing {filteredPayments.length} of {payments.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-4 py-2 bg-purple-500 border border-purple-500 rounded-lg text-white">
                  1
                </button>
                <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700">
                  2
                </button>
                <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-purple-500/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Global Payment Settings
            </h2>
            
            <div className="space-y-6">
              {/* Wallet Integration */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Wallet Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <label className="flex items-center justify-between">
                      <span className="text-white font-semibold">Auto-deposit to INR Wallet</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <p className="text-sm text-gray-400 mt-2">Automatically add INR payments to user wallets</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <label className="flex items-center justify-between">
                      <span className="text-white font-semibold">Auto-deposit to USD Wallet</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <p className="text-sm text-gray-400 mt-2">Automatically add USD payments to user wallets</p>
                  </div>
                </div>
              </div>

              {/* Transaction Limits */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Transaction Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Minimum Deposit (INR)</label>
                    <input type="number" defaultValue="100" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Maximum Deposit (INR)</label>
                    <input type="number" defaultValue="500000" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Minimum Deposit (USD)</label>
                    <input type="number" defaultValue="10" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Maximum Deposit (USD)</label>
                    <input type="number" defaultValue="10000" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white" />
                  </div>
                </div>
              </div>

              {/* Gateway Routing */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Gateway Routing Rules</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">INR Transactions</span>
                      <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm">
                        <option value="auto">Auto (Least Fee)</option>
                        <option value="cashfree">Cashfree Only</option>
                        <option value="razorpay">Razorpay Only</option>
                        <option value="phonepe">PhonePe Only</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-400">Default gateway for INR deposits</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">USD Transactions</span>
                      <select className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm">
                        <option value="paypal">PayPal Only</option>
                        <option value="auto">Auto (Least Fee)</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-400">Default gateway for USD deposits</p>
                  </div>
                </div>
              </div>

              {/* Webhook Settings */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Webhook Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Global Webhook URL</label>
                    <input 
                      type="text" 
                      defaultValue="https://www.vncblockchain.com/api/payment/webhook"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                    />
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <label className="flex items-center justify-between">
                      <span className="text-white font-semibold">Enable Webhook Logging</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>
                    <p className="text-sm text-gray-400 mt-2">Log all webhook responses for debugging</p>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105">
                Save All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PaymentStatProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color: string;
}

function PaymentStat({ title, value, subtext, icon, color }: PaymentStatProps) {
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

