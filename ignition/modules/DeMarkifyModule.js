import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeMarkifyModule = buildModule("DeMarkifyModule", (m) => {
  // Deploy the NFT contract
  const nft = m.contract("NFT");

  // Deploy the Marketplace contract with a 1% fee
  const marketplace = m.contract("Marketplace", [1]);

  return { nft, marketplace };
});

export default DeMarkifyModule;
