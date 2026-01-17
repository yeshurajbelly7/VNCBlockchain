/**
 * VNC Blockchain - Real-Time Connection Status Component
 * Shows live data synchronization status across all dashboards
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, Database, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useSystemStats, useLatestBlock, useDataChanges, useCurrentUser } from '@/hooks/useDataSync';

export default function RealTimeConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { stats } = useSystemStats();
  const { block } = useLatestBlock();
  const { changes } = useDataChanges();
  const { user } = useCurrentUser();

  useEffect(() => {
    // Simulate connection check
    const checkConnection = setInterval(() => {
      setIsConnected(true);
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(checkConnection);
  }, []);

  // Don&apos;t show for non-authenticated users
  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Connection Card */}
      <div className={`bg-gray-800/95 backdrop-blur-sm border rounded-lg shadow-2xl p-4 min-w-[300px] ${
        isConnected ? 'border-green-500/50' : 'border-red-500/50'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-green-400">Live Connection</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Disconnected</span>
              </>
            )}
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Database className="w-3.5 h-3.5" />
              <span>Latest Block</span>
            </div>
            <span className="text-white font-mono font-bold">
              #{block?.height.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Activity className="w-3.5 h-3.5" />
              <span>Network TPS</span>
            </div>
            <span className="text-white font-mono font-bold">
              {stats?.tps.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span>Active Users</span>
            </div>
            <span className="text-white font-mono font-bold">
              {stats?.activeUsers24h.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Recent Updates</span>
            </div>
            <span className="text-white font-mono font-bold">
              {changes.length}
            </span>
          </div>
        </div>

        {/* Recent Changes */}
        <div className="border-t border-gray-700 pt-3">
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Recent Activity
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {changes.slice(0, 5).map((change: unknown, i: number) => {
              const changeObj = change as { type: string; action: string };
              return (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-gray-300">
                    <span className="font-semibold text-blue-400 capitalize">{changeObj.type}</span>
                    <span className="text-gray-500"> {changeObj.action}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Last Update */}
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="text-[10px] text-gray-500 text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Connection Indicator Dot */}
      <div className="absolute -top-1 -right-1">
        <div className={`w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-400' : 'bg-red-400'
        } animate-pulse`}></div>
      </div>
    </div>
  );
}

// Compact version for mobile
export function RealTimeConnectionIndicator() {
  const [isConnected, setIsConnected] = useState(true);
  const { block } = useLatestBlock();

  useEffect(() => {
    const checkConnection = setInterval(() => {
      setIsConnected(true);
    }, 5000);

    return () => clearInterval(checkConnection);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <div className={`bg-gray-800/95 backdrop-blur-sm border rounded-full p-3 shadow-lg ${
        isConnected ? 'border-green-500/50' : 'border-red-500/50'
      }`}>
        {isConnected ? (
          <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-400" />
        )}
        {block && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {block.height % 1000}
          </div>
        )}
      </div>
    </div>
  );
}
