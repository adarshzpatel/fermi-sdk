
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const placeNewBuyOrder = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  console.log(user1.publicKey.toString())
  const price = 26
  const buyOrder = await FermiDex.placeNewBuyOrder(user1, price, connection);
  
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
