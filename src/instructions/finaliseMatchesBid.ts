import getFermiDexProgram from "../utils/getFermiDexProgram";

import { marketConstants } from "../../config.json";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import type { FinaliseMatchesBidParams } from "../types";
import * as spl from "@solana/spl-token"
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
 * @returns A string representing the transaction or undefined in case of an error.
 */
export const finaliseMatchesBid = async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  connection,
}: FinaliseMatchesBidParams): Promise<string | undefined> => {
  try {
    const program = getFermiDexProgram(authoritySecond, connection);
    const { pcMint, marketPda, pcVault, reqQPda, eventQPda, coinMint } =
      marketConstants;
    const authorityPcTokenAccount = await getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
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
export const finaliseMatchesBidCustom = async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  connection,
  marketPda,
  coinMint,
  pcMint,
}: FinaliseMatchesBidParams & {
  marketPda: anchor.web3.PublicKey;
  coinMint: anchor.web3.PublicKey;
  pcMint: anchor.web3.PublicKey;
}): Promise<string | undefined> => {
  try {
    const program = getFermiDexProgram(authoritySecond, connection);

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
      true,
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
