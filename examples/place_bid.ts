import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";
import { Side, checkOrCreateAssociatedTokenAccount } from "../src";
import { BN } from "@coral-xyz/anchor";

const main = async () => {
  const bobClient = initClientWithKeypairPath("./test-keypairs/alice/key.json");
  const market = await bobClient.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market === null) throw new Error("Market not found");

  const openOrdersAccounts = await bobClient.findOpenOrdersForMarket(
    bobClient.walletPk,
    new PublicKey(marketPda)
  );
  if (openOrdersAccounts.length === 0)
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = openOrdersAccounts[0];

  const userQuoteTokenAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      bobClient.provider,
      market.quoteMint,
      bobClient.walletPk
    )
  );

  const orderArgs = {
    side: Side.Bid, // or Side.Ask
    // side: 'bid',
    priceLots: new BN(101), // Replace with the appropriate value for price in lots
    maxBaseLots: new BN(1), // Replace with the appropriate value for max base quantity in lots
    maxQuoteLotsIncludingFees: new BN(101), // Replace with the appropriate value for max quote quantity in lots, including fees
    clientOrderId: new BN(6),
    orderType: { limit: {} }, // 'limit' for a limit order, 'market' for a market order, etc.
    expiryTimestamp: new BN(Math.floor(Date.now() / 1000) + 3600), // Unix timestamp, e.g., 1 hour from now.
    selfTradeBehavior: { decrementTake: {} }, // Options might include 'decrementTake', 'cancelProvide', 'abortTransaction', etc.
    limit: 5,
    // selfTradeBehavior: /* self trade behavior */,
    // orderType: /* order type */,
    // limit: /* limit */,
  };

  const [ix, signers] = await bobClient.placeOrderIx(
    openOrdersPk,
    new PublicKey(marketPda),
    market,
    market.marketAuthority,
    userQuoteTokenAccount,
    null, // openOrdersAdmin
    orderArgs,
    [] // remainingAccounts
  );

  await bobClient.sendAndConfirmTransaction([ix], {
    additionalSigners: signers,
  }).then(()=> console.log("Placed bid order successfully"))
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
xx