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

  // Matched Orders for alice
  const matchedEventsAlice = await aliceClient.getFinalisableOrderMap();

  console.log({ matchedEventsAlice });
  const matchedOrders = Object.keys(matchedEventsAlice);
  const orderIdToFinalise = matchedOrders[0];
  const match = matchedEventsAlice[orderIdToFinalise];

  if (match) {
    const finaliseSellOrder = await aliceClient.finaliseSellOrder(
      aliceKp.publicKey,
      match.eventSlot1,
      match.eventSlot2
    );
    console.log({ finaliseSellOrder });
    const finaliseBuyOrder = await bobClient.finaliseBuyOrder(
      bobKp.publicKey,
      match.eventSlot1,
      match.eventSlot2
    );
    console.log({ finaliseBuyOrder });
  } else {
    console.log("No matches found");
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
