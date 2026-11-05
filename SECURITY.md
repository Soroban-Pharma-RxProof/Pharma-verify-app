# Security Policy

## Supported Versions

Only the latest release of `RxProof App` deployed on the `main` branch receives active security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

We prioritize the security and cryptographic integrity of RxProof and the patients depending on authentic pharmaceutical records.

If you uncover a security vulnerability, please **DO NOT** create a public GitHub issue.

Instead, please report security vulnerabilities responsibly:

1. **Email:** Submit details to `security@rxproof.example` or contact the core maintainers privately.
2. **Details to Include:**
   - Detailed description of the vulnerability.
   - Proof-of-concept steps or exploit scripts.
   - Attack vectors (e.g. client XSS, malicious QR payload injection, wallet transaction hijacking).
   - Expected vs actual behavior.
   - Suggested mitigations if known.

We pledge to acknowledge receipt within 48 hours and provide status updates on remediation.

---

## Client-Side Security Architecture

RxProof PWA adheres to rigorous client-side security policies:

- **Self-Custody Transactions:** Private keys NEVER enter app memory or local storage. All signing operations are performed exclusively via hardware wallets or browser extensions (Freighter, WalletConnect, xBull) conforming to SEP-0043.
- **Content Security Policy (CSP):** Disallows arbitrary inline script execution and limits network connect-src to authorized Soroban RPC nodes and verified backend endpoints.
- **Input Sanitization & QR Validation:** Data scanned via camera QR codes is strictly parsed and validated against schema before any transaction assembly or API submission occurs.
- **Offline Storage Hygiene:** Cached verification records store zero sensitive user identifiers or auth bearer tokens in unencrypted IndexedDB stores.
