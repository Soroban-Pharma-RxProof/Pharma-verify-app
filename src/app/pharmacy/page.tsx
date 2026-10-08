'use client';

import React, { useEffect, useState } from 'react';
import { Store, Flame, Pill, Search, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { BatchMetadata } from '../../types';
import { ApiClient } from '../../lib/api-client';

export default function PharmacyPage() {
  const { t } = useLanguage();
  const { session, connectWallet } = useWallet();

  const [batches, setBatches] = useState<BatchMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dispense modal states
  const [activeBatch, setActiveBatch] = useState<BatchMetadata | null>(null);
  const [dispenseMode, setDispenseMode] = useState<'FULL' | 'PARTIAL'>('FULL');
  const [serialInput, setSerialInput] = useState('');
  const [selectedStripIndex, setSelectedStripIndex] = useState<number>(0);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispenseSuccess, setDispenseSuccess] = useState<string | null>(null);
  const [dispenseError, setDispenseError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getBatches(session.token);
      setBatches(data);
    } catch {
      // Mock fallback inventory for testing/demo
      setBatches([
        {
          batchId: 'ACT-500-2026-B1',
          productName: 'Artemether-Lumefantrine 20/120mg',
          dosage: '24 Tablets',
          totalQuantity: 500,
          totalStrips: 2,
          unitsPerStrip: 12,
          expiryTimestamp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
          merkleRoot: '5d69fa1...merkle',
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [session.token]);

  const filteredBatches = batches.filter(
    (b) =>
      b.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
      {/* Role Banner / Auth Guard */}
      {session.role !== 'PHARMACY' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Connected as <span className="font-semibold">{session.role}</span>. Connect an authorized Pharmacy Stellar wallet to execute on-chain serial burn transactions.
            </span>
          </div>
          <button
            onClick={connectWallet}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-semibold text-amber-300 transition-colors"
          >
            Switch Wallet
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Point of Care Dispensary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t.pharmacyPortal}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage medicine stock in current custody and burn pack serials on-chain upon patient dispensing.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Batch ID or Medicine Name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBatches.map((batch) => (
          <div
            key={batch.batchId}
            className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {batch.batchId}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {batch.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2.5">
                {batch.productName || batch.brandName || 'Medicine Batch'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {batch.dosage || batch.dosageForm || 'Standard Pack'}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>
                  <span className="block text-slate-500">Strips / Pack:</span>
                  <span className="text-slate-200 font-medium">{batch.totalStrips || 2} Strips</span>
                </div>
                <div>
                  <span className="block text-slate-500">Units / Strip:</span>
                  <span className="text-slate-200 font-medium">{batch.unitsPerStrip || 10} Tabs</span>
                </div>
              </div>
            </div>

            {/* Dispense Actions */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveBatch(batch);
                  setDispenseMode('FULL');
                  setDispenseSuccess(null);
                  setDispenseError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Burn Pack</span>
              </button>

              <button
                onClick={() => {
                  setActiveBatch(batch);
                  setDispenseMode('PARTIAL');
                  setDispenseSuccess(null);
                  setDispenseError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
              >
                <Pill className="w-3.5 h-3.5 text-emerald-400" />
                <span>Partial Strip</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
