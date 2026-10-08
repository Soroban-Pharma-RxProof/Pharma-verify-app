'use client';

import React from 'react';
import { Pill, Check, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface BlisterVisualizerProps {
  totalStrips: number;
  unitsPerStrip: number;
  dispensedBitmask: number;
  onSelectStripToDispense?: (stripIndex: number) => void;
  selectable?: boolean;
}

export const BlisterVisualizer: React.FC<BlisterVisualizerProps> = ({
  totalStrips = 2,
  unitsPerStrip = 10,
  dispensedBitmask = 0,
  onSelectStripToDispense,
  selectable = false,
}) => {
  const { t } = useLanguage();

  // Helper: check if i-th bit is 1 (dispensed)
  const isStripDispensed = (index: number) => {
    return (dispensedBitmask & (1 << index)) !== 0;
  };

  const remainingCount = Array.from({ length: totalStrips }).filter(
    (_, i) => !isStripDispensed(i)
  ).length;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <Pill className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white">
            {t.blisterStripsRemaining}
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {remainingCount} / {totalStrips} Strips Available
        </span>
      </div>

      {/* Grid of blister strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {Array.from({ length: totalStrips }).map((_, index) => {
          const dispensed = isStripDispensed(index);
          return (
            <div
              key={index}
              onClick={() => {
                if (selectable && !dispensed && onSelectStripToDispense) {
                  onSelectStripToDispense(index);
                }
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                dispensed
                  ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                  : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/60 cursor-pointer shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold">
                    Strip #{index + 1}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({unitsPerStrip} tablets)
                  </span>
                </div>
                <span className="text-[10px] mt-0.5 block">
                  {dispensed ? 'Dispensed / Burned' : 'Sealed & Intact'}
                </span>
              </div>

              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  dispensed
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {dispensed ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
