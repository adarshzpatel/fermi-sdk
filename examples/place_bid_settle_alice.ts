import { SideUtils, checkOrCreateAssociatedTokenAccount, getLocalKeypair } from "../src";

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Side } from "../src";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

// ensure opposite side (eg. limit ask by bob exists)
const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");

  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );

  console.log("Authority client : ", client.walletPk.toString());

  if (market == null) throw new Error("Market not found");
  const provider = client.provider;

  const makerpubkey = getLocalKeypair("./test-keypairs/bob/key.json").publicKey;

  const takerpubkey = getLocalKeypair(
    "./test-keypairs/alice/key.json"
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
    orderid: new BN("1844674407370955161602"),
    qty: new BN(2),
    side: SideUtils.Bid,
  };
  console.log(args);

  //args 
  // limit: BN;
  // orderid: BN;
  // qty: BN;
  // side: Side;

  
  const ixs = await client.placeOrderAndFinalize(
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
    args.side
  );

  await client.sendAndConfirmTransaction(ixs, {});
  console.log("Finalised successfully");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
