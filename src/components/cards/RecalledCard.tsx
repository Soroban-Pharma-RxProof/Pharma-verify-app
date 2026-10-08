'use client';

import React from 'react';
import { Ban, ShieldAlert, AlertOctagon, PhoneCall } from 'lucide-react';
import { VerificationResult } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface RecalledCardProps {
  result: VerificationResult;
  onReport: () => void;
}

export const RecalledCard: React.FC<RecalledCardProps> = ({ result, onReport }) => {
  const { t } = useLanguage();
  const batch = result.batch;
  const reason = result.recallReason || batch?.recallReason || 'Regulatory safety recall order issued';

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border-2 border-rose-500 glow-danger animate-in zoom-in-95 duration-300">
      {/* Top Hazard Banner */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-rose-500/20">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 animate-pulse">
            <Ban className="w-7 h-7" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
              URGENT HAZARD
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-rose-200 mt-1">
              {t.recalledTitle}
            </h2>
          </div>
        </div>

        <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
      </div>

      <div className="mt-4 p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-xs text-rose-200 leading-relaxed">
        {t.recalledDesc}
      </div>

      {/* Official Recall Reason Box */}
      <div className="mt-4 p-3.5 bg-slate-900/80 border border-rose-500/20 rounded-2xl text-xs space-y-1">
        <span className="text-slate-400 block text-[11px] font-semibold">Official Recall Directive:</span>
        <p className="text-white font-medium">{reason}</p>
      </div>

      {/* Batch Information Grid */}
      {batch && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">{t.productName}</span>
            <span className="text-white font-semibold mt-0.5 block">{batch.brandName || batch.productName || 'N/A'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">{t.batchId}</span>
            <span className="text-rose-400 font-mono font-semibold mt-0.5 block">{batch.batchId}</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Lock batch stock immediately.
        </span>

        <button
          onClick={onReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-alert transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report Posession to Authorities</span>
        </button>
      </div>
    </div>
  );
};
