import { VerificationResult, BatchMetadata, AnomalyItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiClient {
  /**
   * Verify medicine pack authenticity, expiry, recall, and clone status
   */
  public static async verifyPack(batchId: string, serial: string): Promise<VerificationResult> {
    const params = new URLSearchParams({
      batchId,
      serial,
    });

    const res = await fetch(`${API_BASE_URL}/api/v1/public/verify?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Verification request failed');
    }

    return await res.json();
  }

  /**
   * Fetch complete custody journey and provenance trail for a batch
   */
  public static async getBatchJourney(batchId: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/public/batches/${batchId}/journey`);
    if (!res.ok) {
      throw new Error('Failed to retrieve batch journey');
    }
    return await res.json();
  }

  /**
   * Report suspicious / counterfeit medicine pack
   */
  public static async reportSuspicious(payload: {
    batchId?: string;
    serial?: string;
    reason: string;
    location?: string;
    contactEmail?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/v1/public/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  /**
   * Get batches list for authenticated manufacturer/regulator
   */
  public static async getBatches(token?: string | null): Promise<BatchMetadata[]> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/v1/batches`, { headers });
    if (!res.ok) throw new Error('Failed to fetch batches');
    const data = await res.json();
    return data.batches || [];
  }

  /**
   * Create new batch with Merkle root computation
   */
  public static async createBatch(payload: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/batches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create batch');
    }
    return await res.json();
  }

  /**
   * Get anomaly alerts for regulator dashboard
   */
  public static async getAnomalies(token: string): Promise<AnomalyItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/v1/regulator/anomalies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch anomalies');
    const data = await res.json();
    return data.alerts || [];
  }

  /**
   * Resolve an anomaly alert
   */
  public static async resolveAnomaly(id: string, resolutionNotes: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/regulator/anomalies/${id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resolutionNotes }),
    });
    if (!res.ok) throw new Error('Failed to resolve anomaly');
    return await res.json();
  }
}
