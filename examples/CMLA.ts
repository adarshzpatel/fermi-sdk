import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import * as anchor from "@project-serum/anchor";
import * as os from "os";
import * as path from "path";
import { markets } from "./markets";
import { privateDecrypt } from "crypto";

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, ".config/solana/id.json");

const main = async () => {
  const owner = FermiDex.getLocalKeypair(solanaConfigPath);
  const connection = new Connection(rpcUrl);
  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  
  const ownerWallet = new anchor.Wallet(owner);

  const provider = new anchor.AnchorProvider(
    connection,
    ownerWallet,
    anchor.AnchorProvider.defaultOptions()
  );

  console.log("Alice : ", aliceKp.publicKey.toString());
  console.log("Bob : ", bobKp.publicKey.toString());
  console.log("Owner : ", owner.publicKey.toString());

  // Create Mints
  const USDCMint = anchor.web3.Keypair.generate();
  const wSolMint = anchor.web3.Keypair.generate();
  const BonkMint = anchor.web3.Keypair.generate();

  await FermiDex.createMint(provider, wSolMint, 9);
  await FermiDex.createMint(provider, USDCMint, 6);
  await FermiDex.createMint(provider, BonkMint, 9);
  // 1. CREATE MARKET -- WORKING

  const wSol_usdc_market = await FermiDex.initialiseMarketCustom(owner,provider,wSolMint.publicKey,USDCMint.publicKey);
  const bonk_usdc_market = await FermiDex.initialiseMarketCustom(
    owner,
    provider,
    BonkMint.publicKey,
    USDCMint.publicKey
  );

  // 2. Airdrop Tokens -- WORKING
  console.log("AIRDROPPING TOKENS !!");
  console.log("------------------------");

  console.log("sleeping for 20 sec");
  await FermiDex.sleep(20000);
  console.log("Sleep ended !");


  // 4. PLACING ORDERS

  // Alice places new Bid on both markets
  // Place Bid on USDC/wSol market
  /*
  await FermiDex.placeNewBuyOrderCustom({
    kp: user1,
    price: 20000000,//20 * 10e6
    qty: 50,
    connection,
    marketPda: market1Pdas.marketPda,
    coinMint: wSolMint.publicKey,
    pcMint: USDCMint.publicKey,
  }); */
  console.log("Alice placed bid for 50 wsol at 20 usdc price");

  //Place Bid on USDC/Bonk market
  await FermiDex.placeNewBuyOrderCustom({
    kp: user1,
    price: 1000, //0.01*10e6
    qty: 100000,
    connection,
    marketPda: market2Pdas.marketPda,
    coinMint: BonkMint.publicKey,
    pcMint: USDCMint.publicKey,
  });
  console.log("Alice placed bid for 10000 bonk at 0.01 usdc price");

  //await FermiDex.placeNewBuyOrder(user1, 36, connection);
  //await FermiDex.placeNewSellOrder(user2, 35, connection);

  // Bob places new sell order on Bonk/USDC market, selling 500 USDC worth of Sol at the market price.
  await FermiDex.placeNewSellOrderCustom({
    kp: user2,
    price: 1000, //0.01*10e6
    qty: 50000,
    connection,
    marketPda: market2Pdas.marketPda,
    coinMint: BonkMint.publicKey,
    pcMint: USDCMint.publicKey,
  });

  console.log("Bob placed ask for 500000 bonk at 0.01 usdc price");

  console.log("sleeping for 20 sec");
  await FermiDex.sleep(20000);
  console.log("Sleep ended !");

  // 5. Finalise Orders
  //BOB FINALISES ORDERS
  const authority = user2;
  const counterparty = user1;

  const openOrdersAuthority = await FermiDex.getOpenOrdersCustom(
    authority,
    connection,
    market2Pdas.marketPda
  );

  const openOrdersCounterparty = await FermiDex.getOpenOrdersCustom(
    counterparty,
    connection,
    market2Pdas.marketPda
  );

  console.log("user1", openOrdersAuthority);
  console.log("user2", openOrdersCounterparty);

  const eventQmarket1 = await FermiDex.getParsedEventQCustom(
    user1,
    connection,
    market1Pdas.eventQPda
  );
  const eventQmarket2 = await FermiDex.getParsedEventQCustom(
    user1,
    connection,
    market2Pdas.eventQPda
  );
  console.log({ eventQmarket1, eventQmarket2 });

  const matchedEvents = FermiDex.findMatchingEvents(
    openOrdersAuthority.orders,
    eventQmarket2
  );

  console.log(matchedEvents.entries());

  // for (const [orderId, match] of matchedEvents) {
  //   const { orderIdMatched, orderIdSecondMatched } = match;
  //   if (!orderIdMatched || !orderIdSecondMatched) continue;
  //   console.log(
  //     `GOING TO FINALIZE FOR ORDER ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`
  //   );

  //   await FermiDex.finaliseMatchesAskCustom({
  //     eventSlot1: orderIdSecondMatched.idx,
  //     eventSlot2: orderIdMatched.idx,
  //     authority: authority,
  //     authoritySecond: counterparty,
  //     openOrdersOwnerPda: openOrdersAuthority.pda,
  //     openOrdersCounterpartyPda: openOrdersCounterparty.pda,
  //     connection: connection,
  //     marketPda: market2Pdas.marketPda,
  //     coinMint: market2Pdas.coinMint,
  //     pcMint: market2Pdas.pcMint,
  //   });

  //   await FermiDex.finaliseMatchesBidCustom({
  //     eventSlot1: orderIdSecondMatched.idx,
  //     eventSlot2: orderIdMatched.idx,
  //     authority: authority,
  //     authoritySecond: counterparty,
  //     openOrdersOwnerPda: openOrdersAuthority.pda,
  //     openOrdersCounterpartyPda: openOrdersCounterparty.pda,
  //     connection: connection,
  //     marketPda: market2Pdas.marketPda,
  //     coinMint: market2Pdas.coinMint,
  //     pcMint: market2Pdas.pcMint,
  //   });

  //   console.log(
  //     ` ✅SUCCESSFULLY FINALIZED  ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`
  //   );
  // }
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
