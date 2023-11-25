import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const finalise = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const selectedMarket = markets[1]
  const bobClient = new FermiDex.FermiClient({
    market: selectedMarket,
    connection,
    authority: bobKp,
  });

  const aliceClient = new FermiDex.FermiClient({
    market:selectedMarket,
    connection,
    authority:aliceKp
  })
  
  // Bob places buy order 
  const buyOrder = await bobClient.placeBuyOrder(100,1)
  console.log(buyOrder)

  // Alice places sell order 
  const sellOrder = await bobClient.placeSellOrder(101,1);
  console.log(sellOrder)
  await FermiDex.sleep(30000,"Waiting for tx to be processed")
  
  // Open orders
  const {orders:bobOpenOrders} = await bobClient.getOpenOrders();
  const {orders:aliceOpenOrders} = await aliceClient.getOpenOrders();
  console.log({bobOpenOrders,aliceOpenOrders})
  
  // Event Queue
  const eventQ = await aliceClient.getEventQueue();
  console.log({eventQ});
  
  // Matched Orders for alice
  const matchedEvents = await aliceClient.getFinalisableOrderMatches()
  console.log(matchedEvents);
};

(async function () {
  try {
    await finalise();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();
