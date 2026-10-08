export type VerificationStatus =
  | 'AUTHENTIC'
  | 'EXPIRED'
  | 'RECALLED'
  | 'SUSPICIOUS_CLONED'
  | 'SUSPICIOUS_UNKNOWN_BATCH'
  | 'SUSPICIOUS_INVALID_PROOF'
  | 'OFFLINE_PENDING';

export type ParticipantRole =
  | 'PUBLIC'
  | 'PHARMACY'
  | 'DISTRIBUTOR'
  | 'MANUFACTURER'
  | 'REGULATOR';

export interface BatchMetadata {
  batchId: string;
  brandName?: string;
  productName?: string;
  dosageForm?: string;
  dosage?: string;
  packSize?: number;
  totalQuantity: number;
  stripsPerPack?: number;
  totalStrips?: number;
  unitsPerStrip?: number;
  expiryTimestamp: number;
  merkleRoot: string;
  currentCustody?: string;
  currentCustodian?: string;
  status: string;
  manufacturerAddress?: string;
  recallReason?: string;
}

export interface PackDetails {
  serialHash: string;
  serial?: string;
  isDispensed: boolean;
  stripsDispensedBitmask: number;
  dispensedAt?: string | Date;
}

export interface CustodyTransition {
  from: string;
  to: string;
  txHash: string;
  timestamp: string | Date;
}

export interface VerificationResult {
  status: VerificationStatus;
  message: string;
  batch?: BatchMetadata;
  pack?: PackDetails;
  custodyHistory?: CustodyTransition[];
  recallReason?: string;
  dispensedAt?: string | Date;
}

export interface WalletSession {
  address: string | null;
  role: ParticipantRole;
  token: string | null;
  isConnected: boolean;
  walletName?: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  batchId: string;
  serial: string;
  serialHash: string;
  status: VerificationStatus;
  offline: boolean;
}

export interface AnomalyItem {
  id: string;
  rule: string;
  severity: string;
  details: string;
  batchId?: string;
  serialHash?: string;
  resolved: boolean;
  createdAt: string;
}
