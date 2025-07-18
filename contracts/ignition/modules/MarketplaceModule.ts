import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MarketplaceModule", (m) => {
  // Get the deployed DeMarkify contract instance from the DeMarkifyModule
  const demarkifyModule = m.useModule("./DeMarkifyModule");
  const demarkify = demarkifyModule.demarkify;

  // Set parameters with proper types
  const feeRecipient = m.getParameter(
    "feeRecipient", 
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  
  const platformFee = m.getParameter(
    "platformFee", 
    250, // 2.5% in basis points
    { type: "uint256" } // Explicitly specify the parameter type
  );
  
  // Deploy the marketplace contract
  const marketplace = m.contract("DeMarkifyMarketplace", [
    feeRecipient,
    platformFee
  ]);
  
  return { marketplace };
});