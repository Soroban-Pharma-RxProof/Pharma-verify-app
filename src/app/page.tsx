'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, History, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { QrScanner } from '../components/QrScanner';
import { ManualEntryModal } from '../components/ManualEntryModal';
import { AuthenticCard } from '../components/cards/AuthenticCard';
import { ExpiredCard } from '../components/cards/ExpiredCard';
import { RecalledCard } from '../components/cards/RecalledCard';
import { SuspiciousCard } from '../components/cards/SuspiciousCard';
import { BlisterVisualizer } from '../components/cards/BlisterVisualizer';
import { ScanHistoryDrawer } from '../components/ScanHistoryDrawer';
import { ReportModal } from '../components/ReportModal';
import { VerificationResult } from '../types';
import { ApiClient } from '../lib/api-client';
import { OfflineStorage } from '../lib/offline-storage';
import { ClientCrypto } from '../lib/crypto';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [reportContext, setReportContext] = useState<{ batchId?: string; serial?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (batchId: string, serial: string) => {
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      let result: VerificationResult;

      if (typeof window !== 'undefined' && !navigator.onLine) {
        // Offline verification fallback
        OfflineStorage.queuePendingScan(batchId, serial);
        const serialHash = await ClientCrypto.sha256Hex(serial);

        result = {
          status: 'OFFLINE_PENDING',
          message: 'Saved to offline synchronization queue. Validation pending network reconnect.',
          batch: {
            batchId,
            totalQuantity: 0,
            expiryTimestamp: 0,
            merkleRoot: '',
            status: 'OFFLINE_CACHED',
          },
          pack: {
            serialHash,
            serial,
            isDispensed: false,
            stripsDispensedBitmask: 0,
          },
        };
      } else {
        result = await ApiClient.verifyPack(batchId, serial);
      }

      setVerificationResult(result);

      // Persist to local scan history
      OfflineStorage.saveScanHistory({
        timestamp: new Date().toISOString(),
        batchId,
        serial,
        serialHash: result.pack?.serialHash || serial,
        status: result.status,
        offline: !navigator.onLine,
      });
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReport = (bId?: string, sId?: string) => {
    setReportContext({ batchId: bId, serial: sId });
    setIsReportOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start px-4 py-8 sm:py-12 max-w-5xl mx-auto w-full">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Stellar Blockchain Consensus</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.verifyMedicine}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {t.tagline}
        </p>

        {/* Action icons bar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan History</span>
          </button>
          <button
            onClick={() => handleOpenReport()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Counterfeit</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="w-full max-w-md mx-auto mb-8">
        <QrScanner
          onScan={handleVerify}
          onOpenManualEntry={() => setIsManualOpen(true)}
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="w-full max-w-md p-6 glass-panel rounded-3xl border border-slate-800 text-center space-y-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-300">
            Querying Soroban contract & verifying cryptographic Merkle proof...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="w-full max-w-md p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-xs text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Verification Error</span>
            <p className="text-slate-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {verificationResult && (
        <div className="w-full max-w-xl mx-auto space-y-4">
          {verificationResult.status === 'AUTHENTIC' && (
            <>
              <AuthenticCard
                result={verificationResult}
                onViewJourney={() =>
                  router.push(`/journey/${verificationResult.batch?.batchId}`)
                }
              />
              <BlisterVisualizer
                totalStrips={verificationResult.batch?.totalStrips || verificationResult.batch?.stripsPerPack || 2}
                unitsPerStrip={verificationResult.batch?.unitsPerStrip || 10}
                dispensedBitmask={verificationResult.pack?.stripsDispensedBitmask || 0}
              />
            </>
          )}

          {verificationResult.status === 'EXPIRED' && (
            <ExpiredCard
              result={verificationResult}
              onReport={() =>
                handleOpenReport(
                  verificationResult.batch?.batchId,
                  verificationResult.pack?.serial
                )
              }
            />
          )}

          {verificationResult.status === 'RECALLED' && (
            <RecalledCard
              result={verificationResult}
              onReport={() =>
                handleOpenReport(
                  verificationResult.batch?.batchId,
                  verificationResult.pack?.serial
                )
              }
            />
          )}

          {(verificationResult.status === 'SUSPICIOUS_CLONED' ||
            verificationResult.status.startsWith('SUSPICIOUS_')) && (
            <SuspiciousCard
              result={verificationResult}
              onReport={() =>
                handleOpenReport(
                  verificationResult.batch?.batchId,
                  verificationResult.pack?.serial
                )
              }
            />
          )}
        </div>
      )}

      {/* Modals & Drawers */}
      <ManualEntryModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onSubmit={handleVerify}
      />

      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectScan={handleVerify}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        initialBatchId={reportContext.batchId}
        initialSerial={reportContext.serial}
      />
    </div>
  );
}
