import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { createAssociatedTokenAccount } from "../utils/createAssociatedTokenAccount";
import { mintTo } from "../utils/mintTo";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { marketConstants } from "../../config.json";

export const airdrop = async (
  userKp: Keypair,
  owner:Keypair,
  connection: Connection
): Promise<
  | { authorityPcTokenAccount: PublicKey; authorityCoinTokenAccount: PublicKey }
  | undefined
> => {

    const { coinMint, pcMint } = marketConstants;
    const authority = userKp;
    // wallet which owns the market 
    const wallet = new anchor.Wallet(owner);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );

    // create token account
    const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false
    );

    await createAssociatedTokenAccount(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      authority.publicKey
    )
      .then(() =>
        console.log("✅ Coin ATA created")
      );

    await mintTo(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      BigInt("10000000000")
    )
      .then(() =>
        console.log("✅ Coin tokens minted ")
      )

    const authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false
    );

    await createAssociatedTokenAccount(
      provider,
      new anchor.web3.PublicKey(pcMint),
      authorityPcTokenAccount,
      authority.publicKey
    )
      .then(() =>
        console.log("✅ Pc ATA created ")
      )

    await mintTo(
      provider,
      new anchor.web3.PublicKey(pcMint),
      authorityPcTokenAccount,
      BigInt("1000000000")
    )
      .then(() =>
        console.log("✅ Pc tokens minted to")
      )


    console.log("Airdropped to ", authority.publicKey.toString(), "✅");
    return {
      authorityCoinTokenAccount,
      authorityPcTokenAccount,
    };
  
};
