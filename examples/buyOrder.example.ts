import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";

const placeNewBuyOrder = async () => {
  const connection = new Connection(rpcUrl);
  const user1Kp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  console.log(user1Kp.publicKey.toString());
  
  const user1 = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: user1Kp,
  });
  const price = 26;


  console.log({ buyOrder });
};

(async function () {
  try {
    await placeNewBuyOrder();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
