# Soroban Pharma RxProof — Web Application (`Pharma-verify-app`)

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban_v22-7D00FF?logo=stellar)](https://stellar.org/soroban)
[![Testnet Contract](https://img.shields.io/badge/Contract_ID-CA2JMBW...CAZO-brightgreen)](https://stellar.expert/explorer/testnet/contract/CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO)
[![PWA Ready](https://img.shields.io/badge/PWA-IndexedDB_Offline-orange)](https://web.dev/progressive-web-apps/)
[![i18n Multi-Lingual](https://img.shields.io/badge/i18n-EN_FR_HA_YO_SW-success)](#multilingual-i18n-support)
[![Tests](https://img.shields.io/badge/Tests-16%2F16_Passing-success)](#testing)

**Soroban Pharma RxProof** is an enterprise-grade counterfeit medicine verification Progressive Web App (PWA) powered by the Stellar Soroban smart contract platform. It provides instant cryptographic proof of authenticity for pharmaceutical packs, prevents replica cloning via burn-on-dispense mechanisms, tracks blister unit bitmasks, and unifies regulators, manufacturers, distributors, pharmacies, and patients on an immutable public ledger.

---

## 🏛 Architecture & Design System

```
                           +-------------------------------------+
                           |     Next.js 14 PWA Client Shell     |
                           |   (React 18 + Tailwind Glassmorphism)|
                           +------------------+------------------+
                                              |
                +-----------------------------+-----------------------------+
                |                             |                             |
      +---------v---------+         +---------v---------+         +---------v---------+
      |  Consumer Scanner |         | Role-Gated Views  |         |  Offline Engine   |
      | - HTML5 Camera QR |         | - Pharmacy Burn   |         | - IndexedDB Cache |
      | - Web Crypto SHA  |         | - Manufacturer    |         | - Sync Background |
      | - Merkle Proofs   |         | - NMRA Regulator  |         | - Local History   |
      +---------+---------+         +---------+---------+         +---------+---------+
                |                             |                             |
                +-----------------------------+-----------------------------+
                                              |
                +-----------------------------+-----------------------------+
                |                                                           |
      +---------v---------+                                       +---------v---------+
      | Pharma-verify-api |                                       | Stellar Soroban   |
      | - Fastify REST    |                                       | - Smart Contract  |
      | - SEP-10 Auth     |                                       | - Testnet v22     |
      | - Anomaly Engine  |                                       | - CA2JMBW...CAZO  |
      +-------------------+                                       +-------------------+
```

### Key Design Principles:
1. **Rich Aesthetics & Dark Mode**: Modern dark-slate palette with emerald authenticity glows, crimson hazard banners, and frosted glassmorphism cards (`backdrop-blur-md`).
2. **Accessible Everywhere**: Fully responsive from mobile smartphones up to multi-monitor desktop inspector dashboards.
3. **PWA & Low-Connectivity**: Operates in rural dispensaries with zero cellular network using IndexedDB caching and optimistic verification queues.
4. **Multilingual by Design**: Supports English, French, Hausa, Yoruba, and Swahili for African and global healthcare access.

---

## ✨ Features

### 1. Consumer Medicine Verification Portal
- **Camera QR Code Scanner**: Built-in HTML5 video scanner with auto-focus, environmental camera selection, and flashlight/torch toggle.
- **Manual Serial Fallback**: Direct alphanumeric modal input with live formatting validation.
- **Four Clear Visual Status Cards**:
  - 🟢 **Authentic**: Emerald glow, cryptographic Merkle proof badge, batch details, manufacturer signature, and custody trail.
  - 🟡 **Expired**: Amber alert badge, shelf-life calculation, and explicit safe-disposal instructions.
  - 🔴 **Recalled**: Red hazard banner, regulatory directive number, and official health agency recall reason.
  - 🟣 **Suspicious / Cloned**: Duplicate scan counter, timeline of previous scans across different geolocations, and instant counterfeit reporting dialog.
- **Interactive Blister Pack Visualizer**: Visual grid displaying unsealed vs. remaining pills in each blister strip based on Soroban bitmasks.
- **Scan History Drawer**: Local IndexedDB session history with CSV export capabilities.

### 2. Pharmacy Operations Portal (`/pharmacy`)
- **Inventory Custody List**: Real-time list of all medicine batches currently in pharmacy possession.
- **Full Pack Dispense & Serial Burn**: Irrevocably burns pack serial hashes on Stellar Soroban upon dispensing to prevent counterfeiters from recycling packaging.
- **Partial Blister Strip Dispense**: Interactive pill selector that records precise blister bitmask states on-chain when dispensing partial units.

### 3. Manufacturer Portal (`/manufacturer`)
- **Batch Creation & Merkle Tree Minting**: Automated client-side SHA-256 Merkle root computation from serialized pack arrays.
- **2D DataMatrix Packaging Labels Viewer**: Generates printable GS1 DataMatrix label sheets (Carton, Blister foil, and Shipper cases) with CSV/JSON export.
- **Custody Transfer Dispatcher**: Dispatches batch custody to authorized distributors with on-chain waybill logging.

### 4. Regulator Surveillance Dashboard (`/regulator`)
- **Real-Time Supply Chain Anomaly Feed**: Live radar for duplicate serial burns, impossible transit velocity, and invalid Merkle leaf probes.
- **Emergency Circuit Breaker**: National authority switch to immediately pause or resume Soroban contract execution.
- **Participant Licensing Queue**: Review, approve, or reject manufacturer, distributor, and pharmacy license applications on-chain.
- **Batch Recall Initiator**: Broadcast instant immutable recalls across the entire global distribution network.
- **Multisig Governance Council**: 2-of-3 threshold voting interface for removing compromised regulatory keys or adding new authorities.

---

## 🌍 Multilingual (i18n) Support

The application provides instantaneous locale switching persisted across browser reloads:
- **English (`en`)**: International standard medical terminology
- **French (`fr`)**: Francophone West and Central Africa
- **Hausa (`ha`)**: Northern Nigeria, Niger, Ghana
- **Yoruba (`yo`)**: Southwestern Nigeria, Benin, Togo
- **Swahili (`sw`)**: East Africa (Kenya, Tanzania, Uganda, Rwanda)

---

## 🔐 Stellar & Soroban Details

- **Contract ID**: `CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO`
- **Network**: Stellar Testnet
- **RPC Endpoint**: `https://soroban-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Contract Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO)
- **Supported Wallets**: Freighter, Albedo, xBull, and Rabet (via `@creit.tech/stellar-wallets-kit`).

---

## 🧪 Testing

The repository contains a unit and component test suite executed using **Vitest**:

```bash
npm test
```

### Test Coverage:
- `tests/i18n.test.ts`: 4/4 passing — verifies dictionary completeness, key integrity, and localized terminology across all 5 languages.
- `tests/crypto.test.ts`: 6/6 passing — verifies NIST SHA-256 test vectors, sorted-pair commutativity, Merkle tree construction, valid proof verification, tampered leaf/root rejection, and DoS depth guard.
- `tests/components.test.ts`: 6/6 passing — verifies Authentic, Expired, Recalled, Suspicious/Cloned state handling, blister bitmask arithmetic, and input sanitization.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm

### Installation
```bash
# Clone repository
git clone https://github.com/Soroban-Pharma-RxProof/Pharma-verify-app.git
cd Pharma-verify-app

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local` and configure your API and RPC endpoints:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CONTRACT_ID=CA2JMBWAT2DDZZHCULUJXWBZ7N27QO2LRADSPNR4CDUULBWIGCJ2CAZO
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
Pharma-verify-app/
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   ├── manifest.json             # Web App Manifest
│   └── sw.js                     # Offline Service Worker
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # Global Layout with Header, Footer & Providers
│   │   ├── page.tsx              # Public Instant Verification Portal & Scanner
│   │   ├── pharmacy/page.tsx     # Pharmacy Inventory & Dispense Dashboard
│   │   ├── manufacturer/page.tsx # Manufacturer Batch Management Dashboard
│   │   ├── regulator/page.tsx    # Regulator Surveillance & Anomaly Radar
│   │   └── globals.css           # Design Tokens, Glassmorphism & Animations
│   ├── components/
│   │   ├── cards/                # Authentic, Expired, Recalled, Suspicious Cards
│   │   ├── scanner/              # HTML5 Camera QR & Manual Serial Modals
│   │   ├── pharmacy/             # DispenseModal, PartialDispenseModal
│   │   ├── manufacturer/         # CreateBatchModal, LabelsExportModal, CustodyTransferModal
│   │   ├── regulator/            # ParticipantQueueModal, RecallModal, MultisigModal
│   │   └── ui/                   # Navbar, Footer, LanguageSwitcher, OfflineIndicator
│   ├── context/
│   │   └── WalletContext.tsx     # Stellar Wallets Kit & SEP-10 Auth Session
│   ├── i18n/
│   │   ├── translations.ts       # Dictionaries for EN, FR, HA, YO, SW
│   │   └── LanguageContext.tsx   # Locale switcher & auto-detection
│   ├── lib/
│   │   ├── api-client.ts         # Fastify API Client
│   │   ├── contract.ts           # Soroban Testnet Configuration
│   │   ├── crypto.ts             # Web Crypto SHA-256 & Client Merkle Validator
│   │   ├── offline-storage.ts    # IndexedDB Offline Cache & Sync Queue
│   │   └── stellar-wallets.ts    # Stellar Wallets Kit Connection Adapter
│   └── types/                    # Shared TypeScript Domain Models
├── tests/
│   ├── i18n.test.ts              # Multilingual dictionary integrity tests
│   ├── crypto.test.ts            # Client-side Merkle proof validator tests
│   └── components.test.ts        # Status card modeling & bitmask tests
├── vitest.config.ts              # Vitest Test Configuration
├── tailwind.config.ts            # Tailwind Design System Configuration
├── tsconfig.json                 # TypeScript Configuration
└── package.json                  # Dependencies & Scripts
```

---

## 📄 License

MIT &copy; 2026 Soroban Pharma RxProof Consortium. Built for the Stellar Community.
