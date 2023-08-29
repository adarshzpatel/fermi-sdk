import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { marketConstants, programId } from "../../config.json";
import { IDL } from "types";

export const getOpenOrders = async (
  userKp: Keypair,
  connection: Connection
) => {
  const { marketPda } = marketConstants;
  const authority = userKp;
  const wallet = new anchor.Wallet(authority);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, programId, provider);
  const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("open-orders", "utf-8"),
      new anchor.web3.PublicKey(marketPda).toBuffer(),
      authority.publicKey.toBuffer(),
    ],
    new anchor.web3.PublicKey(programId)
  );

  const openOrders = await program.account.openOrders.fetch(openOrdersPda);
  const orders = openOrders.orders.map((item) => item.toString());

  return { orders: orders, pda: openOrdersPda };
};
