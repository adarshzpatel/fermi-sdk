
import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import { markets } from "./markets";


const fetchTokenBalance = async () => {
  const connection = new Connection(rpcUrl);
  const userKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  
  const selectedMarket = markets[0]
  const client = new FermiDex.FermiClient({
    market:selectedMarket,
    connection,
    authority:userKp
  })

  // Fetch custom token 
  const cutomTokenBalance = await FermiDex.getTokenBalance(userKp.publicKey,new PublicKey(selectedMarket.pcMint),connection);
  console.log({cutomTokenBalance})

  const pcTokenBalance = await client.getWalletPcBalance()
  const coinTokenBalance = await client.getWalletCoinBalance()
  console.log({pcTokenBalance,coinTokenBalance})


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