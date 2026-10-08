export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID || 'CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO';
export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';

export class RxProofContractClient {
  public static getContractId(): string {
    return CONTRACT_ID;
  }

  public static getExplorerUrl(): string {
    return `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;
  }
}
