
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market:markets[0],
    connection,
    authority:userKp
  })
  // Needs open orders account to be intiitalised first
  const bids = await client.getBids()
  console.log({bids})
  const asks = await client.getAsks()
  console.log({asks})


}

(async function () {
  try {
    await main();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();