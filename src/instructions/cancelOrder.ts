import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import getFermiDexProgram from "../utils/getFermiDexProgram";

type CancelOrderParams = {
  connection: Connection;
  owner: Keypair;
  orderId: string;
  marketPda: PublicKey;
};

export async function cancelSellOrder({
  connection,
  owner,
  orderId,
  marketPda,
}: CancelOrderParams) {
  try {
    if (Number(orderId) === 0) {
      console.log("Invalid order id. Aborting ...");
      return;
    }
    const authority = owner; // expected owner
    const program = await getFermiDexProgram(authority, connection);

    const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const cancelIx = await program.methods
      .cancelAsk(new anchor.BN(orderId), authority.publicKey)
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        bids: bidsPda,
        asks: asksPda,
        eventQ: eventQPda,
        authority: authority.publicKey, // Assuming this is the expected owner
      })
      .signers([authority])
      .rpc();
    console.log(`Cancelled order ${orderId} `, { cancelIx });
  } catch (err) {
    console.log(err);
  }
}

export async function cancelBuyOrder({
  connection,
  owner,
  orderId,
  marketPda,
}: CancelOrderParams) {
  try {
    if (Number(orderId) === 0) {
      console.log("Invalid order id. Aborting ...");
      return;
    }
    const authority = owner; // expected owner
    const program = await getFermiDexProgram(authority, connection);

    const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const cancelIx = await program.methods
      .cancelBid(new anchor.BN(orderId), authority.publicKey)
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        bids: bidsPda,
        asks: asksPda,
        eventQ: eventQPda,
        authority: authority.publicKey, // Assuming this is the expected owner
      })
      .signers([authority])
      .rpc();

    console.log(`Cancelled order ${orderId} `, { cancelIx });
  } catch (err) {
    console.log(err);
  }
}
