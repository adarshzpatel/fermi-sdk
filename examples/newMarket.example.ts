
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const createNewMarket = async () => {
  const authority = FermiDex.getLocalKeypair("/Users/zero/.config/solana/id.json");
  console.log("authority",authority.publicKey.toString())
  const connection = new Connection(rpcUrl)
  const market = await FermiDex.initialiseMarket(authority,connection);
  console.log(market);
}

(async function () {
  try {
    await createNewMarket();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();