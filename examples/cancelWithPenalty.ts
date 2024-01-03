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
  // await bobClient.placeBuyOrder(100,1).then(res=>{
  //   console.log("Bob placed buy order")
  //   console.log(res)
  // })

  // // Alice places a limit sell order
  // await aliceClient.placeSellOrder(100,1).then(res=>{
  //   console.log("Alice placed sell order")
  //   console.log(res)
  // })
  // wait for 60 seconds
  // await FermiDex.sleep(65000,"Waiting for 65 seconds")

  const matchedEvents = await aliceClient.getFinalisableOrderMap()
  console.log({matchedEvents})
  const orderToCancel = Object.keys(matchedEvents)[0]
  console.log("Order to cancel",orderToCancel)
  const {eventSlot1,eventSlot2} = matchedEvents[orderToCancel]
  console.log("Event slots",eventSlot1,eventSlot2)

  // args - [eventSlot1,eventSlot2,side:"Ask" | "Bid",askerPk,bidderPk]
  const cancel = await aliceClient.cancelWithPenalty(eventSlot1,eventSlot2,"Bid",aliceKp.publicKey,bobKp.publicKey)
  console.log(cancel)

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
