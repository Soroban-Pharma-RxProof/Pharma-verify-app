'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { CONTRACT_ID } from '../../lib/contract';
import { Users, ShieldAlert, Vote, Check, AlertCircle, PlusCircle, CheckCircle } from 'lucide-react';

interface MultisigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProposalItem {
  id: string;
  type: 'REMOVE_REGULATOR' | 'ADD_REGULATOR';
  targetAddress: string;
  reason: string;
  votes: string[];
  threshold: number;
  totalMembers: number;
  status: 'ACTIVE' | 'PASSED' | 'EXECUTED';
  createdAt: string;
}

export const MultisigModal: React.FC<MultisigModalProps> = ({ isOpen, onClose }) => {
  const { session } = useWallet();

  const [activeTab, setActiveTab] = useState<'PROPOSALS' | 'CREATE'>('PROPOSALS');
  const [votingId, setVotingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Proposal Creation state
  const [targetAddress, setTargetAddress] = useState('');
  const [propType, setPropType] = useState<'REMOVE_REGULATOR' | 'ADD_REGULATOR'>('REMOVE_REGULATOR');
  const [proposalReason, setProposalReason] = useState('');

  const [proposals, setProposals] = useState<ProposalItem[]>([
    {
      id: 'PROP-REG-2026-001',
      type: 'REMOVE_REGULATOR',
      targetAddress: 'GA2K3Z48QPRTZ99MX2Y517B4V8W6Q72D3L89Z1X234CVB5N6M7',
      reason: 'Compromised admin key reported during routine security audit.',
      votes: ['GDK7V2Q8M4PZX5K6N9W3B1T7R8C2X5A4V9L6D1E3F5G7H2J4K6L8'],
      threshold: 2,
      totalMembers: 3,
      status: 'ACTIVE',
      createdAt: '2026-04-01',
    },
    {
      id: 'PROP-REG-2026-002',
      type: 'ADD_REGULATOR',
      targetAddress: 'GB7W6UX2SVRGZ2M7KVW2Y5G2D5L74WXR2754G2Z37XVRQ1A2B3',
      reason: 'Regional ECOWAS medicine surveillance coordinator onboarding.',
      votes: [
        'GDK7V2Q8M4PZX5K6N9W3B1T7R8C2X5A4V9L6D1E3F5G7H2J4K6L8',
        'GC4X7Y9Z1A2B3C4D5E6F7G8H9J1K2L3M4N5P6Q7R8S9T1U2V3W00',
      ],
      threshold: 2,
      totalMembers: 3,
      status: 'EXECUTED',
      createdAt: '2026-03-20',
    },
  ]);

  if (!isOpen) return null;

  const handleVote = async (propId: string) => {
    setVotingId(propId);
    setSuccessMsg(null);
    try {
      // Simulate on-chain multi-sig vote
      await new Promise((r) => setTimeout(r, 800));
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === propId) {
            const updatedVotes = [...p.votes, session.address || 'G_CALLER_REGULATOR'];
            const passed = updatedVotes.length >= p.threshold;
            return {
              ...p,
              votes: updatedVotes,
              status: passed ? 'PASSED' : 'ACTIVE',
            };
          }
          return p;
        })
      );
      setSuccessMsg(`Your cryptographic vote has been recorded on Soroban for ${propId}.`);
    } finally {
      setVotingId(null);
    }
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAddress.trim() || !proposalReason.trim()) return;

    const newProp: ProposalItem = {
      id: `PROP-REG-2026-${(proposals.length + 1).toString().padStart(3, '0')}`,
      type: propType,
      targetAddress: targetAddress.trim(),
      reason: proposalReason.trim(),
      votes: [session.address || 'G_CREATOR_REGULATOR'],
      threshold: 2,
      totalMembers: 3,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProposals([newProp, ...proposals]);
    setTargetAddress('');
    setProposalReason('');
    setActiveTab('PROPOSALS');
    setSuccessMsg(`Proposal ${newProp.id} created on-chain.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Multisig Governance Council</h3>
              <p className="text-xs text-slate-400">2-of-3 Threshold Governance &bull; Soroban Quorum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('PROPOSALS')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeTab === 'PROPOSALS'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Council Proposals ({proposals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CREATE')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeTab === 'CREATE'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + New Removal/Addition Proposal
          </button>
        </div>

        {activeTab === 'PROPOSALS' ? (
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{prop.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prop.type === 'REMOVE_REGULATOR'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {prop.type.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          prop.status === 'EXECUTED'
                            ? 'bg-slate-800 text-slate-300'
                            : prop.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2">{prop.reason}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1 truncate max-w-[420px]">
                      Target Key: {prop.targetAddress}
                    </p>
                  </div>

                  {/* Vote button */}
                  {prop.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleVote(prop.id)}
                      disabled={votingId === prop.id}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
                    >
                      {votingId === prop.id ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Vote className="w-3.5 h-3.5" />
                      )}
                      <span>Vote Approve</span>
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Quorum Progress:</span>
                    <span className="font-semibold text-white">
                      {prop.votes.length} / {prop.threshold} votes (Total Council: {prop.totalMembers})
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{
                        width: `${Math.min((prop.votes.length / prop.threshold) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Proposal Type
              </label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="REMOVE_REGULATOR">Remove Compromised Regulator</option>
                <option value="ADD_REGULATOR">Add New Regulatory Authority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Regulator Stellar Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                placeholder="G..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Justification &amp; Audit Reference <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={proposalReason}
                onChange={(e) => setProposalReason(e.target.value)}
                placeholder="State regulatory justification, security findings, or jurisdictional mandate..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs"
                required
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('PROPOSALS')}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/25"
              >
                Submit Proposal to Council
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Close Multisig Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultisigModal;
