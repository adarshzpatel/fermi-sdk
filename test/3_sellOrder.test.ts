import { Connection } from "@solana/web3.js";
import {rpcUrl} from "../config.json"
import {assert} from 'chai'
import { getLocalKeypair, placeNewSellOrder } from "../src";

describe("Sell Order", async () => {
  it('Should place sell order ✨', async function() {
    const connection = new Connection(rpcUrl)
    const user1 = getLocalKeypair("./test-keypairs/user1/key.json"); // D1MCk3t8B6Cp1GnUnNkKBtMS5iXG4FEq4U3yNvJgtdD
    const sellPrice = 25
    const sellOrder = await placeNewSellOrder(user1,sellPrice,connection);
    console.log(sellOrder?.message);
    assert.isDefined(sellOrder,"Failed to place sell order ❌")
  });
});
