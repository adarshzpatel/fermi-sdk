
import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl,marketConstants } from "../config.json";


const fetchTokenBalance = async () => {
  const user = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
  const connection = new Connection(rpcUrl)
  // fetch pc balance
  const pcmint = new PublicKey(marketConstants.pcMint)
  const pcTokenBalance = await FermiDex.getTokenBalance(user.publicKey,pcmint,connection);
  console.log("Pc balance :",pcTokenBalance)
  // fetch coin balance
  const coinmint = new PublicKey(marketConstants.coinMint)
  const coinTokenBalance = await FermiDex.getTokenBalance(user.publicKey,coinmint,connection);
  console.log("Coin balance :",coinTokenBalance);
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