import * as anchor from "@project-serum/anchor";
import getFermiDexProgram from "../utils/getFermiDexProgram";
import * as spl from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

type WithdrawPcTokensParams = {
  authority:Keypair
  connection:Connection
  amount:number
  marketPda:PublicKey
  coinMint:PublicKey
  pcMint:PublicKey
}

export const withdrawPcTokens = async ({
  authority,
  connection,
  amount,
  marketPda,
  coinMint,
  pcMint,
}:WithdrawPcTokensParams) => {
  try {
    const program = await getFermiDexProgram(authority, connection);
    const coinVault = await spl.getAssociatedTokenAddress(
      coinMint,
      marketPda,
      true
    );
    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );
    const pcVault = await spl.getAssociatedTokenAddress(
      pcMint,
      marketPda,
      true
    );

    const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false
    );
    
    const withdrawPcTx = await program.methods
      .withdrawCoins(new anchor.BN(amount))
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        coinVault,
        pcVault,
        coinMint: coinMint,
        pcMint: pcMint,
        payer: authorityCoinTokenAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    console.log({ withdrawPcTx });
    return withdrawPcTx;

  } catch (err) {
    console.log(err);
  }
};
