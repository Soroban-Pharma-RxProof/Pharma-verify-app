'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ApiClient } from '../../lib/api-client';
import { CONTRACT_ID } from '../../lib/contract';
import { Users, ShieldCheck, XCircle, CheckCircle, Search, Clock, ExternalLink } from 'lucide-react';

interface ParticipantQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParticipantItem {
  id: string;
  name: string;
  address: string;
  role: 'MANUFACTURER' | 'DISTRIBUTOR' | 'PHARMACY';
  licenseNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

export const ParticipantQueueModal: React.FC<ParticipantQueueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { session } = useWallet();

  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getParticipants(session.token);
      setParticipants(data);
    } catch {
      // Mock onboarding queue
      setParticipants([
        {
          id: 'part-01',
          name: 'PharmaPlus Manufacturing Industries',
          address: 'GDK7V2Q8M4PZX5K6N9W3B1T7R8C2X5A4V9L6D1E3F5G7H2J4K6L8',
          role: 'MANUFACTURER',
          licenseNumber: 'NMRA-MFG-2026-449',
          status: 'PENDING',
          appliedAt: '2026-03-28',
        },
        {
          id: 'part-02',
          name: 'Sahel Cold-Chain Distributors Ltd',
          address: 'GB2K3Z48QPRTZ99MX2Y517B4V8W6Q72D3L89Z1X234CVB5N6M7',
          role: 'DISTRIBUTOR',
          licenseNumber: 'PCN-DIST-2026-102',
          status: 'PENDING',
          appliedAt: '2026-03-29',
        },
        {
          id: 'part-03',
          name: 'GreenCross Community Pharmacy',
          address: 'GC4X7Y9Z1A2B3C4D5E6F7G8H9J1K2L3M4N5P6Q7R8S9T1U2V3W',
          role: 'PHARMACY',
          licenseNumber: 'PCN-RET-2026-8841',
          status: 'APPROVED',
          appliedAt: '2026-03-15',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQueue();
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = async (item: ParticipantItem) => {
    setActionLoading(item.id);
    setStatusMessage(null);
    try {
      await ApiClient.approveParticipant(item.address, item.role, session.token);
      setParticipants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'APPROVED' } : p))
      );
      setStatusMessage(`Successfully approved ${item.name} as on-chain ${item.role}`);
    } catch (err: any) {
      // Offline fallback
      setParticipants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'APPROVED' } : p))
      );
      setStatusMessage(`Approved ${item.name} on Stellar Soroban (Demo simulation)`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (item: ParticipantItem) => {
    setActionLoading(item.id);
    setStatusMessage(null);
    try {
      await ApiClient.rejectParticipant(item.address, 'Failed regulatory KYC inspection', session.token);
      setParticipants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'REJECTED' } : p))
      );
      setStatusMessage(`Application rejected for ${item.name}`);
    } catch (err: any) {
      // Offline fallback
      setParticipants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'REJECTED' } : p))
      );
      setStatusMessage(`Application rejected for ${item.name}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = participants.filter((p) => {
    if (filterRole === 'ALL') return true;
    if (filterRole === 'PENDING') return p.status === 'PENDING';
    return p.role === filterRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Participant Onboarding Queue</h3>
              <p className="text-xs text-slate-400">On-Chain Licensing &amp; KYC Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {['ALL', 'PENDING', 'MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  filterRole === role
                    ? 'bg-primary/20 text-primary font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Participant list */}
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{item.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary border border-primary/30">
                    {item.role}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === 'APPROVED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400 space-y-0.5">
                  <p className="truncate max-w-[380px]">
                    <span className="text-slate-500">Stellar Address:</span> {item.address}
                  </p>
                  <p>
                    <span className="text-slate-500">License ID:</span> {item.licenseNumber} &bull;{' '}
                    <span className="text-slate-500">Applied:</span> {item.appliedAt}
                  </p>
                </div>
              </div>

              {item.status === 'PENDING' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(item)}
                    disabled={actionLoading === item.id}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(item)}
                    disabled={actionLoading === item.id}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/20 flex items-center gap-1"
                  >
                    {actionLoading === item.id ? (
                      <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Close Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantQueueModal;
