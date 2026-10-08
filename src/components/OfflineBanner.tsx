'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { OfflineStorage } from '../lib/offline-storage';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Attempt background sync of queued scans
      const pending = OfflineStorage.getPendingScans();
      setPendingCount(pending.length);
    };

    const handleOffline = () => {
      setIsOffline(true);
      const pending = OfflineStorage.getPendingScans();
      setPendingCount(pending.length);
    };

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      const pending = OfflineStorage.getPendingScans();
      setPendingCount(pending.length);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline && pendingCount === 0) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs flex items-center justify-between backdrop-blur-sm z-50">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {isOffline
            ? 'Low-Connectivity Field Mode Active: Using client-side Merkle proof verification.'
            : `${pendingCount} offline scans awaiting background synchronization.`}
        </span>
      </div>
      {pendingCount > 0 && (
        <div className="flex items-center space-x-1.5 bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/30">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Queue: {pendingCount}</span>
        </div>
      )}
    </div>
  );
};
