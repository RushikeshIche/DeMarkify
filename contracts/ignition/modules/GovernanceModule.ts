import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GovernanceModule", (m) => {
  const governanceToken = m.contract("DeMarkifyGovernanceToken");
  
  return { governanceToken };
});