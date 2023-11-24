import {getFermiDexProgram} from "../utils/getFermiDexProgram";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { FermiDex } from "../types";
import { Keypair,PublicKey } from "@solana/web3.js";

export type FinaliseOrderParams = {
  eventSlot1: number;
  eventSlot2: number;
  authority: Keypair;
  authoritySecond: Keypair;
  openOrdersOwnerPda: PublicKey;
  openOrdersCounterpartyPda: PublicKey;
  program:anchor.Program<FermiDex>
  marketPda: anchor.web3.PublicKey;
  coinMint: anchor.web3.PublicKey;
  pcMint: anchor.web3.PublicKey;
};

/**
 * Finalize ask side of the order.
 *
 * @param eventSlot1 - The event index of the event having orderIdSecond.
 * @param eventSlot2 - The event index of the event which doesn't have the orderIdSecond.
 * @param authority - The primary authority keypair.
 * @param authoritySecond - The secondary/counterparty authority keypair.
 * @param openOrdersOwnerPda - The pda of openOrders of authority.
 * @param openOrdersCounterpartyPda - The pda of openOrders of counterparty.
 * @param connection - The Solana network connection object.
 * @param marketPda - Pda of market
 * @param coinMint - Mint of coin
 * @param pcMint - mint of payer coin
 * @returns A string representing the transaction or undefined in case of an error.
 */
export const finaliseAskIx = async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  program,
  marketPda,
  coinMint,
  pcMint,
}: FinaliseOrderParams): Promise<string | undefined> => {
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

    console.log({ authorityCoinTokenAccount });

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
        authoritySecond: authoritySecond.publicKey,
        coinVault: coinVault,
      })
      .signers([authority])
      .rpc();

    console.log("✅ finalized Ask : ", finalizeAskTx);
    return finalizeAskTx;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Finalize bid side of the order.
 *
 * @param eventSlot1 - The event index of the event having orderIdSecond.
 * @param eventSlot2 - The event index of the event which doesn't have the orderIdSecond.
 * @param authority - The primary authority keypair.
 * @param authoritySecond - The secondary/counterparty authority keypair.
 * @param openOrdersOwnerPda - The pda of openOrders of authority.
 * @param openOrdersCounterpartyPda - The pda of openOrders of counterparty.
 * @param connection - The Solana network connection object.
 * @param marketPda - Pda of market
 * @returns A string representing the transaction or undefined in case of an error.
 */
export const finaliseBidIx= async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  program,
  marketPda,
  coinMint,
  pcMint,
}: FinaliseOrderParams): Promise<string | undefined> => {
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
      authoritySecond.publicKey,
      true
    );

    const pcVault = await spl.getAssociatedTokenAddress(
      pcMint,
      marketPda,
      true
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
        pcpayer: authorityPcTokenAccount,
      })
      .signers([authority])
      .rpc();

    console.log("✅ finalized bid : ", finalizeBidTx);
    return finalizeBidTx;
  } catch (err) {
    console.error(err);
  }
};
