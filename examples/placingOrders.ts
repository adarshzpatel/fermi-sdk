import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const selectedMarket = markets[0]
  
  // Create a Market Client for Alice and Bob
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
  
   //Bob places buy order
   // Specify Price and Quantity
  const buyOrder = await bobClient.placeBuyOrder(73,1)
  console.log({buyOrder})


   // Specify Price and Quantity
  const sellOrder = await aliceClient.placeSellOrder(73,1)
  console.log({sellOrder})

  
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
