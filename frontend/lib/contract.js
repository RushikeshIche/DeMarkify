import { ethers } from "ethers";
import MarketplaceArtifact from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import NFTArtifact from "../../artifacts/contracts/NFT.sol/NFT.json";
import addresses from "../config/contract-addresses.json";

export const NFT_ADDRESS = addresses.NFT;
export const MARKETPLACE_ADDRESS = addresses.Marketplace;

export function getNFTContract(providerOrSigner) {
  return new ethers.Contract(NFT_ADDRESS, NFTArtifact.abi, providerOrSigner);
}
export function getMarketplaceContract(providerOrSigner) {
  return new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceArtifact.abi, providerOrSigner);
}
