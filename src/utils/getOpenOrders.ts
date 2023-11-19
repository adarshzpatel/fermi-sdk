import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

import getFermiDexProgram from "./getFermiDexProgram";

export const getOpenOrdersCustom = async (
  authority: Keypair,
  connection: Connection,
  marketPda:anchor.web3.PublicKey
):Promise<{orders:string[],pda:PublicKey}> => {
  const program = getFermiDexProgram(authority, connection);

  const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("open-orders", "utf-8"),
      marketPda.toBuffer(),
      authority.publicKey.toBuffer(),
    ],
    new anchor.web3.PublicKey(program.programId)
  );

  const openOrders = await program.account.openOrders.fetch(openOrdersPda);
  const orders = openOrders.orders.map((item) => item.toString());
  
  return { orders: orders, pda: openOrdersPda };
};
