
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { FermiDex } from "../types";
import { Keypair, PublicKey } from "@solana/web3.js";

export type FinaliseOrderParams = {
  eventSlot1: number;
  eventSlot2: number;
  authority: Keypair;
  program: anchor.Program<FermiDex>;
  counterparty: PublicKey;
  marketPda: anchor.web3.PublicKey;
  coinMint: anchor.web3.PublicKey;
  pcMint: anchor.web3.PublicKey;
  
};


// Counterparty = Seller 
// Authority = Buyer

export const finaliseAskIx = async ({
  eventSlot1,
  eventSlot2,
  authority,
  program,
  marketPda,
  coinMint,
  pcMint,
  counterparty
}: FinaliseOrderParams) => {
  try {
    const [reqQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const authorityCoinTokenAccount: anchor.web3.PublicKey =
      await getAssociatedTokenAddress(
        new anchor.web3.PublicKey(coinMint),
        authority.publicKey,
        true
      );

    const coinVault = await spl.getAssociatedTokenAddress(
      coinMint,
      marketPda,
      true
    );

    const [openOrdersOwnerPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        marketPda.toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const [openOrdersCounterpartyPda] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          marketPda.toBuffer(),
          counterparty.toBuffer(),
        ],
        new anchor.web3.PublicKey(program.programId)
      );

    const finalizeAskTx: string = await program.methods
      .finaliseMatchesAsk(eventSlot1, eventSlot2)
      .accounts({
        openOrdersOwner: openOrdersOwnerPda,
        openOrdersCounterparty: openOrdersCounterpartyPda,
        market: marketPda,
        coinMint: coinMint,
        pcMint: pcMint,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
        coinpayer: authorityCoinTokenAccount,
        authoritySecond: authority.publicKey,
        coinVault: coinVault,
      })
      .signers([authority])
      .rpc();

    return {
      message: "Finalised ask successfully ",
      tx: finalizeAskTx,
    };
  } catch (err) {
    console.error("Error in FinaliseAsk",err);
  }
};


export const finaliseBidIx = async ({
  eventSlot1,
  eventSlot2,
  authority,
  program,
  counterparty,
  marketPda,
  coinMint,
  pcMint,
}: FinaliseOrderParams) => {
  try {
    const [reqQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const authorityPcTokenAccount = await getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      true
    );

    const pcVault = await spl.getAssociatedTokenAddress(
      pcMint,
      marketPda,
      true
    );

    const [openOrdersOwnerPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        marketPda.toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const [openOrdersCounterpartyPda] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("open-orders", "utf-8"),
          marketPda.toBuffer(),
          counterparty.toBuffer(),
        ],
        new anchor.web3.PublicKey(program.programId)
      );

    const finalizeBidTx = await program.methods
      .finaliseMatchesBid(eventSlot1, eventSlot2)
      .accounts({
        openOrdersOwner: openOrdersOwnerPda,
        openOrdersCounterparty: openOrdersCounterpartyPda,
        market: marketPda,
        pcVault: pcVault,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
        coinMint: coinMint,
        pcMint: pcMint,
        authoritySecond: counterparty,
        pcpayer: authorityPcTokenAccount,
      })
      .signers([authority])
      .rpc();

    return {
      message: "Finalised bid successfully ",
      tx: finalizeBidTx,
    };
  } catch (err) {
    console.error("Error in FinaliseBid",err);
  }
};
