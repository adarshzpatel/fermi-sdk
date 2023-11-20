import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import * as os from "os";
import * as path from "path";

import { markets } from "./markets";

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, ".config/solana/id.json");

const main = async () => {
  const connection = new Connection(rpcUrl);
  const owner = FermiDex.getLocalKeypair(solanaConfigPath);
  const user1Kp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const user2Kp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  console.log("User1 : ", user1Kp.publicKey.toString());
  console.log("User2 : ", user2Kp.publicKey.toString());
  console.log("Owner : ", owner.publicKey.toString());

  console.log("--------------------");

  // Creating clients
  const currentMarket = markets[0];
  const user1 = new FermiDex.FermiClient({
    authority: user1Kp,
    connection,
    market: currentMarket,
  });
  const user2 = new FermiDex.FermiClient({
    authority: user1Kp,
    connection,
    market: currentMarket,
  });

  // placing orders
  const buyOrder = await user1.placeBuyOrder(36, 1);
  console.log("Buy Order : ", buyOrder);
  const sellOrder = await user2.placeSellOrder(35, 1);
  console.log("Sell Order : ", sellOrder);
  console.log("--------------------");
  // open orders
  const user1OpenOrders = await user1.getOpenOrders();
  const user2OpenOrders = await user2.getOpenOrders();
  console.log({ user1OpenOrders, user2OpenOrders });
  console.log("--------------------");

  // cancelling order
  const cancelOrder1 = await user1.cancelBuyOrder(user1OpenOrders.orders[0]);
  const cancelOrder2 = await user1.cancelSellOrder(user2OpenOrders.orders[0]);
  console.log({ cancelOrder1, cancelOrder2 });
  console.log("--------------------");
  // event queue (not user specific but market specific)
  const eventQueue1 = await user1.getEventQueue();
  console.log({ eventQueue1 });
  console.log("--------------------");
  // OR
  // const eventQueue2 = await user2.getEventQueue();

  // asks & bids ( not user specific but market specific)
  const asks = await user1.getAsks();
  const bids = await user1.getBids();
  console.log({ asks, bids });
  console.log("--------------------");
  // deposit
  const depositCoinTokens = await user1.depositCoinTokens(10000);
  const depositPcTokens = await user1.depositPcTokens(10000);
  console.log({ depositCoinTokens, depositPcTokens });
  console.log("--------------------");

  // withdraw
  const withdrawCoinTokens = await user1.withdrawCoinTokens(500);
  const withdrawPcTokens = await user1.withdrawPcTokens(500);
  console.log({ withdrawCoinTokens, withdrawPcTokens });
  console.log("--------------------");

  // get a list  of matched  finalisable orders 
  const finalisableOrdersUser1 = await user1.getFinalisableOrderMatches()
  const finalisableOrdersUser2 = await user2.getFinalisableOrderMatches()
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
