// We are using export addressess to automatically read and write the contract address for easy address access to frontend
const fs = require("fs");
const path = require("path");

const deploymentPath = path.join(__dirname, "..", "ignition", "deployments", "chain-31337", "deployed_addresses.json");
const frontendPath = path.join(__dirname, "..", "frontend", "config", "contract-addresses.json");

const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));

const addresses = {
  NFT: deployment["DeMarkifyModule#NFT"],
  Marketplace: deployment["DeMarkifyModule#Marketplace"],
};

fs.writeFileSync(frontendPath, JSON.stringify(addresses, null, 2));
console.log("✅ Contract addresses exported to frontend.");
