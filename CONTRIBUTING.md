# Contributing to RxProof Frontend PWA

Thank you for your interest in contributing to **RxProof App**, the Next.js 14 Progressive Web Application for decentralized counterfeit medicine verification and supply chain custody tracking on the Stellar / Soroban network.

We welcome contributions from developers, designers, security researchers, and Web3 enthusiasts!

---

## Code of Conduct

All contributors are expected to uphold a welcoming, respectful, and harassment-free community standard. Treat all participants with kindness and professional respect.

---

## Development Prerequisites

Before setting up the project, make sure you have:
- **Node.js**: `v20.x` LTS or later
- **npm**: `v10.x` or later
- **Stellar Wallet Extension**: [Freighter Wallet](https://www.freighter.app/) or any SEP-0043 compatible wallet
- **Git**

---

## Local Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/Pharma-verify-app.git
   cd Pharma-verify-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   Configure key variables:
   - `NEXT_PUBLIC_CONTRACT_ID`: Soroban verification contract address (defaults to Testnet address)
   - `NEXT_PUBLIC_STELLAR_RPC_URL`: Soroban RPC endpoint (e.g. `https://soroban-testnet.stellar.org`)
   - `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`: Network passphrase (e.g. `Test SDF Network ; September 2015`)
   - `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to `http://localhost:4000`)

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Quality & Validation Commands

Always run these quality gates prior to submitting a Pull Request:

```bash
# Typecheck TypeScript codebase
npm run lint

# Run unit and component tests via Vitest
npm test

# Build production Next.js PWA bundle
npm run build
```

---

## Branching & Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat:` A new user-facing feature or PWA capability
- `fix:` A bug fix or regression repair
- `docs:` Documentation changes only
- `style:` Formatting, missing semicolons, etc. (no code logic change)
- `refactor:` Code restructuring without functional alterations
- `test:` Adding or refactoring tests
- `chore:` Dependency bumps, CI updates, configuration updates

Branch naming format: `feat/feature-name` or `fix/issue-description`.

---

## PWA & Offline Considerations

- When modifying service workers or PWA manifests, ensure service workers register gracefully without blocking non-PWA browsers.
- Always verify mobile responsive viewport rendering (tested against 360px width upwards).
- Keep client bundle sizes minimal by avoiding large runtime imports.

---

## Submitting Pull Requests

1. Push your feature branch to your fork.
2. Open a Pull Request against `main`.
3. Fill out the Pull Request template completely, linking relevant issue IDs.
4. Ensure all CI checks pass.
