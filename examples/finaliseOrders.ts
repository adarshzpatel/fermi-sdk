import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const finalise = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const selectedMarket = markets[0]
  
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
  
  // // Bob places buy order 
  // const buyOrder = await bobClient.placeBuyOrder(10,1)
  // console.log(buyOrder)

  // // // Alice places sell order 
  // const sellOrder = await aliceClient.placeSellOrder(10,1);
  // console.log(sellOrder)
  // await FermiDex.sleep(30000,"Waiting for tx to be processed")
  
  // Open orders
  const {orders:bobOpenOrders} = await bobClient.getOpenOrders();
  const {orders:aliceOpenOrders} = await aliceClient.getOpenOrders();
  // console.log({bobOpenOrders,aliceOpenOrders})
  
  // Event Queue
  const eventQ = await aliceClient.getEventQueue();
  // console.log({eventQ});
  
  // Matched Orders for alice
  const matchedEventsAlice = await aliceClient.getFinalisableOrderMap()
  const matchedEventsBob = await bobClient.getFinalisableOrderMap()
  console.log({matchedEventsAlice,matchedEventsBob})
  const matchedOrders = Object.keys(matchedEventsAlice)
  const orderIdToFinalise = matchedOrders[0];
  const match = matchedEventsAlice[orderIdToFinalise]

  // console.log({evenQ})
  
  if(match){
    const finaliseSellOrder = await aliceClient.finaliseSellOrder(orderIdToFinalise,aliceKp,match.eventSlot1,match.eventSlot2)
    console.log({finaliseSellOrder})
    const finaliseBuyOrder = await bobClient.finaliseBuyOrder(orderIdToFinalise,bobKp,match.eventSlot1,match.eventSlot2)
    console.log({finaliseBuyOrder})
  } else {
    console.log("No matches found")
  }
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
