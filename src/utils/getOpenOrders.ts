import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";

import { FermiDex } from "../types";

export const fetchOpenOrdersAccount = async (
  authority: Keypair,
  program: anchor.Program<FermiDex>,
  marketPda: anchor.web3.PublicKey
) => {
  const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("open-orders", "utf-8"),
      marketPda.toBuffer(),
      authority.publicKey.toBuffer(),
    ],
    new anchor.web3.PublicKey(program.programId)
  );

  const openOrders = await program.account.openOrders.fetch(openOrdersPda);
  const orders:string[] = openOrders.orders.map((item) => item.toString()).filter((item) => item !== "0");

  return { ...openOrders,orders };
};

