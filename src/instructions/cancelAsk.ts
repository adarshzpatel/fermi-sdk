import { Program } from "@project-serum/anchor";
import { FermiDex } from "../types";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

type CancelOrderParams = {
  program: Program<FermiDex>;
  owner: Keypair;
  orderId: string;
  marketPda: PublicKey;
};

const cancelBid = async ({
  program,
  owner,
  orderId,
  marketPda,
}: CancelOrderParams) => {
  try {
    const authority = owner; // expected owner
    // validate ownership
    const expectedOwner = authority.publicKey;

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
      .cancelAsk(orderId, expectedOwner)
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
};


export default cancelBid