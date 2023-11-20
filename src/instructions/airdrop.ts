import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { createAssociatedTokenAccount } from "../utils/createAssociatedTokenAccount";
import { mintTo } from "../utils/mintTo";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";

type AirdropTokenParams = {
  receiverPk: PublicKey;
  ownerKp: Keypair;
  connection: Connection;
  mint: PublicKey;
  amount: number;
};

export async function airdropToken({
  receiverPk,
  ownerKp,
  connection,
  mint,
  amount,
}: AirdropTokenParams) {
  try {
    const wallet = new anchor.Wallet(ownerKp);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );

    const receiverCoinTokenAccount: PublicKey =
      await spl.getAssociatedTokenAddress(
        new anchor.web3.PublicKey(mint),
        receiverPk,
        false
      );

    if (!(await connection.getAccountInfo(receiverCoinTokenAccount))) {
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(mint),
        receiverCoinTokenAccount,
        receiverPk
      );
      console.log("✅ Coin ATA created for ", receiverPk.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(mint),
      receiverCoinTokenAccount,
      BigInt(amount.toString())
    );
    console.log(
      "✅ Coin tokens minted to ",
      receiverCoinTokenAccount.toString()
    );

    return receiverCoinTokenAccount;
  } catch (err) {
    console.log("Something went wrong while airdropping coin token.");
    console.log(err);
  }
}
