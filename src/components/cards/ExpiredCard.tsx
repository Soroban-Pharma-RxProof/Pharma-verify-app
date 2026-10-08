'use client';

import React from 'react';
import { AlertTriangle, Clock, Calendar, ShieldAlert } from 'lucide-react';
import { VerificationResult } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ExpiredCardProps {
  result: VerificationResult;
  onReport: () => void;
}

export const ExpiredCard: React.FC<ExpiredCardProps> = ({ result, onReport }) => {
  const { t } = useLanguage();
  const batch = result.batch;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Expired';
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border-2 border-amber-500/50 glow-amber animate-in zoom-in-95 duration-300">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-amber-500/20">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Health Warning
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-amber-200 mt-1">
              {t.expiredTitle}
            </h2>
          </div>
        </div>

        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
      </div>

      <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 leading-relaxed">
        {t.expiredDesc}
      </div>

      {/* Batch Information */}
      {batch && (
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">{t.productName}</span>
            <span className="text-white font-semibold mt-0.5 block">{batch.brandName || batch.productName || 'N/A'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">{t.batchId}</span>
            <span className="text-amber-400 font-mono font-semibold mt-0.5 block">{batch.batchId}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Expired On</span>
            <span className="text-rose-400 font-semibold mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(batch.expiryTimestamp)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Action Required</span>
            <span className="text-slate-200 mt-0.5 block">Safely Quarantine & Dispose</span>
          </div>
        </div>
      )}

      {/* Action to Report */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Do not ingest expired medications.
        </span>

        <button
          onClick={onReport}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report Pharmacy Sale</span>
        </button>
      </div>
    </div>
  );
};
