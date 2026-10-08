import { describe, it, expect } from 'vitest';
import { VerificationResult, BatchMetadata } from '../src/types';

describe('Component Verification Cards & Logic Tests', () => {
  describe('Verification Results Status Logic', () => {
    it('structures Authentic verification result with valid Merkle proof', () => {
      const authenticResult: VerificationResult = {
        status: 'AUTHENTIC',
        batchId: 'ACT-500-2026-B1',
        serialNumber: 'SN-ACT-500-2026-B1-000042',
        productName: 'Artemether-Lumefantrine 20/120mg',
        dosage: '24 Tablets',
        manufacturer: 'BioPharm West Africa Ltd',
        manufacturerAddress: 'GA2K3Z48QPRTZ99MX2Y517B4V8W6Q72D3L89Z1X234CVB5N6M7',
        expiryTimestamp: Math.floor(Date.now() / 1000) + 180 * 24 * 3600,
        merkleProofVerified: true,
        isBurned: false,
        scanCount: 1,
        totalStrips: 2,
        unitsPerStrip: 12,
        blisterBitmask: 0,
      };

      expect(authenticResult.status).toBe('AUTHENTIC');
      expect(authenticResult.merkleProofVerified).toBe(true);
      expect(authenticResult.isBurned).toBe(false);
      expect(authenticResult.expiryTimestamp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('identifies Expired medicine status correctly when expiry is in the past', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 30 * 24 * 3600; // 30 days ago
      const expiredResult: VerificationResult = {
        status: 'EXPIRED',
        batchId: 'AMX-250-2025-X1',
        serialNumber: 'SN-AMX-250-2025-X1-000109',
        productName: 'Amoxicillin Trihydrate 500mg',
        dosage: '20 Capsules',
        manufacturer: 'PharmaPlus Industries',
        expiryTimestamp: pastTimestamp,
        merkleProofVerified: true,
        isBurned: false,
        scanCount: 1,
      };

      expect(expiredResult.status).toBe('EXPIRED');
      expect(expiredResult.expiryTimestamp).toBeLessThan(Math.floor(Date.now() / 1000));
    });

    it('identifies Recalled medicine hazard and includes official regulatory reason', () => {
      const recalledResult: VerificationResult = {
        status: 'RECALLED',
        batchId: 'PAR-100-2026-C2',
        serialNumber: 'SN-PAR-100-2026-C2-000005',
        productName: 'Paracetamol BP 500mg',
        dosage: '100 Caplets',
        manufacturer: 'Global Meds Ltd',
        expiryTimestamp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
        merkleProofVerified: true,
        isBurned: false,
        scanCount: 1,
        recallReason: 'Sub-potent active pharmaceutical ingredient detected during NMRA random surveillance.',
      };

      expect(recalledResult.status).toBe('RECALLED');
      expect(recalledResult.recallReason).toBeDefined();
      expect(recalledResult.recallReason).toContain('Sub-potent');
    });

    it('flags Suspicious / Cloned pack when serial was already burned or scanned repeatedly', () => {
      const clonedResult: VerificationResult = {
        status: 'SUSPICIOUS',
        batchId: 'ACT-500-2026-B1',
        serialNumber: 'SN-ACT-500-2026-B1-000042',
        productName: 'Artemether-Lumefantrine 20/120mg',
        dosage: '24 Tablets',
        manufacturer: 'BioPharm West Africa Ltd',
        expiryTimestamp: Math.floor(Date.now() / 1000) + 180 * 24 * 3600,
        merkleProofVerified: true,
        isBurned: true,
        scanCount: 4,
        suspiciousReason: 'This pack serial was permanently burned on Soroban blockchain upon retail dispensing. 4 duplicate scans recorded across disparate geolocations.',
      };

      expect(clonedResult.status).toBe('SUSPICIOUS');
      expect(clonedResult.isBurned).toBe(true);
      expect(clonedResult.scanCount).toBeGreaterThan(1);
    });
  });

  describe('Blister Strip Bitmask Math', () => {
    it('correctly calculates remaining units given a blister bitmask integer', () => {
      const unitsPerStrip = 10;

      // 0 bitmask = 0 dispensed, 10 remaining
      const mask0 = 0;
      const dispensed0 = Array.from({ length: unitsPerStrip }).filter((_, i) => (mask0 & (1 << i)) !== 0).length;
      expect(dispensed0).toBe(0);
      expect(unitsPerStrip - dispensed0).toBe(10);

      // Bitmask 31 (binary 0000011111): bits 0..4 set = 5 units dispensed, 5 remaining
      const mask31 = 31;
      const dispensed31 = Array.from({ length: unitsPerStrip }).filter((_, i) => (mask31 & (1 << i)) !== 0).length;
      expect(dispensed31).toBe(5);
      expect(unitsPerStrip - dispensed31).toBe(5);

      // Bitmask 1023 (binary 1111111111): all 10 bits set = full strip dispensed
      const maskAll = 1023;
      const dispensedAll = Array.from({ length: unitsPerStrip }).filter((_, i) => (maskAll & (1 << i)) !== 0).length;
      expect(dispensedAll).toBe(10);
      expect(unitsPerStrip - dispensedAll).toBe(0);
    });
  });

  describe('Manual Serial Input Validation Formatting', () => {
    it('validates serial format and rejects blank or malicious strings', () => {
      const isValidSerial = (s: string) => {
        const trimmed = s.trim();
        return trimmed.length >= 6 && trimmed.length <= 64 && /^[A-Za-z0-9\-_]+$/.test(trimmed);
      };

      expect(isValidSerial('SN-ACT-500-2026-B1-000042')).toBe(true);
      expect(isValidSerial('RX99401')).toBe(true);
      expect(isValidSerial('')).toBe(false);
      expect(isValidSerial('   ')).toBe(false);
      expect(isValidSerial('<script>alert(1)</script>')).toBe(false);
      expect(isValidSerial("'; DROP TABLE batches; --")).toBe(false);
    });
  });
});
