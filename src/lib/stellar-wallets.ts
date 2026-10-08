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
        const swkModule: any = await import('@creit.tech/stellar-wallets-kit');
        const StellarWalletsKit = swkModule.StellarWalletsKit;
        const Networks = swkModule.Networks || { TESTNET: 'TESTNET' };

        this.kitInstance = new StellarWalletsKit({
          network: Networks.TESTNET,
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
              if (kit.setWallet) kit.setWallet(option.id);
              const address = kit.getPublicKey ? await kit.getPublicKey() : option.address;
              resolve({
                address: address || 'GA7TESTNETSAMPLEWALLETADDRESS99420000000000000000',
                walletName: option.name || option.id || 'Freighter',
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
