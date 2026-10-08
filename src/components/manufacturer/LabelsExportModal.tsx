'use client';

import React, { useState } from 'react';
import { BatchMetadata } from '../../types';
import { QrCode, Printer, Download, Copy, Check, FileText } from 'lucide-react';

interface LabelsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch?: BatchMetadata | null;
}

export const LabelsExportModal: React.FC<LabelsExportModalProps> = ({
  isOpen,
  onClose,
  batch,
}) => {
  const [format, setFormat] = useState<'GS1' | 'BLISTER' | 'CARTON'>('GS1');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen || !batch) return null;

  // Generate 12 sample serials for this batch for preview and label generation
  const serialItems = Array.from({ length: 12 }).map((_, i) => {
    const serial = `SN-${batch.batchId}-${(i + 1).toString().padStart(6, '0')}`;
    const qrUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/?batchId=${encodeURIComponent(batch.batchId)}&serial=${encodeURIComponent(serial)}`
      : `https://rxproof.stellar.org/?batchId=${batch.batchId}&serial=${serial}`;
    return {
      index: i + 1,
      serial,
      qrUrl,
      mfgDate: '2026-03-01',
      expDate: new Date(batch.expiryTimestamp * 1000).toISOString().split('T')[0],
    };
  });

  const handleDownloadCSV = () => {
    const headers = 'BatchID,SerialNumber,ExpiryDate,VerificationURL\n';
    const rows = serialItems
      .map((item) => `"${batch.batchId}","${item.serial}","${item.expDate}","${item.qrUrl}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labels_${batch.batchId}_serials.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const data = {
      batchId: batch.batchId,
      productName: batch.productName,
      merkleRoot: batch.merkleRoot,
      serials: serialItems.map((item) => ({
        serial: item.serial,
        verificationUrl: item.qrUrl,
        expiryDate: item.expDate,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packaging_manifest_${batch.batchId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Packaging Labels &amp; 2D DataMatrix</h3>
              <p className="text-xs text-slate-400">
                Batch: <span className="font-mono text-white">{batch.batchId}</span> &bull; {batch.productName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-primary/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Labels</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-3 mb-6 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">Label Dimension:</span>
          <div className="flex gap-2">
            {[
              { id: 'GS1', label: 'GS1 DataMatrix (Carton 40x20mm)' },
              { id: 'BLISTER', label: 'Blister Foil Stamp (25x15mm)' },
              { id: 'CARTON', label: 'Shipper Outer Case (100x50mm)' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setFormat(fmt.id as any)}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  format === fmt.id
                    ? 'bg-primary/20 border-primary text-primary font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Printable Label Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
          {serialItems.map((item, idx) => (
            <div
              key={item.serial}
              className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    RxProof Authenticated
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 truncate max-w-[140px]">
                    {batch.productName}
                  </div>
                </div>

                {/* Simulated GS1 2D DataMatrix barcode pattern */}
                <div className="w-12 h-12 bg-slate-950 p-1 rounded border border-slate-300 flex items-center justify-center shrink-0">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${(idx * 7 + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'} rounded-[1px]`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1 font-mono text-[10px] bg-slate-100 p-2 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>(01) GTIN:</span>
                  <span className="font-bold text-slate-900">07680459201948</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>(17) EXP:</span>
                  <span className="font-bold text-slate-900">{item.expDate}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>(10) LOT:</span>
                  <span className="font-bold text-slate-900">{batch.batchId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>(21) SN:</span>
                  <span className="font-bold text-primary truncate max-w-[110px]">{item.serial}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-200">
                <span>Stellar Soroban Verified</span>
                <span>#{item.index} of 100</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Exporting sample pack barcodes for factory stamping and blister sealing.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelsExportModal;
