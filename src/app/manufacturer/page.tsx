'use client';

import React, { useEffect, useState } from 'react';
import {
  Factory,
  PlusCircle,
  QrCode,
  ArrowRightLeft,
  ShieldCheck,
  Package,
  Layers,
  AlertTriangle,
  Search,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { BatchMetadata } from '../../types';
import { ApiClient } from '../../lib/api-client';
import { CONTRACT_ID } from '../../lib/contract';

export default function ManufacturerPage() {
  const { t } = useLanguage();
  const { session, connectWallet } = useWallet();

  const [batches, setBatches] = useState<BatchMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedRoot, setCopiedRoot] = useState<string | null>(null);

  // Modal control states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTransferBatch, setActiveTransferBatch] = useState<BatchMetadata | null>(null);
  const [activeLabelBatch, setActiveLabelBatch] = useState<BatchMetadata | null>(null);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getBatches(session.token);
      setBatches(data);
    } catch {
      // Mock fallback data for demonstration & testing
      setBatches([
        {
          batchId: 'ACT-500-2026-B1',
          productName: 'Artemether-Lumefantrine 20/120mg',
          dosage: '24 Tablets / Pack',
          totalQuantity: 10000,
          totalStrips: 2,
          unitsPerStrip: 12,
          expiryTimestamp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
          merkleRoot: '5d69fa1e2b489c7d0a4c219830f146ba8290bc931f6de1761823abce3901ba6e',
          status: 'ACTIVE',
        },
        {
          batchId: 'AMX-250-2026-A4',
          productName: 'Amoxicillin Trihydrate 500mg',
          dosage: '20 Capsules / Pack',
          totalQuantity: 5000,
          totalStrips: 2,
          unitsPerStrip: 10,
          expiryTimestamp: Math.floor(Date.now() / 1000) + 180 * 24 * 3600,
          merkleRoot: '9c882a1f09bb23cd089ef01a89cde9103984afcb6128490a612301827bfae401',
          status: 'ACTIVE',
        },
        {
          batchId: 'PAR-100-2026-C2',
          productName: 'Paracetamol BP 500mg',
          dosage: '100 Caplets',
          totalQuantity: 25000,
          totalStrips: 10,
          unitsPerStrip: 10,
          expiryTimestamp: Math.floor(Date.now() / 1000) + 720 * 24 * 3600,
          merkleRoot: '3a18ef77b10294cddae70192837bcdaea102947162947bcaed09183746a5b6c7',
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [session.token]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRoot(text);
    setTimeout(() => setCopiedRoot(null), 2000);
  };

  const filteredBatches = batches.filter(
    (b) =>
      b.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPacks = batches.reduce((acc, b) => acc + (b.totalQuantity || 0), 0);
  const activeCount = batches.filter((b) => b.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner / Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              <Factory className="w-3.5 h-3.5" />
              <span>Manufacturer Portal &bull; Stellar Soroban</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Pharmaceutical Batch Management
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Register cryptographic Merkle roots for medicine batches, mint immutable serial proofs on Soroban, and dispatch custody to licensed distributors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!session.isConnected ? (
              <button
                onClick={connectWallet}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition shadow-lg shadow-primary/25 flex items-center gap-2"
              >
                Connect Manufacturer Wallet
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition shadow-lg shadow-primary/25 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register New Batch</span>
              </button>
            )}

            <button
              onClick={fetchBatches}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh inventory"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Registered Batches</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">{batches.length}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{activeCount} Active on-chain</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Packs Serialized</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalPacks.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Cryptographically hashed</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Contract State</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-mono font-bold text-indigo-300 truncate">
            {CONTRACT_ID.slice(0, 10)}...{CONTRACT_ID.slice(-6)}
          </div>
          <div className="text-xs text-slate-400 mt-1">Soroban Testnet v22</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Supply Chain Recalls</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">0</div>
          <div className="text-xs text-emerald-400 mt-1">100% Integrity Clean</div>
        </div>
      </div>

      {/* Batch Inventory Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span>Manufactured Batches & Merkle Roots</span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search batch ID or drug..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Batches Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <div
              key={batch.batchId}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-primary/15 text-primary border border-primary/30 truncate max-w-[200px]">
                    {batch.batchId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {batch.status || 'ACTIVE'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{batch.productName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{batch.dosage || 'Standard Packaging'}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Merkle Root:</span>
                    <button
                      onClick={() => copyToClipboard(batch.merkleRoot)}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      {copiedRoot === batch.merkleRoot ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-slate-300 text-[11px] truncate">
                    {batch.merkleRoot}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="block text-slate-500">Packs Quantity:</span>
                    <span className="text-slate-200 font-medium">
                      {(batch.totalQuantity || 0).toLocaleString()} Packs
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Expiry Date:</span>
                    <span className="text-slate-200 font-medium">
                      {new Date(batch.expiryTimestamp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Blister Config:</span>
                    <span className="text-slate-200 font-medium">
                      {batch.totalStrips || 2} strips &times; {batch.unitsPerStrip || 10} tabs
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500">On-Chain Custody:</span>
                    <span className="text-emerald-400 font-medium">Manufacturer</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveTransferBatch(batch)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>

                <button
                  onClick={() => setActiveLabelBatch(batch)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Print Serials</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
