import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, programId, marketConstants } from "../config.json";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import getFermiDexProgram from "../src/utils/getFermiDexProgram";

const cancelOrder = async () => {
  const connection = new Connection(rpcUrl);
  
  // Cancel Buy order
  // const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  // let openOrders = await FermiDex.getOpenOrders(user1, connection);
  // const buyOrderId = "682529530727253409791";
  // console.log("Before cancelling", { openOrders, buyOrderId, user1 });

  // await FermiDex.cancelBuyOrder({
  //   connection,
  //   owner: user1,
  //   orderId: buyOrderId,
  //   marketPda: new PublicKey(marketConstants.marketPda),
  // });

  // openOrders = await FermiDex.getOpenOrders(user1, connection);
  // console.log("After Cancelling order", { openOrders });

  // Cancel Sell order 
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  // const sellOrderId = "645636042579834306561"
  
  let openOrders = await FermiDex.getOpenOrders(user2, connection);
  const sellOrderId = openOrders.orders[0]
  console.log("Before cancelling", { openOrders, sellOrderId, user2 });

  await FermiDex.cancelSellOrder({
    connection,
    owner: user2,
    orderId: sellOrderId,
    marketPda: new PublicKey(marketConstants.marketPda),
  });

  await FermiDex.sleep(10000)
  openOrders = await FermiDex.getOpenOrders(user2, connection);

  console.log("After Cancelling order", { openOrders });
};

(async function () {
  try {
    await cancelOrder();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
