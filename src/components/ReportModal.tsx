'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { ApiClient } from '../lib/api-client';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBatchId?: string;
  initialSerial?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  initialBatchId = '',
  initialSerial = '',
}) => {
  const { t } = useLanguage();
  const [batchId, setBatchId] = useState(initialBatchId);
  const [serial, setSerial] = useState(initialSerial);
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide reason or observations for the report');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await ApiClient.reportSuspicious({
        batchId: batchId.trim() || undefined,
        serial: serial.trim() || undefined,
        reason: reason.trim(),
        location: location.trim() || undefined,
        contactEmail: email.trim() || undefined,
      });

      setSuccessId(res.reportId || 'ALERT-RECORDED');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessId(null);
    setReason('');
    setLocation('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl border border-rose-500/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-semibold text-white">
              {t.reportCounterfeit}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successId ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Adverse Report Logged</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Your report has been encrypted and routed directly to health authorities and regulatory enforcement.
              </p>
              <div className="mt-3 inline-block font-mono text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                Tracking ID: {successId}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">{t.batchId} (Optional)</label>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="e.g. ACT-500"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Serial Number (Optional)</label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="e.g. RX-2026-..."
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Purchase Location or Pharmacy Name
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. St. Jude Dispensary, Lagos"
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold text-rose-300">
                Reason / Suspicious Symptoms *
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe tampered packaging, unusual pill discoloration, missing hologram, or adverse patient reaction..."
                className="w-full px-3 py-2 rounded-xl glass-input resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Your Contact Email (Optional for followup)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigation-followup@example.com"
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
            </div>

            {error && (
              <p className="text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-alert transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Routing...' : 'Submit Alert to Regulator'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
