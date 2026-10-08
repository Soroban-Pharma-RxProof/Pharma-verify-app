'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Activity } from 'lucide-react';
import { CONTRACT_ID, RxProofContractClient } from '../lib/contract';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 border-b border-slate-800/60">
          {/* Col 1 */}
          <div>
            <div className="flex items-center space-x-2 text-white font-semibold mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Soroban Pharma RxProof</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Decentralized pharmaceutical authentication ledger powered by Stellar smart contracts.
              Protecting global public health through verifiable cryptographic serialization.
            </p>
          </div>

          {/* Col 2: Network & Contract Status */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Ledger Consensus
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Stellar Testnet: Active</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block">Smart Contract:</span>
                <a
                  href={RxProofContractClient.getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group mt-0.5 break-all"
                >
                  <span>{CONTRACT_ID.slice(0, 16)}...{CONTRACT_ID.slice(-8)}</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Regulatory Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-2">Regulatory Oversight</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Compliant with WHO counterfeit surveillance guidelines and national serialization mandates.
              Serial codes are cryptographically burned upon first point-of-care dispense.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Soroban Pharma RxProof Consortium. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Public Verifier
            </Link>
            <Link href="/pharmacy" className="hover:text-slate-300 transition-colors">
              Pharmacy
            </Link>
            <Link href="/manufacturer" className="hover:text-slate-300 transition-colors">
              Manufacturer
            </Link>
            <Link href="/regulator" className="hover:text-slate-300 transition-colors">
              Regulator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
