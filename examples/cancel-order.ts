import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  // Initialize the client with the keypair file
  const client = initClientWithKeypairPath("./test-keypairs/alice/key.json");
  // Get the market 
  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market == null) throw new Error("Market not found");

  // Get the open orders account
  const oo = await client.findOpenOrdersForMarket(
    client.walletPk,
    new PublicKey(marketPda)
  );
  
  if (oo.length === 0) 
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  
  // Get the open orders account public key
  const openOrdersPk = oo[0];
  // Deserialize the open orders account
  const ooAcc = await client.deserializeOpenOrderAccount(openOrdersPk);
  if (ooAcc == null) throw new Error("Open orders account not found");

  // Cancel the order by id
  const orderIdToCancel = "1881567895518374264830"; // REPLACE THIS WITH YOUR ORDER ID
  const [ix, signers] = await client
    .cancelOrderById(openOrdersPk, ooAcc, market, new BN(orderIdToCancel))

  await client.sendAndConfirmTransaction([ix], { additionalSigners: signers }).then(() => console.log("Order cancelled successfully"))
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
