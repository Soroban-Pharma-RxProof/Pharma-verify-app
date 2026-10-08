'use client';

import React, { useEffect, useState } from 'react';
import { X, History, Download, Trash2, ShieldCheck, AlertTriangle, Ban, Skull } from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { OfflineStorage } from '../lib/offline-storage';

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan: (batchId: string, serial: string) => void;
}

export const ScanHistoryDrawer: React.FC<ScanHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectScan,
}) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(OfflineStorage.getScanHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    OfflineStorage.clearScanHistory();
    setHistory([]);
  };

  const handleExportCsv = () => {
    const csv = OfflineStorage.exportHistoryCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rxproof-scan-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AUTHENTIC':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'EXPIRED':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'RECALLED':
        return <Ban className="w-4 h-4 text-rose-400" />;
      case 'SUSPICIOUS_CLONED':
      default:
        return <Skull className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Scan History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="py-3 flex items-center justify-between gap-2 border-b border-slate-800/60">
          <span className="text-xs text-slate-400">
            {history.length} {history.length === 1 ? 'record' : 'records'}
          </span>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No scans recorded yet. Verified packs will appear here.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScan(item.batchId, item.serial);
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 shrink-0">{getStatusIcon(item.status)}</div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-white block">
                      {item.batchId}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[180px]">
                      {item.serial}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {item.status.replace('SUSPICIOUS_', '')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
