import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, programId, marketConstants } from "../config.json";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  
  // place a buy order
  await FermiDex.placeNewBuyOrder(user1, 36, connection);
  await FermiDex.sleep(30000,"Wating for tx confirmation , sleeping for 30s");
  let openOrders = await FermiDex.getOpenOrders(user1, connection);
  const buyOrderId = openOrders.orders[0]
  
  console.log("Before cancelling", { openOrders, buyOrderId, user1 });

  await FermiDex.cancelBuyOrder({
    connection,
    owner: user1,
    orderId: buyOrderId,
    marketPda: new PublicKey(marketConstants.marketPda),
  });
  await FermiDex.sleep(30000,"Wating for tx confirmation , sleeping for 30s");
  openOrders = await FermiDex.getOpenOrders(user1, connection);
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
