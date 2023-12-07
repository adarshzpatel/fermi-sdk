import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const cancelBuyOrder = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: userKp,
  });

  // CANCEL BUY ORDER
  console.log("CANCEL BUY ORDER EXAMPLE");
  console.log("-------------------------");

  const buyOrder = await client.placeBuyOrder(56, 1);
  console.log({ buyOrder })
  await FermiDex.sleep(30000, "Waiting for tx confirmation");
  
  let openOrders = await client.getOpenOrders();
  console.log("Before cancelling", { openOrders: openOrders.orders });

  // cancel order
  const orderIdToCancel = openOrders.orders[openOrders.orders.length - 1];
  const cancelBuyRes = await client.cancelBuyOrder(orderIdToCancel);
  console.log({ cancelBuyRes });

  // Sleeping for 30 secods to wait for tx confirmation - remove this in localnet 
  await FermiDex.sleep(30000, "Waiting for tx confirmation");
  openOrders = await client.getOpenOrders();
  console.log("After cancelling", { openOrders: openOrders.orders });
  console.log("-------------------------");
};

const cancelSellOrder = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: userKp,
  });
  // CANCEL BUY ORDER
  console.log("CANCEL SELL ORDER EXAMPLE");
  console.log("-------------------------");

  let openOrders = await client.getOpenOrders();
  console.log("Before cancelling", { openOrders: openOrders.orders });

  // cancel order
  const orderIdToCancel = openOrders.orders[openOrders.orders.length - 1];
  const cancelSellRes = await client.cancelSellOrder(orderIdToCancel);
  console.log({ cancelSellRes });

  await FermiDex.sleep(20000, "Waiting for tx confirmation");

  openOrders = await client.getOpenOrders();
  console.log("After cancelling", { openOrders: openOrders.orders });
  console.log("-------------------------");
};

(async function () {
  try {
    await cancelBuyOrder();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
