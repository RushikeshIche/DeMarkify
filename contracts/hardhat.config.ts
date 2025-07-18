import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    base: {
      url: process.env.BASE_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: {
      base: process.env.BASE_ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      arbitrum: process.env.ARBISCAN_API_KEY || "",
    },
  },
};

export default config;