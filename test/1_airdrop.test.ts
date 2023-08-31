import { Connection } from "@solana/web3.js";

import { rpcUrl } from "../config.json";
import { airdropCoinToken, airdropPcToken, getLocalKeypair, sleep } from "../src";


describe("Airdrop tokens 🪂", async () => {
  const connection = new Connection(rpcUrl);

  // Replace with authority keypair which created new market
  const owner = getLocalKeypair("/Users/zero/.config/solana/id.json");
  const user1 = getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const user2 = getLocalKeypair("./test-keypairs/user2/key.json"); // D1MCk3t8B6Cp1GnUnNkKBtMS5iXG4FEq4U3yNvJgtdD

  it("Should airdrop tokens to user 1 🪂", async function () {
    await airdropPcToken(user1, owner, connection)
    await airdropCoinToken(user1, owner, connection)  
  });

  it("Should airdrop tokens to user 2 🪂", async function () {
    await airdropPcToken(user2, owner, connection)
    await airdropCoinToken(user2, owner, connection)  
  });
});
