'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Truck, Building, Store, ExternalLink, Calendar, Hash } from 'lucide-react';
import { ApiClient } from '../../../lib/api-client';

interface CustodyRecord {
  from: string;
  to: string;
  txHash: string;
  timestamp: string;
}

export default function BatchJourneyPage() {
  const params = useParams();
  const batchId = params?.batchId as string;

  const [batchData, setBatchData] = useState<any>(null);
  const [custodyHistory, setCustodyHistory] = useState<CustodyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) return;

    const fetchJourney = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ApiClient.getBatchJourney(batchId);
        setBatchData(data);
        setCustodyHistory(data.custodyHistory || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch batch journey');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourney();
  }, [batchId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-emerald-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Verifier</span>
      </Link>

      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Immutable Chain of Custody</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {batchData?.productName || `Batch ${batchId}`}
            </h1>
            <p className="text-xs font-mono text-emerald-400 mt-1">
              Batch Identifier: {batchId}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-slate-400 block">Current Legal Custodian</span>
            <span className="font-mono text-xs font-semibold text-slate-200 block truncate max-w-xs">
              {batchData?.currentCustodian || 'Licensed Pharmacy Network'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="p-12 text-center text-slate-400 text-xs space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
          <p>Tracing custody path across Stellar ledger...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Timeline Steps */}
      {!isLoading && !error && (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/30 space-y-8 my-6">
          {/* Step 1: Manufacturing Registration */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-glow">
              <Building className="w-4 h-4" />
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Step 1: Production & Merkle Root Anchoring
                </span>
                <span className="text-[10px] text-slate-400">Manufacturer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Medicine produced under GMP compliance. Pack serials cryptographically hashed into a sorted-pair Merkle tree root anchored on Stellar Testnet.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>Origin Account: {batchData?.manufacturerAddress || 'GAKD...99AA'}</span>
              </div>
            </div>
          </div>

          {/* Step 2+: Intermediate Custody Handoffs */}
          {custodyHistory.map((custody, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-glow">
                <Truck className="w-4 h-4" />
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Step {idx + 2}: Chain-of-Custody Handover
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(custody.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">From Custodian</span>
                    <span className="text-slate-300 truncate block">{custody.from}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">To Custodian</span>
                    <span className="text-emerald-400 truncate block">{custody.to}</span>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Ledger Verification:</span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${custody.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                  >
                    <span>{custody.txHash.slice(0, 12)}...</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Final Step: Pharmacy Point of Care */}
          <div className="relative group">
            <div className="absolute -left-[35px] sm:-left-[43px] top-0.5 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-glow">
              <Store className="w-4 h-4" />
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Final Destination: Dispensing Pharmacy
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready for Patient
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pack is physically located at the authorized dispensary. When handed to the patient, the pharmacy burns the pack serial hash on-chain to prevent clone reproduction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
