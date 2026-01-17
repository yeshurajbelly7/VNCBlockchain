'use client';

import React from 'react';
import {  Eye } from 'lucide-react';

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
        <p className="text-gray-400">Monitor all system activities and admin actions</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-8 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {[
            { action: 'User login', user: 'yeshurajbelly7@gmail.com', time: '2 mins ago', type: 'info' },
            { action: 'Payment received: $5,000', user: 'john@example.com', time: '5 mins ago', type: 'success' },
            { action: 'KYC approval pending', user: 'jane@example.com', time: '10 mins ago', type: 'warning' },
            { action: 'New user registered', user: 'mike@example.com', time: '15 mins ago', type: 'info' },
            { action: 'Blockchain block produced', user: 'Validator 0x1234...', time: '20 mins ago', type: 'success' },
          ].map((log, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-900/70">
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-500' :
                  log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="text-white">{log.action}</div>
                  <div className="text-sm text-gray-400">{log.user} â€¢ {log.time}</div>
                </div>
              </div>
              <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
