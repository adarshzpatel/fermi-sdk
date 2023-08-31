
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const fetchOpenOrders = async () => {
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const connection = new Connection(rpcUrl)

  const openOrders = await FermiDex.getOpenOrders(user1,connection) // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  console.log({openOrders})

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