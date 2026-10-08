'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ParticipantRole, WalletSession } from '../types';
import { StellarWalletsManager } from '../lib/stellar-wallets';

interface WalletContextType {
  session: WalletSession;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  session: {
    address: null,
    role: 'PUBLIC',
    token: null,
    isConnected: false,
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isLoading: false,
  error: null,
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<WalletSession>({
    address: null,
    role: 'PUBLIC',
    token: null,
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const saved = localStorage.getItem('rxproof_wallet_session');
      if (saved) {
        setSession(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const conn = await StellarWalletsManager.connect();
      if (!conn || !conn.address) {
        setIsLoading(false);
        return;
      }

      const address = conn.address;
      let role: ParticipantRole = 'PUBLIC';
      let token: string | null = null;

      // Attempt SEP-10 authentication against backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const challengeRes = await fetch(`${apiUrl}/api/v1/auth/challenge?account=${address}`);
        if (challengeRes.ok) {
          const { transaction } = await challengeRes.json();
          // Sign challenge transaction with wallet
          const signedXdr = await StellarWalletsManager.signTransaction(transaction);

          const tokenRes = await fetch(`${apiUrl}/api/v1/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transaction: signedXdr }),
          });

          if (tokenRes.ok) {
            const data = await tokenRes.json();
            token = data.token;
            role = (data.user?.role as ParticipantRole) || 'PUBLIC';
          }
        }
      } catch (authErr) {
        console.warn('Backend SEP-10 authentication unavailable, using public wallet role:', authErr);
      }

      const newSession: WalletSession = {
        address,
        role,
        token,
        isConnected: true,
        walletName: conn.walletName,
      };

      setSession(newSession);
      localStorage.setItem('rxproof_wallet_session', JSON.stringify(newSession));
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    const emptySession: WalletSession = {
      address: null,
      role: 'PUBLIC',
      token: null,
      isConnected: false,
    };
    setSession(emptySession);
    localStorage.removeItem('rxproof_wallet_session');
  };

  return (
    <WalletContext.Provider
      value={{
        session,
        connectWallet,
        disconnectWallet,
        isLoading,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
