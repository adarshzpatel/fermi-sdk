
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const fetchEventQueue = async () => {
  const authority = FermiDex.getLocalKeypair("/Users/zero/.config/solana/id.json");
  const connection = new Connection(rpcUrl)

  // Readable stringified event q
  const parsedEventQ = await FermiDex.getParsedEventQ(authority,connection);
  console.log({parsedEventQ});

  // Raw eventq
  // const rawEventQ = await FermiDex.getRawEventQ(authority,connection);
  // console.log({rawEventQ});
}

(async function () {
  try {
    await fetchEventQueue();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();