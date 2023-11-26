import {BN} from "@project-serum/anchor"
 
export const priceFromOrderId = (orderId: BN, decimals: number) => {
  const price = BN(orderId).shrn(64).toNumber();
  return price
};

export const timestampFromOrderId = (orderId: BN) => {
  const timestamp = (BigInt(orderId.toString()) << BigInt(64)).toString();
  return timestamp;
};
