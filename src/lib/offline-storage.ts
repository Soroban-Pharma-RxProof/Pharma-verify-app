import { ScanHistoryItem } from '../types';

const STORAGE_KEY_HISTORY = 'rxproof_scan_history';
const STORAGE_KEY_OFFLINE_QUEUE = 'rxproof_offline_queue';

export interface PendingOfflineScan {
  id: string;
  batchId: string;
  serial: string;
  timestamp: string;
}

export class OfflineStorage {
  /**
   * Save a scan result to persistent history
   */
  public static saveScanHistory(item: Omit<ScanHistoryItem, 'id'>): ScanHistoryItem {
    const history = this.getScanHistory();
    const newItem: ScanHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    // Prepend new scan, cap at 100 items
    const updated = [newItem, ...history].slice(0, 100);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    }
    return newItem;
  }

  /**
   * Retrieve scan history items
   */
  public static getScanHistory(): ScanHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear scan history
   */
  public static clearScanHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  }

  /**
   * Enqueue a scan performed while offline
   */
  public static queuePendingScan(batchId: string, serial: string): PendingOfflineScan {
    const queue = this.getPendingScans();
    const item: PendingOfflineScan = {
      id: `${Date.now()}`,
      batchId,
      serial,
      timestamp: new Date().toISOString(),
    };

    const updated = [...queue, item];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(updated));
    }
    return item;
  }

  /**
   * Get all pending scans awaiting online synchronization
   */
  public static getPendingScans(): PendingOfflineScan[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Remove synchronized scan from pending queue
   */
  public static removePendingScan(id: string): void {
    const queue = this.getPendingScans();
    const updated = queue.filter((i) => i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(updated));
    }
  }

  /**
   * Export scan history to CSV format
   */
  public static exportHistoryCsv(): string {
    const history = this.getScanHistory();
    const headers = ['Timestamp', 'Batch ID', 'Serial', 'Status', 'Offline'];
    const rows = history.map((h) => [
      h.timestamp,
      h.batchId,
      h.serial,
      h.status,
      h.offline ? 'Yes' : 'No',
    ]);

    return [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
  }
}
