import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, programId, marketConstants } from "../config.json";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const coinMint = new PublicKey(marketConstants.coinMint);
  const pcMint = new PublicKey(marketConstants.pcMint);
  const marketPda = new PublicKey(marketConstants.marketPda);

  await FermiDex.depositCoinTokens({
    amount: 100,
    authority: user1,
    marketPda: new PublicKey(marketConstants.marketPda),
    coinMint: new PublicKey(marketConstants.coinMint),
    connection,
  })
    .then(() => console.log("Withdrawed coin tokens"))
    .catch(() => console.log("Failed to withdraw coin tokens"));

  await FermiDex.sleep(30000,"Wating for tx confirmation , sleeping for 30s");
  await FermiDex.withdrawCoinTokens({
    amount: 10,
    authority: user1,
    coinMint,
    pcMint,
    connection,
    marketPda,
  })
    .then(() => console.log("Withdrawed coin tokens"))
    .catch(() => console.log("Failed to withdraw Pc tokens"));
}

(async function () {
  try {
    await main();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
