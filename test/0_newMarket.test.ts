import { getLocalKeypair } from "../src/utils";
import { initialiseMarket } from "../src/instructions";
import { Connection } from "@solana/web3.js";
import {rpcUrl} from "../config.json"
import {assert} from "chai";

describe("Initialize new market 🚀", async () => {
  it("should initialize new market", async () => {
    const authority = getLocalKeypair("/Users/zero/.config/solana/id.json");
    const connection = new Connection(rpcUrl);
    const market = await initialiseMarket(authority, connection);
    console.log(market);
    assert.isDefined(market,"Failed to initialize new market !")
  });
});
