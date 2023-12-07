import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import { markets } from "./markets";

const main = async () => {
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");

  const wSol_usdc_market = markets[0];
  const bonk_usdc_market = markets[1];
  console.log("BOB : ", bobKp.publicKey.toString());
  console.log("ALICE : ", aliceKp.publicKey.toString());
  console.log("WSOL/USDC Market pda : ", wSol_usdc_market.marketPda);
  console.log("BONK/USDC Market pda : ", bonk_usdc_market.marketPda);

  const bobClient = new FermiDex.FermiClient({
    market: wSol_usdc_market,
    connection,
    authority: bobKp,
  });

  const aliceClient = new FermiDex.FermiClient({
    market: wSol_usdc_market,
    connection,
    authority: aliceKp,
  });

  console.log("Current market : ", aliceClient.getCurrentMarket());

  await aliceClient.placeBuyOrder(0.01, 10000).then((res) => {
    console.log(
      "alice client placed bid for 10000 wSOL at 0.01 usdc price",
      res
    );
  });

  

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
