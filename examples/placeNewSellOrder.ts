
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";

const placeNewSellOrder = async () => {
  const connection = new Connection(rpcUrl);
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const price = 25
  const sellOrder = await FermiDex.placeNewSellOrder(user2,price,connection);
  console.log(sellOrder?.message)
}

(async function () {
  try {
    await placeNewSellOrder();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();