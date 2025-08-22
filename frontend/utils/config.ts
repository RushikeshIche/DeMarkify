"server only";

import { PinataSDK } from "pinata";
// Connecting to PinataSDK here the setting of tokens takes place for further use of PINATA API
export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL!,
});
