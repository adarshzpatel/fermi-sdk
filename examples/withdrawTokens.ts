import { Connection } from "@solana/web3.js";
import { rpcUrl } from "../config.json";
import * as FermiDex from "../src";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  const client = new FermiDex.FermiClient({
    market: markets[0],
    connection,
    authority: userKp,
  });

  const balanceBeforeDeosit = await client.fetchOpenOrdersAccountBalances();
  console.log({ balanceBeforeDeosit });
  // Withdraw pc tokens
  //const withdrawPc = await client.withdrawPcTokens(1);
  //console.log({ withdrawPc });
  // Withdraw coin tokens
  const withdrawCoin = await client.withdrawCoinTokens(1000000000);
  console.log({ withdrawCoin });

  await FermiDex.sleep(10000, "Waiting for deposit to be processed"); // Remove this in local testing
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
