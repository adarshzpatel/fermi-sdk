
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const fetchEventQueue = async () => {
  

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