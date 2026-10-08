'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Wallet, LogOut, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useWallet } from '../context/WalletContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { session, connectWallet, disconnectWallet, isLoading } = useWallet();
  const pathname = usePathname();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { href: '/', label: t.verifyMedicine },
    { href: '/pharmacy', label: t.pharmacyPortal, role: 'PHARMACY' },
    { href: '/manufacturer', label: t.manufacturerPortal, role: 'MANUFACTURER' },
    { href: '/regulator', label: t.regulatorPortal, role: 'REGULATOR' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              RxProof <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Stellar</span>
            </span>
            <p className="text-[10px] text-slate-400 hidden sm:block">Soroban Anti-Counterfeit</p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />

          {/* Wallet Button */}
          {session.isConnected && session.address ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-200">
                  {truncateAddress(session.address)}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {session.role}
                </span>
              </div>
              <button
                onClick={disconnectWallet}
                title={t.disconnectWallet}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-glow transition-all active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isLoading ? 'Connecting...' : t.connectWallet}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
