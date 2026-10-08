'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Calendar, Package, ArrowRight, Binary } from 'lucide-react';
import { VerificationResult } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AuthenticCardProps {
  result: VerificationResult;
  onViewJourney: () => void;
}

export const AuthenticCard: React.FC<AuthenticCardProps> = ({ result, onViewJourney }) => {
  const { t } = useLanguage();
  const batch = result.batch;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 border-2 border-emerald-500/40 glow-emerald animate-in zoom-in-95 duration-300">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-emerald-500/20">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Genuine
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <Binary className="w-3.5 h-3.5" />
                Merkle Verified
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {t.authenticTitle}
            </h2>
          </div>
        </div>

        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
      </div>

      <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
        {t.authenticDesc}
      </p>

      {/* Product Details Grid */}
      {batch && (
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">{t.productName}</span>
            <span className="text-white font-semibold mt-0.5 block">{batch.brandName || batch.productName || 'N/A'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">{t.batchId}</span>
            <span className="text-emerald-400 font-mono font-semibold mt-0.5 block">{batch.batchId}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">{t.dosage}</span>
            <span className="text-slate-200 mt-0.5 block">{batch.dosageForm || batch.dosage || 'Standard'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">{t.expiryDate}</span>
            <span className="text-emerald-300 font-medium mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" />
              {formatDate(batch.expiryTimestamp)}
            </span>
          </div>
        </div>
      )}

      {/* Action to View Traceability */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Current Custodian: <span className="font-mono text-slate-300">{batch?.currentCustody?.slice(0, 6) || batch?.currentCustodian?.slice(0, 6) || 'Verified Pharmacy'}...</span>
        </span>

        <button
          onClick={onViewJourney}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group transition-colors"
        >
          <span>{t.custodyChain}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
