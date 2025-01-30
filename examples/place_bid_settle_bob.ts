import { checkOrCreateAssociatedTokenAccount, getLocalKeypair } from "../src";

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import {
  marketPda,
  vault_authority,
  vault_program,
  vault_state,
  vault_token_account,
} from "./constants";
import { Side } from "../src";
import fs from "fs";
import { Keypair } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";

// Now you can use this keypair with your client initialization
//const client = initClientWithKeypair(keypair);

// ensure opposite side (eg. limit ask by bob exists)
const main = async () => {
  // Read and parse the JSON file
  const alicekp = getLocalKeypair("./test-keypairs/alice/key.json");
  const bobKeypairPath = "./test-keypairs/bob/key.json";
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(bobKeypairPath, "utf8"))
  );

  // Create a Keypair object from the secret key
  const keypair = Keypair.fromSecretKey(secretKey);
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");

  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );

  console.log("Authority client : ", client.walletPk.toString());

  if (market == null) throw new Error("Market not found");
  const provider = client.provider;

  const makerpubkey = getLocalKeypair("./test-keypairs/alice/key.json").publicKey;

  const takerpubkey = getLocalKeypair(
    "./test-keypairs/bob/key.json"
  ).publicKey;

  const makerQuoteAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.quoteMint,
      makerpubkey
    )
  );

  const takerBaseAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.baseMint,
      takerpubkey
    )
  );

  const makerBaseAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.baseMint,
      makerpubkey
    )
  );
  const takerQuoteAcconut = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.quoteMint,
      takerpubkey
    )
  );

  const makerOpenOrders = (
    await client.findOpenOrdersForMarket(makerpubkey, new PublicKey(marketPda))
  )[0];
  const takerOpenOrders = (
    await client.findOpenOrdersForMarket(takerpubkey, new PublicKey(marketPda))
  )[0];

  const args = {
    market: new PublicKey(marketPda),
    marketAuthority: market.marketAuthority,
    eventHeap: market.eventHeap,
    bids: market.bids,
    asks: market.asks,
    marketVaultQuote: market.marketQuoteVault,
    marketVaultBase: market.marketBaseVault,
    takerBaseAccount: takerBaseAccount,
    takerQuoteAccount: takerQuoteAcconut,
    makerBaseAccount: makerBaseAccount,
    makerQuoteAccount: makerQuoteAccount,
    maker: makerOpenOrders,
    taker: takerOpenOrders,
    limit: new BN(0),
    orderid: new BN("1844674407370955161601"),
    qty: new BN(1),
    side: Side.Bid,
  };
  console.log(args);

  // Get and print vault state owner
  const vaultStateAccount = await provider.connection.getAccountInfo(vault_state);
  if (!vaultStateAccount) {
    throw new Error("Vault state account not found");
  }
  console.log("Vault state owner:", vaultStateAccount.owner.toBase58());

  const sourceAccountInfo = await client.provider.connection.getAccountInfo(makerQuoteAccount);
  if (sourceAccountInfo) {
      // Decode the token account data to see the actual owner
      const tokenAccountData = AccountLayout.decode(sourceAccountInfo.data);
      console.log('maker Quote Account :', makerQuoteAccount.toBase58());
      console.log('Token Account Owner:', new PublicKey(tokenAccountData.owner).toBase58());
      console.log('Expected Owner (sender):', makerpubkey.toBase58());
  }
  else {
      console.log('Token Account not found');
  }

  // same for takerquoteaccount
  const sourceAccountInfo2 = await client.provider.connection.getAccountInfo(takerQuoteAcconut);
  if (sourceAccountInfo2) {
      // Decode the token account data to see the actual owner
      const tokenAccountData = AccountLayout.decode(sourceAccountInfo2.data);
      console.log('tkaer Quote Account :', takerQuoteAcconut.toBase58());
      console.log('Token Account Owner:', new PublicKey(tokenAccountData.owner).toBase58());
      console.log('Expected Owner (sender):', takerpubkey.toBase58());
  }
  else {
      console.log('Token Account not found');
  }

  //print alice and bob pubkeys
  console.log('alicepubkey', alicekp.publicKey.toBase58());
  console.log('bobpubkey', keypair.publicKey.toBase58());
  //args
  // limit: BN;

  // orderid: BN;

  // qty: BN;
  // side: Side;
  const caller = keypair.publicKey;

  const [userStatePda] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user_state"),
      vault_state.toBuffer(),
      alicekp.publicKey.toBuffer(),
    ],
    vault_program
  );

  const [ix, signers] = await client.new_order_and_finalize(
    args.market,
    args.marketAuthority,
    args.eventHeap,
    args.bids,
    args.asks,
    args.takerBaseAccount,
    args.takerQuoteAccount,
    args.makerBaseAccount,
    args.makerQuoteAccount,
    args.marketVaultQuote,
    args.marketVaultBase,
    args.maker,
    args.taker,
    //new BN(2),  no slots arg
    args.limit,
    args.orderid,
    args.qty,
    args.side,
    keypair,
    vault_state,
    vault_authority,
    userStatePda,
    caller,
    vault_program,
    vault_token_account
  );
  console.log("signers", signers[0].publicKey.toBase58());
  console.log("makerpubkey", makerpubkey.toBase58());

  await client.sendAndConfirmTransaction(ix, {
    additionalSigners: signers,
  });
  console.log("Finalised successfully");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
