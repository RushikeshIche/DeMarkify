import { ethers } from "ethers";
import MarketplaceArtifact from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

const MARKETPLACE_ADDRESS = import.meta.env.NEXT_PUBLIC_ADDRESS; 

export function getMarketplaceContract(providerOrSigner) {
  return new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, providerOrSigner);
}
