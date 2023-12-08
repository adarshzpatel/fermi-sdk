import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const finalise = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const selectedMarket = markets[0];

  const bobClient = new FermiDex.FermiClient({
    market: selectedMarket,
    connection,
    authority: bobKp,
  });

  const aliceClient = new FermiDex.FermiClient({
    market: selectedMarket,
    connection,
    authority: aliceKp,
  });

  console.log("alice :", aliceKp.publicKey.toString());
  console.log("bob:", bobKp.publicKey.toString());

  // Open orders
  const { orders: bobOpenOrders } = await bobClient.getOpenOrders();
  const { orders: aliceOpenOrders } = await aliceClient.getOpenOrders();
  console.log({ bobOpenOrders, aliceOpenOrders });

  // Event Queue
  const eventQ = await aliceClient.getEventQueue();
  console.log({ eventQ });

  // Matched Orders
  const matchedEventsAlice = await aliceClient.getFinalisableOrderMap();
  const matchedEventsBob = await bobClient.getFinalisableOrderMap();
  console.log({ matchedEventsAlice });
  const matchedOrdersAlice = Object.keys(matchedEventsAlice);
  const matchedOrdersBob = Object.keys(matchedEventsBob);
  const orderIdToFinaliseAlice = matchedOrdersAlice[0];
  const orderIdToFinaliseBob = matchedOrdersBob[0];

  const finaliseSellOrder = await aliceClient.finaliseSellOrder(
    orderIdToFinaliseAlice,
    aliceKp.publicKey
  );
  console.log({ finaliseSellOrder });

  const finaliseBuyOrder = await bobClient.finaliseBuyOrder(
    orderIdToFinaliseBob,
    aliceKp.publicKey
  );
  console.log({ finaliseBuyOrder });
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
