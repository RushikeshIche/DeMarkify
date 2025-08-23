#  NFT Marketplace

A full-stack decentralized NFT Marketplace built with Solidity, Hardhat, and OpenZeppelin. Users can mint, list, and purchase NFTs with built-in marketplace fees and secure smart contract logic.

---

##  Features

-  Mint NFTs with metadata (IPFS-compatible)
-  List NFTs for sale with custom pricing
-  Purchase NFTs securely with ETH
-  Marketplace fee logic (configurable)
-  Reentrancy protection for safe transactions
-  Full test suite with Hardhat and Chai

---

🌐 Frontend : [Frontend Docs](https://github.com/RushikeshIche/DeMarkify/blob/main/frontend/README.md) 

---
##  Smart Contracts

### `NFT.sol`

- ERC721-compliant token
- URI storage for metadata
- Simple minting function

### `Marketplace.sol`

- Handles listing and purchasing of NFTs
- Transfers ownership securely
- Calculates and distributes marketplace fees
- Emits events for frontend tracking

---

##  Testing

Run the full test suite:

```bash
npx hardhat test
```

Includes tests for:

Deployment

Minting

Listing

Purchasing

Fee distribution

Edge cases (invalid price, insufficient ETH, double purchase)

 Installation
Clone the repo:

```bash
git clone https://github.com/yourusername/nft-marketplace.git
cd nft-marketplace
```

Install dependencies:

```bash
npm install
```

Compile contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

 Development
To deploy locally:

```bash
npx hardhat node
npx hardhat ignition deploy ignition/modules/DeMarkifyModule.js --network localhost
node scripts/exportAddresses.js
```

To deploy to a testnet (e.g. Sepolia):

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Run the Frontend:
```bash
cd frontend
npm install
npm run dev
```

Make sure to configure your .env with your private key and RPC URL.

Use Ethers.js to interact with contracts

Listen to Offered and Bought events

Display NFTs using metadata from IPFS

📄 License
This project is licensed under the MIT License.

🙌 Acknowledgments
OpenZeppelin for secure contract libraries

Hardhat for development and testing

IPFS for decentralized storage using PINATA_API

📬 Contact
For questions or collaboration, reach out via GitHub Issues.
