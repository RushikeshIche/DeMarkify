import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeMarkifyModule = buildModule("DeMarkifyModule", (m) => {
  // Deploy the NFT contract
  const nft = m.contract("NFT");

  // Deploy the Marketplace contract with a 2% fee
  const marketplace = m.contract("Marketplace", [2]);

  return { nft, marketplace };
});

export default DeMarkifyModule;
