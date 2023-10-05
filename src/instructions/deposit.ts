// Deposit Pc Tokens

import { Program } from "@project-serum/anchor";
import { FermiDex } from "../types";
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token";

type DepositParams = {
  program: Program<FermiDex>;
  amount: number;
  marketPda: PublicKey;
  pcMint: PublicKey;
  authority: Keypair;
};

const depositPcTokens = async ({
  program,
  amount,
  marketPda,
  pcMint,
  authority,
}: DepositParams) => {
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

    console.log("Successfully deposited ", { amount, depositIx });
  } catch (err) {
    console.log(err);
  }
};

export default depositPcTokens