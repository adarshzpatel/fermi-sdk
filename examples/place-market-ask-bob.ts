import { Side, SideUtils, checkOrCreateAssociatedTokenAccount } from "../src";

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  const aliceClient = initClientWithKeypairPath(
    "./test-keypairs/bob/key.json"
  );
  const market = await aliceClient.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market === null) throw new Error("Market not found");

  const openOrdersAccounts = await aliceClient.findOpenOrdersForMarket(
    aliceClient.walletPk,
    new PublicKey(marketPda)
  );
  /*if (openOrdersAccounts.length === 0)
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = openOrdersAccounts[0]; */

  const userBaseTokenAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      aliceClient.provider,
      market.baseMint,
      aliceClient.walletPk
    )
  );
  const userQuoteTokenAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      aliceClient.provider,
      market.quoteMint,
      aliceClient.walletPk
    )
  );
  const orderArgs = {
    side: SideUtils.Ask, // or Side.Ask
    priceLots: new BN(100), // Replace with the appropriate value for price in lots
    maxBaseLots: new BN(1), // Replace with the appropriate value for max base quantity in lots
    maxQuoteLotsIncludingFees: new BN(100), // Replace with the appropriate value for max quote quantity in lots, including fees
    clientOrderId: new BN(10),
    orderType: { immediateOrCancel: {} }, // 'limit' for a limit order, 'market' for a market order, etc.
    expiryTimestamp: new BN(Math.floor(Date.now() / 1000) + 3600), // Unix timestamp, e.g., 1 hour from now.
    selfTradeBehavior: { decrementTake: {} }, // Options might include 'decrementTake', 'cancelProvide', 'abortTransaction', etc.
    limit: 5,
    // selfTradeBehavior: /* self trade behavior */,
    // orderType: /* order type */,
    // limit: /* limit */,
  };

  /* marketPublicKey: PublicKey,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    openOrdersAdmin: PublicKey | null,
    args: PlaceOrderArgs,
    referrerAccount: PublicKey | null,
    remainingAccounts: PublicKey[],
    openOrdersDelegate?: Keypair,
    */
  const [ix, signers] = await aliceClient.placeTakeOrderIx(
    new PublicKey(marketPda),
    market,
    userBaseTokenAccount,
    userQuoteTokenAccount,
    null, // openOrdersAdmin,
    orderArgs,
    [], // remainingAccounts 
  );

  await aliceClient
    .sendAndConfirmTransaction([ix], {
      additionalSigners: signers,
    })
    .then(() => console.log("Placed bid order successfully"));
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
