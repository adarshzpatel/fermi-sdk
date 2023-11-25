import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { FermiDex } from "../types";

type DepositTokenParams = {
  amount: number;
  marketPda: PublicKey;
  authority: Keypair;
  program: anchor.Program<FermiDex>;
};

type DepositCoinTokenParams = DepositTokenParams & { coinMint: PublicKey };
type DepostitPcTokenParams = DepositTokenParams & { pcMint: PublicKey };

export async function depositCoinTokensIx({
  amount,
  marketPda,
  coinMint,
  authority,
  program,
}: DepositCoinTokenParams) {
  try {
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

    return { message: "Deposit Successfull", tx: depositIx };
  } catch (err) {
    console.log(err);
  }
}

export async function depositPcTokensIx({
  amount,
  marketPda,
  pcMint,
  authority,
  program,
}: DepostitPcTokenParams) {
  try {
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

    // console.log("Successfully deposited ", { amount, depositIx });
    return {
      message: "Deposit successful",
      tx: depositIx,
    };
    return { amount, depositIx };
  } catch (err) {
    console.log(err);
  }
}
