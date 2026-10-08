'use client';

export interface WalletConnectionInfo {
  address: string;
  walletName: string;
}

export class StellarWalletsManager {
  private static kitInstance: any = null;

  public static async getKit() {
    if (typeof window === 'undefined') return null;

    if (!this.kitInstance) {
      try {
        const {
          StellarWalletsKit,
          WalletNetwork,
          allowAllModules,
          FREIGHTER_ID,
          ALBEDO_ID,
          XBULL_ID,
        } = await import('@creit.tech/stellar-wallets-kit');

        this.kitInstance = new StellarWalletsKit({
          network: WalletNetwork.TESTNET,
          selectedWalletId: FREIGHTER_ID,
          modules: allowAllModules(),
        });
      } catch (err) {
        console.warn('StellarWalletsKit dynamic initialization warning:', err);
      }
    }

    return this.kitInstance;
  }

  /**
   * Open the multi-wallet selection modal
   */
  public static async connect(): Promise<WalletConnectionInfo | null> {
    const kit = await this.getKit();
    if (!kit) return null;

    return new Promise((resolve, reject) => {
      try {
        kit.openModal({
          onWalletSelected: async (option: any) => {
            try {
              kit.setWallet(option.id);
              const address = await kit.getPublicKey();
              resolve({
                address,
                walletName: option.name || option.id,
              });
            } catch (err) {
              reject(err);
            }
          },
          onClosed: () => {
            resolve(null);
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Sign a transaction XDR with the selected wallet
   */
  public static async signTransaction(xdr: string): Promise<string> {
    const kit = await this.getKit();
    if (!kit) throw new Error('Stellar Wallets Kit not initialized');

    const result = await kit.sign({
      xdr,
      network: 'TESTNET',
    });

    return result.signedXDR || result.xdr || result;
  }
}
