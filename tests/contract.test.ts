import { describe, it, expect } from 'vitest';
import { RxProofContractClient, CONTRACT_ID } from '../src/lib/contract';

describe('RxProofContractClient Soroban Contract Integration Tests', () => {
  it('correctly provides configured contract ID and explorer URLs', () => {
    const cid = RxProofContractClient.getContractId();
    expect(cid).toBe(CONTRACT_ID);

    const url = RxProofContractClient.getExplorerUrl();
    expect(url).toContain('stellar.expert/explorer/');
    expect(url).toContain(cid);
  });

  it('validates Soroban contract IDs format (C... 56 chars)', () => {
    expect(
      RxProofContractClient.isValidContractId('CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO')
    ).toBe(true);

    // Invalid length
    expect(RxProofContractClient.isValidContractId('CA2JMBWAT2DDZZHC')).toBe(false);
    // Invalid prefix
    expect(
      RxProofContractClient.isValidContractId('GA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO')
    ).toBe(false);
  });

  it('validates standard Stellar public key accounts (G... 56 chars)', () => {
    expect(
      RxProofContractClient.isValidStellarAddress('GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5')
    ).toBe(true);

    // Invalid prefix
    expect(
      RxProofContractClient.isValidStellarAddress('CBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5')
    ).toBe(false);
  });

  it('builds valid register_batch operation with ScVal encoding', () => {
    const op = RxProofContractClient.buildRegisterBatchOp({
      batchId: 'BATCH-2026-TEST',
      merkleRoot: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      expiryTimestamp: 1800000000,
      totalQuantity: 10000,
      manufacturerAddress: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    });

    expect(op).toBeDefined();
    // Verify operation structure
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

  it('builds valid transfer_custody operation', () => {
    const op = RxProofContractClient.buildTransferCustodyOp({
      batchId: 'BATCH-2026-TEST',
      toCustodianAddress: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    });

    expect(op).toBeDefined();
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

  it('builds valid dispense_unit operation', () => {
    const op = RxProofContractClient.buildDispenseOp({
      batchId: 'BATCH-2026-TEST',
      serialHash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      stripsMask: 0x0f,
    });

    expect(op).toBeDefined();
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

  it('builds valid recall_batch operation', () => {
    const op = RxProofContractClient.buildRecallOp({
      batchId: 'BATCH-2026-TEST',
      reasonCode: 2,
    });

    expect(op).toBeDefined();
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });
});
