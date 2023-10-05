import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";

const withdraw = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const coinMint = new PublicKey(marketConstants.coinMint);
  const pcMint = new PublicKey(marketConstants.pcMint);
  const marketPda = new PublicKey(marketConstants.marketPda);

  const withdrawCoinToken = await FermiDex.withdrawCoinTokens({
    amount: 10,
    authority: user1,
    coinMint,
    pcMint,
    connection,
    marketPda,
  });



  const withdrawPcToken = await FermiDex.withdrawPcTokens({
    amount: 10,
    authority: user1,
    coinMint,
    pcMint,
    connection,
    marketPda,
  });


};

(async function () {
  try {
    await withdraw();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
