
import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import { markets } from "./markets";


const fetchTokenBalance = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const client = new FermiDex.FermiClient({
    market:markets[0],
    connection,
    authority:userKp
  })

  // Fetch custom token 
  const cutomTokenBalance = await FermiDex.getTokenBalance(userKp.publicKey,new PublicKey(markets[0].pcMint),connection);
  console.log({cutomTokenBalance})


  // Fetch open orders token balances - needs open orders account to be already intialised
  const openOrdersTokenBalances = await client.fetchOpenOrdersAccountBalances();
  console.log({openOrdersTokenBalances})
} 

(async function () {
  try {
    await fetchTokenBalance();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();