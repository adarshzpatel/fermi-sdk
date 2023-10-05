import getFermiDexProgram from "../utils/getFermiDexProgram";
import type { FinaliseMatchesAskParams } from "../types";
import { marketConstants } from "../../config.json";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token"

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
 * @returns A string representing the transaction or undefined in case of an error.
 */


export const finaliseMatchesAsk = async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  connection,
}: FinaliseMatchesAskParams): Promise<string | undefined> => {
  try {
    const program = getFermiDexProgram(authoritySecond, connection);
    const { coinMint, marketPda, pcMint, reqQPda, eventQPda, coinVault } =
      marketConstants;

console.log("getting authority ata")
    const authorityCoinTokenAccount: anchor.web3.PublicKey =
      await getAssociatedTokenAddress(
        new anchor.web3.PublicKey(coinMint),
        authority.publicKey,
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
 * Finalize ask side of the order.
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
export const finaliseMatchesAskCustom = async ({
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
}: FinaliseMatchesAskParams & {
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

    const authorityCoinTokenAccount: anchor.web3.PublicKey =
      await getAssociatedTokenAddress(
        new anchor.web3.PublicKey(coinMint),
        authority.publicKey,
        true
      );

    const coinVault = await spl.getAssociatedTokenAddress(coinMint, marketPda, true);

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
