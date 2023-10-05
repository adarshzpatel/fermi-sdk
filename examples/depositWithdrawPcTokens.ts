import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const coinMint = new PublicKey(marketConstants.coinMint);
  const pcMint = new PublicKey(marketConstants.pcMint);
  const marketPda = new PublicKey(marketConstants.marketPda);

  await FermiDex.depositPcTokens({
    connection,
    authority: user1,
    amount: 100,
    marketPda,
    pcMint,
  })
    .then(() => console.log("Deposited pc tokens"))
    .catch(() => console.log("Failed to deposit Pc tokens"));
  await FermiDex.sleep(30000, "Wating for tx confirmation , sleeping for 30s");
  await FermiDex.withdrawPcTokens({
    amount: 10,
    authority: user1,
    coinMint,
    pcMint,
    connection,
    marketPda,
  })
    .then(() => console.log("Withdrawed pc tokens"))
    .catch(() => console.log("Failed to withdraw Pc tokens"));
};

(async function () {
  try {
    await main();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
