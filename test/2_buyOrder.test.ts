import { Connection } from "@solana/web3.js";

import { rpcUrl } from "../config.json";
import { assert } from "chai";
import { getLocalKeypair, placeNewBuyOrder } from "../src";

describe("Buy Order", async () => {
  
  // Replace with your keypair
  it("Should place buy order  ✨", async function () {
    const connection = new Connection(rpcUrl);
    const user2 = getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
    // await airdrop(userKp,connection);
    const buyPrice = 26;
    const buyOrder = await placeNewBuyOrder(user2, buyPrice, connection);
    console.log(buyOrder?.message);
    assert.isDefined(buyOrder, "Failed to place buy order ❌");
  });
});
