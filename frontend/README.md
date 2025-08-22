# DeMarkify — Frontend (Next.js)

This README covers the **frontend** part of your DeMarkify NFT marketplace. It explains how to configure, run, and develop the UI that talks to your smart contracts, IPFS upload endpoints, and MetaMask.

> Assumes the contracts are already compiled & deployed (Hardhat). If you haven’t deployed yet, run your Hardhat deployment first and also the node command to copy addresses into `config/contract-addresses.json`.

---

# Quick start

```bash
# 1. enter frontend directory
cd frontend

# 2. install dependencies
npm install

# 3. start local dev server (Next.js)
npm run dev
# open http://localhost:3000
```

Build & production:

```bash
npm run build
npm run start
```

---

# Project layout (important files)

```
frontend/
├─ app/                    # Next.js app routes
│  ├─ create/              # Create + mint page
│  ├─ listings/            # Marketplace listing page
│  ├─ purchases/           # My purchases page (resell UI)
│  ├─ page.js              # home page
│  └─ layout.js, globals.css
├─ components/
│  └─ Navbar.js
├─ config/
│  └─ contract-addresses.json   # deployed contract addresses (NFT & Marketplace)
├─ lib/
│  ├─ contract.js         # helpers to create ethers contract instances
│  └─ ipfs.js             # ipfs helpers (if present)
├─ pages/api/             # API routes
│  ├─ upload.js           # file upload to IPFS/Pinata
│  └─ metadata.js         # upload metadata (JSON) to IPFS
└─ utils/
   └─ config.ts           # local helper for environment config (optional)
```

---

# Required prerequisites

* Node.js (v18+ recommended)
* npm (or yarn/pnpm)
* MetaMask browser extension (for local testing)
* Local blockchain (optional): `npx hardhat node` if you use Hardhat localhost
* Deployed contracts (NFT & Marketplace) with addresses placed in `config/contract-addresses.json`

---

# Configuration

## 1) Contract addresses

After deploying contracts, update:
`frontend/config/contract-addresses.json`:

```json
{
  "NFT": "0xYourNFTAddress",
  "Marketplace": "0xYourMarketplaceAddress"
}
```

`lib/contract.js` imports ABIs from `artifacts/` and uses these addresses.

> If you redeploy frequently on `hardhat node`, update this file after deploy. You can automate this in your deploy script to write to this JSON.
can read about [Hardhat Ignition](https://hardhat.org/ignition/docs/getting-started) 
## 2) Environment variables for IPFS / Pinata (if used)

In the root of the frontend (or repo root), create a `.env`:

```
PINATA_JWT=eyJ...        # Optional if using Pinata JWT
PINATA_PROJECT_SECRET=yourSecret
PINATA_GATEWAY_URL=https://ipfs.infura.io:5001       #get from pinata cloud
```

> **Security:** Never commit secrets to the repo. For production, proxy uploads through a backend to avoid exposing secrets to the browser.

---

# Running with Hardhat (local dev contract flow)

This section is already done in `DeMarkify/README.md` no need to do it again
1. Start Hardhat node:

   ```bash
   npx hardhat node
   ```

2. Deploy contracts to localhost:

   ```bash
   # depends on your scripts
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. Update `config/contract-addresses.json` with the deployed addresses.

4. Start frontend:

   ```bash
   cd frontend
   npm run dev
   ```

5. Connect MetaMask to `Localhost 8545` network and import an account private key from Hardhat accounts.

---

# How the frontend interacts with contracts & IPFS

* **Image upload**: `app/create/page.js` uploads file to `/api/upload`. That API uploads the file to IPFS (Pinata or Infura) and returns a public URL.

* **Metadata upload**: `/api/metadata` accepts JSON (name, description, image) and pins it to IPFS, returning a metadata URL (tokenURI).

* **Mint & list** flow:

  1. Upload image → get image URL
  2. Upload metadata (JSON) → get metadata URI
  3. Mint NFT with `nft.mint(tokenURI)` (wallet popup)
  4. Approve marketplace (or use setApprovalForAll once)
  5. marketplace.makeItem(nftAddress, tokenId, price) to list

* **Buy**: Home page calls `marketplace.purchaseItem(itemId, { value: totalPrice })`

* **Resell**: `purchases` page calls `nft.approve(marketplace, tokenId)` then `marketplace.resellItem(itemId, newPrice)`

Ethers v6 usage in code: `ethers.BrowserProvider`, `ethers.parseEther`, `ethers.formatEther`.

---

# API routes (brief)

### `pages/api/upload.js`

* Accepts multipart/form-data (file)
* Uses `multer` memory storage
* Converts `req.file.buffer` → `Blob` and passes to Pinata/Infura SDK
* Returns `{ url: "<ipfs gateway url>" }`

If you use Pinata SDK, you must provide a Project ID / secret or JWT. For Infura you must use project credentials.

### `pages/api/metadata.js`

* Accepts JSON metadata and uploads/pins to IPFS
* Returns `{ url: "<ipfs metadata url>" }`

---

# Common gotchas & troubleshooting

* **MetaMask popup not appearing**:

  * Ensure `eth_requestAccounts` is triggered by a user action (button click).
  * Avoid calling `eth_requestAccounts` inside `useEffect` on page load.
  * If you get `-32002` (“request already pending”) — close or approve the pending MetaMask popup or reset site connection in MetaMask.

* **Auto-reconnect to same account**:

  * MetaMask remembers permissions. To prompt account selection again, call `wallet_requestPermissions` or have the user disconnect via MetaMask → Connected Sites.

* **ABI mismatch / decode errors**:

  * If you update contracts (struct changes), recompile and redeploy and update frontend ABI & addresses. `could not decode result data` often means frontend ABI does not match deployed contract.

* **Pinata / Infura 401 / "project id required"**:

  * Provide valid credentials. Don’t expose secret in frontend — proxy via server (API route) for production.

* **Approval issues when reselling**:

  * User must `nft.approve(marketplace, tokenId)` or `nft.setApprovalForAll(marketplace, true)` before marketplace can transfer token.

---

# Recommended UX improvements (already included in code)

* Use `react-toastify` for toast notifications instead of `alert`.
* Show loading indicators during tx confirmation.
* Disable buttons while awaiting confirmation.
* Use `account` state and `accountsChanged` listener to reflect account switching.

---

# Testing

Unit tests for contracts should run under Hardhat:

```bash
npx hardhat test
```

Manual frontend test flow:

1. Start Hardhat node & deploy contracts.
2. Start Next dev server.
3. Connect MetaMask to `http://127.0.0.1:8545/`.
4. Mint, list, buy, resell flows via UI and confirm on-chain changes in Hardhat node logs.

---

# Contributing

If you want to add features or fix bugs:

* Fork → branch: `feat/your-feature` or `fix/desc`
* Keep commits small and use conventional commit messages.
* Add/modify tests for contract logic.
* Update `config/contract-addresses.json` only when deploying to shared dev/test environment.
* Open a PR with the PR template and testing instructions.

---

# Example `contract-addresses.json`

```json
{
  "NFT": "0xYourNFTAddress",
  "Marketplace": "0xYourMarketplaceAddress"
}
```

---

# Helpful commands

* Install: `npm install`
* Dev server: `npm run dev`
* Build: `npm run build`
* Lint: `npm run lint` (if configured)
* Tests (contracts): `npx hardhat test`
* Hardhat node: `npx hardhat node`
* Deploy to local: `npx hardhat run scripts/deploy.js --network localhost` --> this is not required in latest version of hardhat as we already configured using ignition/modules feature in `DeMarkify/README.md`
[Hardhat Ignition](https://hardhat.org/ignition/docs/getting-started) 

---

# Where to look in the code

* `app/create/page.js` — create, upload, metadata, mint & list flow
* `app/page.js` — marketplace home + buy flow
* `app/listings/page.js` — seller listings view
* `app/purchases/page.js` — purchased NFTs + resell UI
* `components/Navbar.js` — connect/disconnect wallet UI
* `lib/contract.js` — contract helper (ABI + address + factory functions)
* `pages/api/upload.js` & `pages/api/metadata.js` — server pinning endpoints

---

# FAQ

**Q: Why does the frontend not update after redeploying contracts?**
A: Update `config/contract-addresses.json` with new addresses and ensure `artifacts/` ABIs match (recompile contracts and copy fresh artifacts if needed).

**Q: How to support testnets/mainnet?**
A: Add environment-specific contract-address files or use `NEXT_PUBLIC_NETWORK` and lookup addresses per network at runtime.

---
