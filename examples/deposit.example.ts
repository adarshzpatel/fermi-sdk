import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";

const deposit = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  
  await FermiDex.depositPcTokens({
    connection,
    authority: user1,
    amount: 100,
    marketPda: new PublicKey(marketConstants.marketPda),
    pcMint: new PublicKey(marketConstants.pcMint),
  }).then(()=>console.log("Deposited pc tokens")).catch(()=>console.log("Failed to deposit Pc tokens"));

  await FermiDex.depositCoinTokens({
    amount:100,
    authority:user1,
    marketPda:new PublicKey(marketConstants.marketPda),
    coinMint:new PublicKey(marketConstants.coinMint),
    connection
  })

};

(async function () {
  try {
    await deposit();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
