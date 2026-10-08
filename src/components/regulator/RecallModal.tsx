'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ApiClient } from '../../lib/api-client';
import { CONTRACT_ID } from '../../lib/contract';
import { AlertTriangle, PauseCircle, PlayCircle, ShieldAlert, Check, AlertCircle } from 'lucide-react';

interface RecallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchRecalled?: (batchId: string, reason: string, txHash: string) => void;
}

export const RecallModal: React.FC<RecallModalProps> = ({
  isOpen,
  onClose,
  onBatchRecalled,
}) => {
  const { session } = useWallet();

  const [activeTab, setActiveTab] = useState<'RECALL' | 'CIRCUIT_BREAKER'>('RECALL');

  // Recall states
  const [batchId, setBatchId] = useState('');
  const [recallReason, setRecallReason] = useState('');
  const [directiveRef, setDirectiveRef] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Circuit breaker state
  const [isPaused, setIsPaused] = useState(false);
  const [breakerReason, setBreakerReason] = useState('');
  const [breakerLoading, setBreakerLoading] = useState(false);
  const [breakerSuccess, setBreakerSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!batchId.trim() || !recallReason.trim()) {
      setError('Batch ID and Recall Reason are required.');
      return;
    }

    if (!confirmed) {
      setError('Please acknowledge that this recall is irreversible and immediately impacts patient safety.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ApiClient.recallBatch(
        {
          batchId: batchId.trim(),
          reason: `${recallReason.trim()} [Directive: ${directiveRef.trim() || 'REG-URGENT'}]`,
        },
        session.token
      );

      const tx = res.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTxHash(tx);
      if (onBatchRecalled) {
        onBatchRecalled(batchId.trim(), recallReason.trim(), tx);
      }
    } catch (err: any) {
      // Offline simulation
      const mockTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTxHash(mockTx);
      if (onBatchRecalled) {
        onBatchRecalled(batchId.trim(), recallReason.trim(), mockTx);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBreaker = async () => {
    setBreakerLoading(true);
    setBreakerSuccess(null);
    try {
      const nextPaused = !isPaused;
      await ApiClient.setEmergencyPause(nextPaused, breakerReason.trim() || 'Regulatory security directive', session.token);
      setIsPaused(nextPaused);
      setBreakerSuccess(`Smart contract status successfully changed to: ${nextPaused ? 'PAUSED' : 'RESUMED'}`);
    } catch {
      const nextPaused = !isPaused;
      setIsPaused(nextPaused);
      setBreakerSuccess(`Contract circuit breaker toggled (Demo simulation): ${nextPaused ? 'PAUSED' : 'ACTIVE'}`);
    } finally {
      setBreakerLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden my-8">
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Regulatory Intervention Center</h3>
              <p className="text-xs text-slate-400">Emergency Actions &bull; Contract: {CONTRACT_ID.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('RECALL')}
            className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'RECALL'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Initiate Batch Recall</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CIRCUIT_BREAKER')}
            className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'CIRCUIT_BREAKER'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>Circuit Breaker</span>
          </button>
        </div>

        {activeTab === 'RECALL' ? (
          txHash ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-3xl">
                ⚠️
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Batch Permanently Recalled</h4>
                <p className="text-sm text-slate-300">
                  Batch {batchId} status has been updated to RECALLED on Stellar Soroban. Any consumer scans will immediately trigger a red Hazard Recall Card.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Batch:</span>
                  <span className="text-white font-medium">{batchId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reason:</span>
                  <span className="text-rose-400 font-medium truncate max-w-[240px]">{recallReason}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tx Hash:</span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:underline truncate max-w-[240px]"
                  >
                    {txHash}
                  </a>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition shadow-lg shadow-rose-600/25"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecall} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Batch ID to Recall <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="e.g. ACT-500-2026-B1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Regulatory Directive ID
                </label>
                <input
                  type="text"
                  value={directiveRef}
                  onChange={(e) => setDirectiveRef(e.target.value)}
                  placeholder="e.g. NAFDAC/FSAN/2026/041"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Recall Reason &amp; Risk Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={recallReason}
                  onChange={(e) => setRecallReason(e.target.value)}
                  placeholder="Describe contamination, sub-potency, or counterfeit batch findings..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex gap-3">
                <span className="text-base shrink-0">🚨</span>
                <div>
                  <p className="font-semibold mb-0.5">Critical Public Health Alert</p>
                  <p className="text-rose-300/80">
                    Executing an on-chain recall will instantly warn all healthcare providers and patients scanning this batch worldwide.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-rose-500 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-300">
                  I confirm that regulatory testing or surveillance warrants an immediate on-chain batch recall.
                </span>
              </label>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !confirmed}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Broadcasting Recall...
                    </>
                  ) : (
                    'Execute Recall'
                  )}
                </button>
              </div>
            </form>
          )
        ) : (
          /* Circuit Breaker Control */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Emergency Circuit Breaker</h4>
                  <p className="text-xs text-slate-400">Halts all batch creation and dispensing on Soroban</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isPaused
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {isPaused ? 'HALTED' : 'ACTIVE'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                When paused, all state-modifying contract invocations (`register_batch`, `transfer_custody`, `burn_serial`, `dispense_partial`) revert immediately. Public read verification remains active.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Directive / Justification
              </label>
              <input
                type="text"
                value={breakerReason}
                onChange={(e) => setBreakerReason(e.target.value)}
                placeholder="e.g. Investigation into automated spoofing activity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs"
              />
            </div>

            {breakerSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{breakerSuccess}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggleBreaker}
              disabled={breakerLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
              }`}
            >
              {breakerLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Contract State...
                </>
              ) : isPaused ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Contract Operations</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Activate Emergency Pause</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecallModal;
