import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";
import { BN } from "@coral-xyz/anchor";

const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/alice/key.json");
  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market == null) throw new Error("Market not found");

  const oo = await client.findOpenOrdersForMarket(
    client.walletPk,
    new PublicKey(marketPda)
  );
  if (oo.length === 0) 
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = oo[0];
  const ooAcc = await client.deserializeOpenOrderAccount(openOrdersPk);
  if (ooAcc == null) throw new Error("Open orders account not found");

  const orderIdToCancel = "1881567895518374264830";
  const [ix, signers] = await client
    .cancelOrderById(openOrdersPk, ooAcc, market, new BN(orderIdToCancel))

  await client.sendAndConfirmTransaction([ix], { additionalSigners: signers }).then(() => console.log("Order cancelled successfully"))
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
