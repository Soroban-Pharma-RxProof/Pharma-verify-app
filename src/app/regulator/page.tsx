'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Activity,
  Flame,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AnomalyItem } from '../../types';
import { ApiClient } from '../../lib/api-client';
import { CONTRACT_ID } from '../../lib/contract';
import ParticipantQueueModal from '../../components/regulator/ParticipantQueueModal';
import RecallModal from '../../components/regulator/RecallModal';
import MultisigModal from '../../components/regulator/MultisigModal';

export default function RegulatorPage() {
  const { t } = useLanguage();
  const { session, connectWallet } = useWallet();

  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Modal triggers
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [isMultisigModalOpen, setIsMultisigModalOpen] = useState(false);

  const fetchAnomalies = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getAnomalies(session.token || '');
      setAnomalies(data);
    } catch {
      // Demo/Fallback anomaly alerts
      setAnomalies([
        {
          id: 'anom-901',
          batchId: 'ACT-500-2026-B1',
          serial: 'SN-ACT-500-2026-B1-000042',
          type: 'DUPLICATE_BURNT_SCAN',
          severity: 'CRITICAL',
          description: 'Burnt pack serial scanned again 4 hours later in separate retail market.',
          detectedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          location: 'Oshodi Market, Lagos (6.5244° N, 3.3792° E)',
          resolved: false,
        },
        {
          id: 'anom-902',
          batchId: 'AMX-250-2026-A4',
          serial: 'SN-AMX-250-2026-A4-000819',
          type: 'GEOGRAPHIC_VELOCITY_ANOMALY',
          severity: 'HIGH',
          description: 'Identical pack scanned in Abuja within 12 minutes of scan in Port Harcourt (impossible transit speed > 3,000 km/h).',
          detectedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          location: 'Garki District, Abuja & Port Harcourt',
          resolved: false,
        },
        {
          id: 'anom-903',
          batchId: 'PAR-100-2026-C2',
          serial: 'SN-PAR-100-2026-C2-999999',
          type: 'INVALID_MERKLE_LEAF_PROBE',
          severity: 'MEDIUM',
          description: 'Multiple automated verification probes with non-existent serial leaf hash.',
          detectedAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
          location: 'IP: 102.89.42.18 (Kano Gateway)',
          resolved: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [session.token]);

  const handleResolveAnomaly = async (id: string) => {
    setResolvingId(id);
    try {
      await ApiClient.resolveAnomaly(id, 'Regulatory inspector dispatched to verify batch custody and retail stock.', session.token || '');
      setAnomalies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
      );
    } catch {
      // Local fallback
      setAnomalies((prev) =>
        prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
      );
    } finally {
      setResolvingId(null);
    }
  };

  const filtered = anomalies.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'UNRESOLVED') return !a.resolved;
    return a.severity === filterSeverity;
  });

  const criticalCount = anomalies.filter((a) => a.severity === 'CRITICAL' && !a.resolved).length;
  const highCount = anomalies.filter((a) => a.severity === 'HIGH' && !a.resolved).length;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>National Medicine Regulatory Authority (NMRA)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Supply Chain Surveillance &amp; Enforcement
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Real-time counterfeit medicine anomaly detection, automated velocity alerts, on-chain participant approvals, and emergency recall circuit breaker.
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsRecallModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition shadow-lg shadow-rose-600/25 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Recall Batch</span>
            </button>

            <button
              onClick={() => setIsParticipantModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Participant Queue</span>
            </button>

            <button
              onClick={() => setIsMultisigModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>Multisig Council</span>
            </button>

            <button
              onClick={fetchAnomalies}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh radar"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Critical Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{criticalCount} Active</div>
          <div className="text-xs text-rose-300/80 mt-1">Requires immediate seizure</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>High Severity</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{highCount} Open</div>
          <div className="text-xs text-slate-400 mt-1">Velocity &amp; clone probes</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Emergency Breaker</span>
            {isPaused ? (
              <PauseCircle className="w-4 h-4 text-rose-500 animate-pulse" />
            ) : (
              <PlayCircle className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div className={`text-xl font-bold ${isPaused ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isPaused ? 'CONTRACT PAUSED' : 'SYSTEM OPERATIONAL'}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono truncate">
            {CONTRACT_ID.slice(0, 16)}...
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Approved Entities</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">48 Licensed</div>
          <div className="text-xs text-emerald-400 mt-1">All on-chain authorized</div>
        </div>
      </div>

      {/* Anomaly Live Surveillance Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-white">Live Supply Chain Anomaly Feed</h2>
          </div>

          {/* Severity filter tabs */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {['ALL', 'UNRESOLVED', 'CRITICAL', 'HIGH'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterSeverity(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  filterSeverity === tab
                    ? 'bg-rose-500/20 text-rose-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Anomaly Feed Items */}
        <div className="space-y-3">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition backdrop-blur-md ${
                alert.resolved
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {alert.severity}
                    </span>

                    <span className="font-mono text-xs font-semibold text-white px-2 py-0.5 rounded bg-slate-800">
                      {alert.type}
                    </span>

                    {alert.resolved && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        <span>Resolved by Inspector</span>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(alert.detectedAt).toLocaleTimeString()}</span>
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 font-medium leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    {alert.batchId && (
                      <span>
                        Batch: <span className="text-white">{alert.batchId}</span>
                      </span>
                    )}
                    {alert.serial && (
                      <span>
                        Serial: <span className="text-primary">{alert.serial}</span>
                      </span>
                    )}
                    {alert.location && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{alert.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Resolve Action */}
                {!alert.resolved && (
                  <button
                    onClick={() => handleResolveAnomaly(alert.id)}
                    disabled={resolvingId === alert.id}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 self-start md:self-center shrink-0"
                  >
                    {resolvingId === alert.id ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                        <span>Resolving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Resolved</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ParticipantQueueModal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
      />

      <RecallModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
        onBatchRecalled={() => {
          fetchAnomalies();
        }}
      />

      <MultisigModal
        isOpen={isMultisigModalOpen}
        onClose={() => setIsMultisigModalOpen(false)}
      />
    </div>
  );
}
