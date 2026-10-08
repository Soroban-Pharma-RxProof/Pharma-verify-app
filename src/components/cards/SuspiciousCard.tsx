'use client';

import React from 'react';
import { Skull, AlertTriangle, ShieldAlert, History, Flame } from 'lucide-react';
import { VerificationResult } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface SuspiciousCardProps {
  result: VerificationResult;
  onReport: () => void;
}

export const SuspiciousCard: React.FC<SuspiciousCardProps> = ({ result, onReport }) => {
  const { t } = useLanguage();
  const batch = result.batch;
  const pack = result.pack;

  const formatBurnedTime = (dispensedAt?: string | Date) => {
    if (!dispensedAt) return 'Recorded on-chain';
    return new Date(dispensedAt).toLocaleString();
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border-2 border-rose-600 bg-gradient-to-b from-rose-950/40 to-slate-950/90 glow-danger animate-in zoom-in-95 duration-300">
      {/* Top Banner with Skull Hazard */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-rose-600/30">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/25 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
            <Skull className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-max">
              <Flame className="w-3 h-3 text-rose-400" />
              CLONED CODE DETECTED
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-rose-200 mt-1">
              {t.suspiciousTitle}
            </h2>
          </div>
        </div>

        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
      </div>

      <div className="mt-4 p-4 bg-rose-600/20 border border-rose-500/40 rounded-2xl text-xs text-rose-100 leading-relaxed font-medium">
        {t.suspiciousDesc}
      </div>

      {/* Forensic Timeline Box */}
      <div className="mt-4 p-4 bg-slate-900/90 border border-rose-500/30 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px]">
          <History className="w-4 h-4" />
          <span>Blockchain Audit Evidence:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          The genuine serial was already burned on the Soroban ledger at:{' '}
          <span className="font-mono font-bold text-rose-300 block sm:inline mt-1 sm:mt-0">
            {formatBurnedTime(result.dispensedAt || pack?.dispensedAt)}
          </span>
        </p>
        <p className="text-[11px] text-slate-400">
          Because authentic codes cannot be dispensed twice, this current package is almost certainly a counterfeit photocopy.
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 text-center sm:text-left">
          Confiscate package and alert pharmacy manager.
        </span>

        <button
          onClick={onReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-alert transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Report Counterfeit Cloned Pack</span>
        </button>
      </div>
    </div>
  );
};
