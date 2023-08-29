import getFermiDexProgram from "../utils/getFermiDexProgram";
import type { FinaliseMatchesAskParams } from "types";
import { marketConstants } from "../../config.json";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";


export const finaliseMatchesAsk = async ({
  eventSlot1,
  eventSlot2,
  authority,
  authoritySecond,
  openOrdersOwnerPda,
  openOrdersCounterpartyPda,
  connection
}: FinaliseMatchesAskParams): Promise<string> => {
  const program = getFermiDexProgram(authoritySecond,connection);
  const { coinMint, marketPda, pcMint, reqQPda, eventQPda, coinVault } =
    marketConstants;
  const authorityCoinTokenAccount = await getAssociatedTokenAddress(
    new anchor.web3.PublicKey(coinMint),
    authority.publicKey,
    false
  );

  const finalizeAskTx = await program.methods
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
};
