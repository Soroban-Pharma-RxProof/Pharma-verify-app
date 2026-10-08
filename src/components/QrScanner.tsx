'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, FlipHorizontal, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface QrScannerProps {
  onScan: (batchId: string, serial: string) => void;
  onOpenManualEntry: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onOpenManualEntry }) => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const scannerRef = useRef<any>(null);

  const startScanner = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Stop previous instance if existing
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // ignore
        }
      }

      const html5QrCode = new Html5Qrcode('qr-reader-viewport');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode },
        {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          handleDecodedText(decodedText);
        },
        () => {
          // Frame scan failure is normal when no QR code in view
        }
      );
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      setCameraError('Camera access unavailable. Please enable permissions or enter serial manually.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleDecodedText = (text: string) => {
    stopScanner();

    let batchId = '';
    let serial = '';

    try {
      // 1. Try parsing JSON payload: {"b":"BATCH-ID","s":"SERIAL-NUMBER"}
      const parsed = JSON.parse(text);
      if (parsed.b && (parsed.s || parsed.h)) {
        batchId = parsed.b;
        serial = parsed.s || parsed.h;
        onScan(batchId, serial);
        return;
      }
    } catch {
      // 2. Try parsing URL params: https://.../verify?batch=...&serial=...
      try {
        const url = new URL(text);
        const b = url.searchParams.get('batch') || url.searchParams.get('b');
        const s = url.searchParams.get('serial') || url.searchParams.get('s');
        if (b && s) {
          onScan(b, s);
          return;
        }
      } catch {
        // 3. Fallback raw text parsing
      }
    }

    // Default heuristic for hyphenated raw format: BATCH/SERIAL
    if (text.includes('/')) {
      const parts = text.split('/');
      batchId = parts[0];
      serial = parts[1];
    } else {
      serial = text;
    }

    onScan(batchId, serial);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const toggleCamera = async () => {
    await stopScanner();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-center p-4">
        {/* HTML5 QR Code Mount Div */}
        <div id="qr-reader-viewport" className="w-full h-full rounded-2xl overflow-hidden" />

        {/* Viewfinder Overlay Reticle */}
        {isScanning ? (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-emerald-400/60 rounded-2xl">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

              {/* Scanning Laser Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-glow animate-pulse top-1/2 relative" />
            </div>
            <p className="mt-4 text-xs font-medium text-emerald-400 bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Align medicine QR code within frame
            </p>
          </div>
        ) : (
          <div className="text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{t.scanQrCode}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Scan the 2D DataMatrix or QR code on the packaging blister or carton
              </p>
            </div>
            {cameraError && (
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
            <button
              onClick={startScanner}
              className="px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-glow hover:opacity-95 transition-all"
            >
              Start Camera Scanner
            </button>
          </div>
        )}

        {/* Camera Control Buttons */}
        {isScanning && (
          <div className="absolute bottom-4 flex items-center space-x-3 z-10">
            <button
              onClick={toggleCamera}
              className="p-2.5 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800 transition-colors"
              title="Flip Camera"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={stopScanner}
              className="p-2.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
              title="Stop Camera"
            >
              <CameraOff className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Manual Entry Fallback Link */}
      <button
        onClick={onOpenManualEntry}
        className="mt-4 text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
      >
        <span>{t.enterSerialManually}</span>
        <span className="text-emerald-500 font-bold">→</span>
      </button>
    </div>
  );
};
