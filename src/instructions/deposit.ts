
import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import getFermiDexProgram from "../utils/getFermiDexProgram";


type DepositTokenParams = {
  amount: number;
  marketPda: PublicKey;
  authority: Keypair;
  connection:Connection
}

type DepositCoinTokenParams = DepositTokenParams & {coinMint:PublicKey}
type DepostitPcTokenParams = DepositTokenParams & {pcMint:PublicKey}

export async function depositCoinTokens ({
  amount,
  marketPda,
  coinMint,
  authority,
  connection
}: DepositCoinTokenParams){
  try {
    const program = getFermiDexProgram(authority,connection)
    const coinVault = await spl.getAssociatedTokenAddress(
      coinMint,
      marketPda,
      true
    );

    const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false
    );

    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const depositIx = await program.methods
      .depositCoinTokens(new anchor.BN(amount))
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        vault: coinVault,
        payer: authorityCoinTokenAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    console.log("Successfully deposited ", { amount, depositIx });
    return {amount,depositIx}
  } catch (err) {
    console.log(err);
  }
}

export async function depositPcTokens({
  amount,
  marketPda,
  pcMint,
  authority,
  connection
}: DepostitPcTokenParams){
  try {
    const program = getFermiDexProgram(authority,connection)
    const pcVault = await spl.getAssociatedTokenAddress(
      pcMint,
      marketPda,
      true
    );

    const authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false
    );

    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("open-orders", "utf-8"),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(program.programId)
    );

    const depositIx = await program.methods
      .depositPcTokens(new anchor.BN(amount))
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        vault: pcVault,
        payer: authorityPcTokenAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    console.log("Successfully deposited ", { amount, depositIx });
    return {amount,depositIx}
  } catch (err) {
    console.log(err);
  }
}
