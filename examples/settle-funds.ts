import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  const bobClient = initClientWithKeypairPath("./test-keypairs/bob/key.json");

  // Get open orders
  const openOrdersAccounts = await bobClient.findOpenOrdersForMarket(
    bobClient.walletPk,
    new PublicKey(marketPda)
  );
  if (openOrdersAccounts.length === 0)
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = openOrdersAccounts[0];
  const openOrdersAcc = await bobClient.deserializeOpenOrderAccount(
    openOrdersPk
  );

  if (!openOrdersAcc) throw new Error("OpenOrders Account not found!!");

  // Get market
  const market = await bobClient.deserializeMarketAccount(
    new PublicKey(marketPda)
  );

  if (!market) throw new Error("Market not found!!");

  // Args
  // openOrdersPublicKey: PublicKey,
  // openOrdersAccount: OpenOrdersAccount,
  // marketPublicKey: PublicKey,
  // market: MarketAccount,

  const [ix, signers] = await bobClient.settleFundsIx(
    openOrdersPk,
    openOrdersAcc,
    new PublicKey(marketPda),
    market
  );

  await bobClient.sendAndConfirmTransaction([ix], {
    additionalSigners: signers,
  }).then(()=>console.log("Funds settled successfully !"));
};

main().catch(console.error);
