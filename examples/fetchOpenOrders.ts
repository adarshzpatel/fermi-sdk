
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const fetchOpenOrders = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market:markets[0],
    connection,
    authority:userKp
  })
  // Needs open orders account to be intiitalised first
  const oo = await client.getOpenOrders()
  console.log({oo})

}

(async function () {
  try {
    await fetchOpenOrders();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();