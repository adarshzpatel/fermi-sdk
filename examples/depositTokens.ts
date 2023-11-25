import { Connection } from "@solana/web3.js";
import { rpcUrl } from "../config.json";
import * as FermiDex from "../src";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: userKp,
  });

  const balanceBeforeDeosit = await client.fetchOpenOrdersAccountBalances();
  console.log({ balanceBeforeDeosit });
  // Deposit pc tokens
  const depositPc = await client.depositPcTokens(1000 * 10 ** 6);
  console.log({ depositPc });
  // Deposit coin tokens
  const depositCoin = await client.depositCoinTokens(1000 * 10 ** 9);
  console.log({ depositCoin });

  await FermiDex.sleep(30000, "Waiting for deposit to be processed"); // Remove this in local testing
  const balanceAfterDeposit = await client.fetchOpenOrdersAccountBalances();
  console.log({ balanceAfterDeposit });
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
