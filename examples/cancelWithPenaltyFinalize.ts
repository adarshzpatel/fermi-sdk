import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const cancelWithPenaltyEg = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const bobClient = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: bobKp,
  });
  const aliceClient = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: aliceKp,
  })

  // Bob places a limit buy order
  await bobClient.placeBuyOrder(99,1).then(res=>{
    console.log("Bob placed buy order")
    console.log(res)
  })

  await FermiDex.sleep(5000,"Waiting for 5 seconds")

  // Alice places a limit sell order
  await aliceClient.placeSellOrder(99,1).then(res=>{
    console.log("Alice placed sell order")
    console.log(res)
  })




  // Open orders
  const { orders: bobOpenOrders } = await bobClient.getOpenOrders();
  const { orders: aliceOpenOrders } = await aliceClient.getOpenOrders();
  console.log({ bobOpenOrders, aliceOpenOrders });

  // Event Queue
  const eventQ = await aliceClient.getEventQueue();
  console.log({ eventQ });

  

  // wait for 5 seconds
  await FermiDex.sleep(5000,"Waiting for 5 seconds")
  
  // Matched Orders
  const matchedEventsAlice = await aliceClient.getFinalisableOrderMap();
  const matchedEventsBob = await bobClient.getFinalisableOrderMap();
  console.log({ matchedEventsAlice });
  const matchedOrdersAlice = Object.keys(matchedEventsAlice);
  const matchedOrdersBob = Object.keys(matchedEventsBob);
  const orderIdToFinaliseAlice = matchedOrdersAlice[0];
  const orderIdToFinaliseBob = matchedOrdersBob[0];

  console.log("Bob Finalizes his order.");
  const finaliseBuyOrder = await bobClient.finaliseBuyOrder(
    orderIdToFinaliseBob,
    aliceKp.publicKey
  );
  console.log({ finaliseBuyOrder });

    // wait for 60 seconds
    await FermiDex.sleep(65000,"Waiting for 65 seconds")

// Alice Does not finalise the sell order
console.log("Alice does not finalise the sell order!");
const matchedEventsAlice2 = await aliceClient.getFinalisableOrderMap();
const matchedEventsBob2 = await bobClient.getFinalisableOrderMap();
console.log({ matchedEventsAlice2 });
/*
const finaliseSellOrder = await aliceClient.finaliseSellOrder(
  orderIdToFinaliseAlice,
  aliceKp.publicKey
);
console.log({ finaliseSellOrder }); */

  const matchedEvents = await aliceClient.getFinalisableOrderMap()
  console.log({matchedEvents})
  const orderToCancel = Object.keys(matchedEvents)[0]
  
  if(orderToCancel){
    console.log("Order to cancel",orderToCancel)
    const {eventSlot1,eventSlot2} = matchedEvents[orderToCancel]
    console.log("Event slots",eventSlot1,eventSlot2)

    // // args - [eventSlot1,eventSlot2,side:"Ask" | "Bid",askerPk,bidderPk]
    // const cancelAsk = await aliceClient.cancelWithPenalty(eventSlot1,eventSlot2,"Ask",aliceKp.publicKey,bobKp.publicKey)
    // console.log(cancelAsk)

    console.log("Bob cancels the order with penalty on Alice, and frees up his funds.")
    let bobOpenOrders = await bobClient.fetchOpenOrdersAccountBalances();
    console.log("Bob's balances before canceling with penalty:");
    console.log({ bobOpenOrders });

    const cancelAsk = await bobClient.cancelWithPenalty(eventSlot1,eventSlot2,"Ask",aliceKp.publicKey,bobKp.publicKey)
    console.log(cancelAsk)

    //sleep for 10s to let the order cancel
    await FermiDex.sleep(10000,"Sleeping for 10s to let balances update.")

    bobOpenOrders = await bobClient.fetchOpenOrdersAccountBalances();
    console.log("Bob's balances after canceling with penalty:");
    console.log({ bobOpenOrders });
  }

}


(async function () {
  try {
    await cancelWithPenaltyEg();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
