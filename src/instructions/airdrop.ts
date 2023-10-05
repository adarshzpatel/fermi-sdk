import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { createAssociatedTokenAccount } from "../utils/createAssociatedTokenAccount";
import { mintTo } from "../utils/mintTo";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { marketConstants } from "../../config.json";

/**
* Airdrops pc tokens to a specified user. Needs the keypair of the owner of market
 * 
 * @param userKp - The user keypair that represents the user's identity.
 * @param owner - The owner keypair of the market.
 * @param connection - The Solana network connection object.
 * @returns The public key of the authority coin token account.
 */
export const airdropCoinToken = async (
  userKp: Keypair,
  owner: Keypair,
  connection: Connection
): Promise<PublicKey | undefined> => {
  try {
    const { coinMint } = marketConstants;
    const authority = userKp;
    const wallet = new anchor.Wallet(owner);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    const authorityCoinTokenAccount: PublicKey = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false,
    );

    if (!(await connection.getAccountInfo(authorityCoinTokenAccount))) {
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(coinMint),
        authorityCoinTokenAccount,
        authority.publicKey
      );
      console.log("✅ Coin ATA created for ", authority.publicKey.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      BigInt('10000000000')
    );
    console.log("✅ Coin tokens minted to ", authorityCoinTokenAccount.toString());

    return authorityCoinTokenAccount;
  } catch (err) {
    console.log('Something went wrong while airdropping coin token.');
    console.log(err);
  }
};

/**
 * Airdrops pc tokens to a specified user. Needs the keypair of the owner of market
 * 
 * @param userKp - The user keypair that represents the user's identity.
 * @param owner - The owner keypair of the market.
 * @param connection - The Solana network connection object.
 * @returns The public key of the authority pc token account.
 */
export const airdropPcToken = async (
  userKp: Keypair,
  owner: Keypair,
  connection: Connection
): Promise<PublicKey | undefined> => {
  try {
    const { pcMint } = marketConstants;
    const authority = userKp;
    const wallet = new anchor.Wallet(owner);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    const authorityPcTokenAccount: PublicKey = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false,
    );

    if (!(await connection.getAccountInfo(authorityPcTokenAccount))) {
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(pcMint),
        authorityPcTokenAccount,
        authority.publicKey
      );
      console.log("✅ Pc ATA created for ", authority.publicKey.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(pcMint),
      authorityPcTokenAccount,
      BigInt('1000000000')
    );
    console.log("✅ Pc tokens minted to ", authorityPcTokenAccount.toString());

    return authorityPcTokenAccount;
  } catch (err) {
    console.log('Something went wrong while airdropping pc token.');
    console.log(err);
  }
};

export const airdropCustomToken = async (
  userKp: Keypair,
  owner: Keypair,
  connection: Connection,
  mint: PublicKey,
  amount: BigInt
): Promise<PublicKey | undefined> => {
  try {
    //const { coinMint } = marketConstants;
    const coinMint = mint;
    const authority = userKp;
    const wallet = new anchor.Wallet(owner);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    const authorityCoinTokenAccount: PublicKey = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false,
    );

    if (!(await connection.getAccountInfo(authorityCoinTokenAccount))) {
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(coinMint),
        authorityCoinTokenAccount,
        authority.publicKey
      );
      console.log("✅ Coin ATA created for ", authority.publicKey.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      BigInt(amount.toString())
    );
    console.log("✅ Coin tokens minted to ", authorityCoinTokenAccount.toString());

    return authorityCoinTokenAccount;
  } catch (err) {
    console.log('Something went wrong while airdropping coin token.');
    console.log(err);
  }
};
