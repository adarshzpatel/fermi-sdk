import { Connection, PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";

export const getTokenBalance = async (
  userPk: PublicKey,
  mintPk: PublicKey,
  connection: Connection
) => {
  const associatedTokenAddress = await spl.getAssociatedTokenAddress(
    mintPk,
    userPk,
    false
  );

  const accountData = await spl.getAccount(connection, associatedTokenAddress);

  return accountData.amount.toString();
};
