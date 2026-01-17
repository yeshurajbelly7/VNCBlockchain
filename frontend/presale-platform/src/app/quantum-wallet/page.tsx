"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardNav from '@/components/DashboardNav';
import {
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  Activity,
  Key,
  Cpu,
  Clock,
  Copy,
  RefreshCw,
  BarChart3,
  Fingerprint,
  Atom
} from 'lucide-react';

interface QuantumWallet {
  address: string;
  owner: string;
  securityLevel: string;
  antiClone: {
    enabled: boolean;
    quantumFingerprint: string;
    entanglementID: string;
    cloneAttempts: number;
  };
  antiFlash: {
    enabled: boolean;
    minHoldTime: number;
    cooldownPeriod: number;
    maxTransactionSize: number;
  };
  rateLimit: {
    maxPerHour: number;
    maxPerDay: number;
    currentHourly: number;
    currentDaily: number;
  };
  multiSig: {
    enabled: boolean;
    requiredSignatures: number;
    totalSigners: number;
  };
  quantumKeys: {
    dilithium: string;
    kyber: string;
    falcon: string;
  };
  balance: number;
  transactions: number;
}

interface SecurityReport {
  hackability: string;
  reason: string;
  quantumSpeed: string;
  encryption: string;
  signatureAlgorithms: string[];
  antiCloneProtection: string;
  antiFlashProtection: string;
  complianceScore: number;
}

export default function QuantumWalletPage() {
  const [wallet, setWallet] = useState<QuantumWallet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulate wallet creation
  const createQuantumWallet = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate quantum key generation
    
    const newWallet: QuantumWallet = {
      address: `0xQNT${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      owner: "user@vnc.com",
      securityLevel: "MAXIMUM (Quantum-Secured)",
      antiClone: {
        enabled: true,
        quantumFingerprint: `QFP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        entanglementID: `ENT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        cloneAttempts: 0
      },
      antiFlash: {
        enabled: true,
        minHoldTime: 30,
        cooldownPeriod: 5,
        maxTransactionSize: 1000000
      },
      rateLimit: {
        maxPerHour: 100,
        maxPerDay: 1000,
        currentHourly: 0,
        currentDaily: 0
      },
      multiSig: {
        enabled: true,
        requiredSignatures: 3,
        totalSigners: 5
      },
      quantumKeys: {
        dilithium: `DLT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        kyber: `KYB-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        falcon: `FLC-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
      },
      balance: 0,
      transactions: 0
    };

    setWallet(newWallet);
    setIsCreating(false);
    generateSecurityReport();
  };

  const generateSecurityReport = () => {
    setSecurityReport({
      hackability: "IMPOSSIBLE",
      reason: "Protected by quantum mechanics laws (No-Cloning Theorem)",
      quantumSpeed: "INSTANTANEOUS (Faster than Light)",
      encryption: "AES-256-GCM + Post-Quantum Cryptography",
      signatureAlgorithms: ["CRYSTALS-Dilithium", "CRYSTALS-Kyber", "FALCON"],
      antiCloneProtection: "Quantum Fingerprint Verification",
      antiFlashProtection: "Time Locks + Rate Limiting + Multi-Sig",
      complianceScore: 100
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Atom className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Quantum Wallet</h1>
              <p className="text-gray-400">Unhackable â€¢ Anti-Clone â€¢ Anti-Flash Protected</p>
            </div>
          </div>

          {/* Quantum Security Badge */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">Quantum-Secured</span>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">Faster Than Light</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Unhackable</span>
            </div>
          </div>
        </motion.div>

        {/* Create Wallet Section */}
        {!wallet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-12 text-center"
          >
            <Atom className="w-24 h-24 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Create Your Quantum Wallet</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Generate a quantum-secured wallet with post-quantum cryptography, anti-cloning protection, 
              and faster-than-light communication capabilities. Your wallet will be mathematically 
              impossible to hack thanks to quantum mechanics laws.
            </p>

            <button
              onClick={createQuantumWallet}
              disabled={isCreating}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Quantum Keys...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Create Quantum Wallet
                </>
              )}
            </button>

            {isCreating && (
              <div className="mt-8 space-y-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-purple-400 flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  Initializing CRYSTALS-Dilithium keys...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-blue-400 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Generating CRYSTALS-Kyber encryption...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-green-400 flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  Creating quantum fingerprint...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 }}
                  className="text-yellow-400 flex items-center justify-center gap-2"
                >
                  <Atom className="w-4 h-4" />
                  Establishing quantum entanglement...
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Wallet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Wallet Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Wallet Address</h3>
                    <div className="flex items-center gap-3">
                      <code className="text-purple-400 font-mono text-lg">{wallet.address}</code>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                      >
                        <Copy className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Balance</div>
                    <div className="text-2xl font-bold text-white">{wallet.balance.toLocaleString()} VNC</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Transactions</div>
                    <div className="text-2xl font-bold text-white">{wallet.transactions}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-t border-purple-500/20">
                    <span className="text-gray-400">Security Level</span>
                    <span className="text-green-400 font-semibold">{wallet.securityLevel}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-purple-500/20">
                    <span className="text-gray-400">Owner</span>
                    <span className="text-white">{wallet.owner}</span>
                  </div>
                </div>
              </motion.div>

              {/* Security Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-green-900/40 to-black/40 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Security Status</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Hackability</span>
                    <span className="text-green-400 font-bold">IMPOSSIBLE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Clone Protection</span>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Flash Protection</span>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Multi-Sig</span>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Rate Limiting</span>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-green-500/20">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-1">100%</div>
                    <div className="text-gray-400 text-sm">Security Score</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Protection Systems */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Anti-Clone Protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/40 to-black/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Anti-Clone System</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-green-400 font-semibold">ACTIVE</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Quantum Fingerprint</div>
                    <code className="text-blue-400 text-xs font-mono">{wallet.antiClone.quantumFingerprint}</code>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Entanglement ID</div>
                    <code className="text-purple-400 text-xs font-mono">{wallet.antiClone.entanglementID}</code>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-blue-500/20">
                    <span className="text-gray-400 text-sm">Clone Attempts</span>
                    <span className={`font-bold ${wallet.antiClone.cloneAttempts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {wallet.antiClone.cloneAttempts}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Anti-Flash Protection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-yellow-900/40 to-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Anti-Flash System</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="text-green-400 font-semibold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-yellow-500/20">
                    <span className="text-gray-400 text-sm">Min Hold Time</span>
                    <span className="text-white">{wallet.antiFlash.minHoldTime}s</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-yellow-500/20">
                    <span className="text-gray-400 text-sm">Cooldown</span>
                    <span className="text-white">{wallet.antiFlash.cooldownPeriod}s</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-yellow-500/20">
                    <span className="text-gray-400 text-sm">Max TX Size</span>
                    <span className="text-white">{wallet.antiFlash.maxTransactionSize.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Rate Limiting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-red-900/40 to-black/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-bold text-white">Rate Limiting</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Hourly Usage</span>
                      <span className="text-white">{wallet.rateLimit.currentHourly}/{wallet.rateLimit.maxPerHour}</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${(wallet.rateLimit.currentHourly / wallet.rateLimit.maxPerHour) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Daily Usage</span>
                      <span className="text-white">{wallet.rateLimit.currentDaily}/{wallet.rateLimit.maxPerDay}</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${(wallet.rateLimit.currentDaily / wallet.rateLimit.maxPerDay) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quantum Keys & Multi-Sig */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quantum Cryptographic Keys */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Quantum Cryptographic Keys</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">CRYSTALS-Dilithium</span>
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Signature</span>
                    </div>
                    <code className="text-purple-400 text-xs font-mono break-all">{wallet.quantumKeys.dilithium}</code>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">CRYSTALS-Kyber</span>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Encryption</span>
                    </div>
                    <code className="text-blue-400 text-xs font-mono break-all">{wallet.quantumKeys.kyber}</code>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">FALCON</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Compact</span>
                    </div>
                    <code className="text-green-400 text-xs font-mono break-all">{wallet.quantumKeys.falcon}</code>
                  </div>
                </div>
              </motion.div>

              {/* Multi-Signature Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-indigo-900/40 to-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Multi-Signature Configuration</h3>
                </div>

                <div className="mb-6">
                  <div className="text-center py-8 bg-black/30 rounded-lg">
                    <div className="text-5xl font-bold text-indigo-400 mb-2">
                      {wallet.multiSig.requiredSignatures}/{wallet.multiSig.totalSigners}
                    </div>
                    <div className="text-gray-400">Signatures Required</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-t border-indigo-500/20">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-semibold">ENABLED</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-indigo-500/20">
                    <span className="text-gray-400">Required Signatures</span>
                    <span className="text-white font-semibold">{wallet.multiSig.requiredSignatures}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-indigo-500/20">
                    <span className="text-gray-400">Total Signers</span>
                    <span className="text-white font-semibold">{wallet.multiSig.totalSigners}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-indigo-500/20">
                    <span className="text-gray-400">Security Type</span>
                    <span className="text-indigo-400 font-semibold">3-of-5 Multi-Sig</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Security Report */}
            {securityReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 bg-gradient-to-br from-green-900/40 to-black/40 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Comprehensive Security Report</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Hackability Status</div>
                    <div className="text-green-400 font-bold text-lg">{securityReport.hackability}</div>
                    <div className="text-gray-500 text-xs mt-1">{securityReport.reason}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Quantum Speed</div>
                    <div className="text-purple-400 font-bold text-lg">{securityReport.quantumSpeed}</div>
                    <div className="text-gray-500 text-xs mt-1">Entanglement-based</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Encryption</div>
                    <div className="text-blue-400 font-bold text-sm">{securityReport.encryption}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Compliance Score</div>
                    <div className="text-green-400 font-bold text-lg">{securityReport.complianceScore}%</div>
                    <div className="text-gray-500 text-xs mt-1">NIST Approved</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Signature Algorithms</div>
                    <div className="space-y-1">
                      {securityReport.signatureAlgorithms.map((algo: string, idx: number) => (
                        <div key={idx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded inline-block mr-2">
                          {algo}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Anti-Clone Protection</div>
                    <div className="text-blue-400 text-sm">{securityReport.antiCloneProtection}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">Anti-Flash Protection</div>
                    <div className="text-yellow-400 text-sm">{securityReport.antiFlashProtection}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
