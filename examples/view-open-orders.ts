import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";
import { OpenOrdersAccount } from "../src";

const getOrdersFromAccount = (openOrdersAccount: OpenOrdersAccount) => {
  // remove empty orders
  const openOrders = openOrdersAccount?.openOrders;
  const validOrders = openOrders.filter((o) => o.id.toString() !== "0");
  // stringify BNs
  const parsedOrders = validOrders.map((o) => ({
    id: o.id.toString(),
    clientId: o.clientId.toString(),
    lockedPrice: o.lockedPrice.toString(),
  }));

  return parsedOrders;
};

const getPositionsFromAccount = (openOrdersAccount:OpenOrdersAccount) => {
  const positions = openOrdersAccount.position; 
  const parsedPositions = Object.keys(positions).map((key) => `${key} : ${positions[key].toString()}`);
  return parsedPositions;
}

const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");
  const openOrdersAccounts = await client.findOpenOrdersForMarket(
    client.walletPk,
    new PublicKey(marketPda)
  );
  console.log("OPEN ORDERS ACCOUNT",openOrdersAccounts)
  if (openOrdersAccounts.length === 0)
    throw new Error("Please run 'create-oo-accounts.ts' example first");
  const openOrdersPk = openOrdersAccounts[0];

  console.log("Authority pk", client.walletPk.toString());
  console.log(
    "[ OPEN ORDERS ACCOUNT PUBLIC KEY ]",
    openOrdersAccounts.map((acc) => acc.toString())
  );

  const openOrdersAcc = await client.deserializeOpenOrderAccount(openOrdersPk);
  if (!openOrdersAcc) throw new Error("Open orders account not found!");
  const orders = getOrdersFromAccount(openOrdersAcc);
  console.log("[ ORDERS ] : ", orders);

  const positions = getPositionsFromAccount(openOrdersAcc);
  console.log("[ POSITIONS ] : ",positions)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
