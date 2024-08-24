import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";

import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  EventHeapAccount,
  FermiClient,
  FillEvent,
  OutEvent,
  createAssociatedTokenAccount,
  getLocalKeypair,
  mintTo,
} from "../src";
import { programId, rpcUrl } from "./constants";

// Function to initilize the client with the keypair path
export const initClientWithKeypairPath = (path: string) => {
  const authority = getLocalKeypair(path);

  // wrap authority keypair in an anchor wallet
  const wallet = new Wallet(authority);

  const conn = new Connection(rpcUrl);
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "finalized",
  });
  const client = new FermiClient(provider, new PublicKey(programId), {
    postSendTxCallback: (tx) =>
      console.log(
        "Tx Sent:",
        `https://solana.fm/tx/${tx.txid}?cluster=devnet-alpha`
      ),
  });

  return client;
};

export function initReadOnlyClient(): FermiClient {
  const conn = new Connection(rpcUrl);
  const stubWallet = new Wallet(Keypair.generate());
  const provider = new AnchorProvider(conn, stubWallet, {});
  return new FermiClient(provider, new PublicKey(programId));
}

interface AirdropTokenParams {
  receiverPk: PublicKey;
  ownerKp: Keypair;
  connection: Connection;
  mint: PublicKey;
  amount: number;
}

export async function airdropToken({
  receiverPk,
  ownerKp,
  connection,
  mint,
  amount,
}: AirdropTokenParams): Promise<void> {
  try {
    const wallet = new anchor.Wallet(ownerKp);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );

    const receiverTokenAccount: PublicKey = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(mint),
      receiverPk,
      false
    );

    if ((await connection.getAccountInfo(receiverTokenAccount)) == null) {
      console.log("ATA not found, creating one...");
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(mint),
        receiverTokenAccount,
        receiverPk
      );
      console.log("✅ ATA created for ", receiverPk.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(mint),
      receiverTokenAccount,
      BigInt(amount.toString())
    );

    console.log(
      "✅ Tokens minted successfully to ",
      receiverTokenAccount.toString()
    );

    // return receiverTokenAccount;
  } catch (err) {
    console.log("Something went wrong while airdropping coin token.");
    console.log(err);
  }
}
