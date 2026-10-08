/**
 * Browser-compatible cryptographic utilities using the Web Crypto API
 */

export class ClientCrypto {
  /**
   * Convert ArrayBuffer to lowercase hex string
   */
  public static bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hex string to Uint8Array
   */
  public static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }

  /**
   * Compute SHA-256 hash using native Web Crypto API
   */
  public static async sha256Hex(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Hash two 32-byte hex hashes sorted lexicographically.
   * Matches the Soroban contract `hash_sorted_pair`.
   */
  public static async hashSortedPair(hexA: string, hexB: string): Promise<string> {
    const bytesA = this.hexToBytes(hexA);
    const bytesB = this.hexToBytes(hexB);

    let cmp = 0;
    for (let i = 0; i < 32; i++) {
      if (bytesA[i] < bytesB[i]) {
        cmp = -1;
        break;
      }
      if (bytesA[i] > bytesB[i]) {
        cmp = 1;
        break;
      }
    }

    const combined = new Uint8Array(64);
    if (cmp <= 0) {
      combined.set(bytesA, 0);
      combined.set(bytesB, 32);
    } else {
      combined.set(bytesB, 0);
      combined.set(bytesA, 32);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    return this.bufferToHex(hashBuffer);
  }

  /**
   * Client-side Merkle proof validator
   */
  public static async verifyProof(
    leafHex: string,
    proofHexArray: string[],
    rootHex: string,
  ): Promise<boolean> {
    if (proofHexArray.length > 32) return false;

    let current = leafHex.toLowerCase();
    for (const sibling of proofHexArray) {
      current = await this.hashSortedPair(current, sibling.toLowerCase());
    }

    return current.toLowerCase() === rootHex.toLowerCase();
  }
}
