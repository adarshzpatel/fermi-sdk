import * as anchor from "@project-serum/anchor";
import { FermiDex } from "../types";
import { Keypair, PublicKey } from "@solana/web3.js";

type CancelPentaltyParams = {
  program: anchor.Program<FermiDex>;
  authority: Keypair;
  eventSlot1: number;
  eventSlot2: number;
  side: "Ask" | "Bid";
  marketPda: anchor.web3.PublicKey;
  askerPk: PublicKey;
  bidderPk: PublicKey;
};

/**
 * It cancels a order with penalty if 60s has passed since the order was matched but not finalised from one side
 * @param authority - authority keypair
 * @param eventSlot1 - buyer event slot
 * @param eventSlot2 - seller event slot
 * @param side - ask or bid
 * @param program - fermi dex program
 * @param marketPda - market pda;
 * @param askerPk - asker public key
 * @param bidderPk - bidder public key;
 **/

export const cancelWithPenalty = async ({
  authority,
  eventSlot1,
  eventSlot2,
  side,
  program,
  marketPda,
  askerPk,
  bidderPk,
}: CancelPentaltyParams) => {
  try {
    const [eventQ] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const [openOrdersAsker] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        marketPda.toBuffer(),
        askerPk.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const [openOrdersBidder] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        marketPda.toBuffer(),
        bidderPk.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    console.log("openOrdersAsker",openOrdersAsker.toString())
    console.log("openOrdersBidder",openOrdersBidder.toString())
    
    let canceWithPenaltyIx;

    if (side == "Ask") {
      // For ask side
      canceWithPenaltyIx = await program.methods
        .cancelWithPenalty({ ask: {} }, eventSlot1, eventSlot2)
        .accounts({
          eventQ,
          openOrdersAsker,
          openOrdersBidder,
        })
        .signers([authority])
        .rpc();
    } else {
      // For Bid side
      canceWithPenaltyIx = await program.methods
        .cancelWithPenalty({ bid: {} }, eventSlot1, eventSlot2)
        .accounts({
          eventQ,
          openOrdersAsker,
          openOrdersBidder,
        })
        .signers([authority])
        .rpc();
    }
    return {
      message:
        "Order cancelled with penalty for event " +
        eventSlot1 +
        " and " +
        eventSlot2,
      tx: canceWithPenaltyIx,
    };
  } catch (err) {
    console.log("Error in cancelWithPenalty : " ,err);
  }
};
