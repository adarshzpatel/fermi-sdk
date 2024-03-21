import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  const client2 = initClientWithKeypairPath("./test-keypairs/kp3/key.json");
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");
  const openOrdersAccounts = await client.findOpenOrdersForMarket(
    client.walletPk,
    new PublicKey(marketPda)
  );
  if (openOrdersAccounts.length === 0)
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = openOrdersAccounts[0];
  console.log("Authority pk", client.walletPk.toString());
  console.log(
    "Open orders accounts",
    openOrdersAccounts.map((acc) => acc.toString())
  );

  const openOrdersAcc = await client.deserializeOpenOrderAccount(openOrdersPk);
  const openOrders =
    openOrdersAcc &&
    openOrdersAcc.openOrders.filter((o) => o.id.toString() !== "0");
  console.log(
    "Open orders",
    openOrders?.map((o) => ({
      id: o.id.toString(),
      clientId: o.clientId.toString(),
      lockedPrice: o.lockedPrice.toString(),
      position: JSON.stringify(openOrdersAcc?.position, null)
      ,
    }))
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
