import { describe, it, expect } from 'vitest';
import { ClientCrypto } from '../src/lib/crypto';

describe('ClientCrypto SHA-256 and Merkle Proof Validator Tests', () => {
  it('computes correct standard SHA-256 hex digest matching test vector', async () => {
    // Known NIST SHA-256 vector for "abc"
    const expected = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    const computed = await ClientCrypto.sha256Hex('abc');
    expect(computed).toBe(expected);
  });

  it('guarantees hashSortedPair is commutative: hash(a, b) === hash(b, a)', async () => {
    const hashA = await ClientCrypto.sha256Hex('serial-pack-alpha');
    const hashB = await ClientCrypto.sha256Hex('serial-pack-beta');

    const pair1 = await ClientCrypto.hashSortedPair(hashA, hashB);
    const pair2 = await ClientCrypto.hashSortedPair(hashB, hashA);

    expect(pair1).toBe(pair2);
    expect(pair1.length).toBe(64);
  });

  it('computes Merkle root for single leaf and balanced tree', async () => {
    const leaf0 = await ClientCrypto.sha256Hex('pack-0');
    const singleRoot = await ClientCrypto.computeMerkleRoot([leaf0]);
    expect(singleRoot).toBe(leaf0);

    const leaf1 = await ClientCrypto.sha256Hex('pack-1');
    const pairRoot = await ClientCrypto.computeMerkleRoot([leaf0, leaf1]);
    const expectedPair = await ClientCrypto.hashSortedPair(leaf0, leaf1);
    expect(pairRoot).toBe(expectedPair);

    const leaf2 = await ClientCrypto.sha256Hex('pack-2');
    const leaf3 = await ClientCrypto.sha256Hex('pack-3');
    const treeRoot = await ClientCrypto.computeMerkleRoot([leaf0, leaf1, leaf2, leaf3]);
    expect(treeRoot.length).toBe(64);
  });

  it('verifies valid Merkle proof successfully', async () => {
    const leaf0 = await ClientCrypto.sha256Hex('pack-0');
    const leaf1 = await ClientCrypto.sha256Hex('pack-1');
    const leaf2 = await ClientCrypto.sha256Hex('pack-2');
    const leaf3 = await ClientCrypto.sha256Hex('pack-3');

    // Build 4-leaf tree:
    // parent01 = hashSortedPair(leaf0, leaf1)
    // parent23 = hashSortedPair(leaf2, leaf3)
    // root = hashSortedPair(parent01, parent23)
    const parent01 = await ClientCrypto.hashSortedPair(leaf0, leaf1);
    const parent23 = await ClientCrypto.hashSortedPair(leaf2, leaf3);
    const root = await ClientCrypto.hashSortedPair(parent01, parent23);

    // Proof for leaf0 is: [leaf1, parent23]
    const isValid = await ClientCrypto.verifyProof(leaf0, [leaf1, parent23], root);
    expect(isValid).toBe(true);

    // Proof for leaf2 is: [leaf3, parent01]
    const isLeaf2Valid = await ClientCrypto.verifyProof(leaf2, [leaf3, parent01], root);
    expect(isLeaf2Valid).toBe(true);
  });

  it('rejects tampered leaf, invalid sibling, or modified root', async () => {
    const leaf0 = await ClientCrypto.sha256Hex('pack-0');
    const leaf1 = await ClientCrypto.sha256Hex('pack-1');
    const leaf2 = await ClientCrypto.sha256Hex('pack-2');
    const leaf3 = await ClientCrypto.sha256Hex('pack-3');

    const parent01 = await ClientCrypto.hashSortedPair(leaf0, leaf1);
    const parent23 = await ClientCrypto.hashSortedPair(leaf2, leaf3);
    const root = await ClientCrypto.hashSortedPair(parent01, parent23);

    // Tampered leaf
    const tamperedLeaf = await ClientCrypto.sha256Hex('pack-counterfeit');
    const invalidTampered = await ClientCrypto.verifyProof(tamperedLeaf, [leaf1, parent23], root);
    expect(invalidTampered).toBe(false);

    // Tampered sibling
    const invalidSibling = await ClientCrypto.verifyProof(leaf0, [leaf2, parent23], root);
    expect(invalidSibling).toBe(false);

    // Tampered root
    const invalidRoot = await ClientCrypto.verifyProof(
      leaf0,
      [leaf1, parent23],
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
    expect(invalidRoot).toBe(false);
  });

  it('rejects oversized proof arrays exceeding depth 32 as DoS prevention', async () => {
    const leaf = await ClientCrypto.sha256Hex('pack-0');
    const giantProof = Array(33).fill('0000000000000000000000000000000000000000000000000000000000000000');
    const result = await ClientCrypto.verifyProof(leaf, giantProof, leaf);
    expect(result).toBe(false);
  });
});
