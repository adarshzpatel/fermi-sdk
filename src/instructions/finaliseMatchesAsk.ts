import getFermiDexProgram from "../utils/getFermiDexProgram";
import type { FinaliseMatchesAskParams } from "../types";
import { marketConstants } from "../../config.json";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";

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
    const { coinMint, marketPda, pcMint, reqQPda, eventQPda, coinVault } = marketConstants;

    const authorityCoinTokenAccount: anchor.web3.PublicKey = await getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false
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
