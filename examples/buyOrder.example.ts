
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const placeNewBuyOrder = async () => {
  const connection = new Connection(rpcUrl);
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const price = 26
  const buyOrder = await FermiDex.placeNewBuyOrder(user2, price, connection);
  console.log({ buyOrder })
}

(async function() {
  try {
    await placeNewBuyOrder();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
