import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: userKp,
  });
  // Placing buy order
  const buyPrice = 100;
  const buyQty = 1;
  const buyOrder = await client.placeBuyOrder(buyPrice, buyQty);
  console.log({ buyOrder });
  // Placing sell order
  const sellPrice = 101;
  const sellQty = 1;
  const sellOrder = await client.placeBuyOrder(sellPrice, sellQty);
  console.log({ sellOrder });
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
