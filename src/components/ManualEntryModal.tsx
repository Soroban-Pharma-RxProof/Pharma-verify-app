'use client';

import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchId: string, serial: string) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const [batchId, setBatchId] = useState('');
  const [serial, setSerial] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId.trim()) {
      setError('Please provide a batch identifier');
      return;
    }
    if (!serial.trim()) {
      setError('Please provide a serial number or hash');
      return;
    }

    setError(null);
    onSubmit(batchId.trim().toUpperCase(), serial.trim().toUpperCase());
    onClose();
  };

  const handlePrefillDemo = () => {
    setBatchId('ACT-500-2026-B1');
    setSerial('RX-DEMO-2026-PACK-001');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-slate-700/80">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            {t.enterSerialManually}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.batchId}
            </label>
            <input
              type="text"
              required
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="e.g. ACT-500-2026-B1"
              className="w-full px-3 py-2 text-sm rounded-xl glass-input uppercase placeholder:normal-case placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Serial Number or Hash
            </label>
            <input
              type="text"
              required
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder={t.serialNumberPlaceholder}
              className="w-full px-3 py-2 text-sm rounded-xl glass-input uppercase placeholder:normal-case placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Sample</span>
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-glow hover:opacity-95 transition-all"
            >
              {t.verifyButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
