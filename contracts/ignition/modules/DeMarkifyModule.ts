import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeMarkifyModule", (m) => {
  const name = m.getParameter("name", "DeMarkify");
  const symbol = m.getParameter("symbol", "DMK");
  const baseURI = m.getParameter("baseURI", "https://ipfs.io/ipfs/");
  
  const demarkify = m.contract("DeMarkify", [name, symbol, baseURI]);
  
  return { demarkify };
});