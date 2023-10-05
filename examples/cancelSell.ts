import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, programId, marketConstants } from "../config.json";

const main = async () => {
  const connection = new Connection(rpcUrl);

  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  // // place a sell order
  await FermiDex.placeNewSellOrder(user2, 35, connection);
  await FermiDex.sleep(30000,"Wating for tx confirmation , sleeping for 30s");

  let openOrders = await FermiDex.getOpenOrders(user2, connection);
  const sellOrderId = openOrders.orders[0];
  console.log("Before cancelling", { openOrders, sellOrderId, user2 });

  await FermiDex.cancelSellOrder({
    connection,
    owner: user2,
    orderId: sellOrderId,
    marketPda: new PublicKey(marketConstants.marketPda),
  });
  
  await FermiDex.sleep(30000,"Wating for tx confirmation , sleeping for 30s");
  openOrders = await FermiDex.getOpenOrders(user2, connection);

  console.log("After Cancelling order", { openOrders });
};

(async function () {
  try {
    await main();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
