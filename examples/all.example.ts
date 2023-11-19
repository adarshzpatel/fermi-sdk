import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";
import * as os from 'os';
import * as path from 'path';
import getFermiDexProgram from "../src/utils/getFermiDexProgram";

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, '.config/solana/id.json');

const main = async () => {
  const connection = new Connection(rpcUrl);

  const owner = Keypair.fromSecretKey(
    Uint8Array.from([
      1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
      17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
      118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
      41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
    ])
  );

  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");


  console.log("User1 : ", user1.publicKey.toString());
  console.log("User2 : ", user2.publicKey.toString());
  console.log("Owner : ", owner.publicKey.toString());

  // 1. CREATE MARKET -- WORKING
  // await FermiDex.initialiseMarket(owner, connection);

  // 2. Airdrop Tokens -- WORKING
  // console.log("AIRDROPPING TOKENS !!");
  // console.log("------------------------");
  // await FermiDex.airdropCoinToken(user1, owner, connection);
  // await FermiDex.airdropPcToken(user1, owner, connection);

  // await FermiDex.airdropCoinToken(user2, owner, connection);
  // await FermiDex.airdropPcToken(user2, owner, connection);


  // console.log("sleeping for 20 sec")
  // await FermiDex.sleep(20000)
  // console.log("Sleep ended !")

//   // 3. FETCH TOKEN BALANCE -- WORKING
//   console.log("User 1");
//   console.log("Pc balance",(await FermiDex.getTokenBalance(user1.publicKey,new PublicKey(marketConstants.pcMint),connection)))
//   console.log("Coin balance",(await FermiDex.getTokenBalance(user1.publicKey,new PublicKey(marketConstants.coinMint),connection)))
// // 
//   console.log("User 2");
//   console.log("Pc balance",(await FermiDex.getTokenBalance(user2.publicKey,new PublicKey(marketConstants.pcMint),connection)))
//   console.log("Coin balance",(await FermiDex.getTokenBalance(user2.publicKey,new PublicKey(marketConstants.coinMint),connection)))

  // 4. PLACING ORDERS

  // Scenario 1 : User 1 places a buy order first and user 2 places a sell order after
  // await FermiDex.placeNewBuyOrder(user1, 101, connection);
  // await FermiDex.placeNewSellOrder(user2, 100, connection);

  // Secenario 2 : User 2 places a sell order first and user 1 places a buy order after
  // await FermiDex.placeNewSellOrder(user2, 100, connection);
  await FermiDex.placeNewBuyOrder(user1, 101, connection);

  console.log("sleeping for 20 sec")
  await FermiDex.sleep(20000)
  console.log("Sleep ended !")

  // 5. Finalise Orders
  // Check with reverse 
  // add example for finalize
  // user 2 is finalizing the matched orders
  // const authority = user2;
  // const counterparty = user1;
  const openOrdersUser2 = await FermiDex.getOpenOrders(user2, connection);
  console.log("open orders user2",openOrdersUser2)
  const openOrdersUser1 = await FermiDex.getOpenOrders(user1, connection);
  console.log("Open orders user1",openOrdersUser1)
  const eventQ = await FermiDex.getParsedEventQ(user1, connection);
  console.log("Event Queue",eventQ)
  FermiDex.saveLogs(eventQ,"./log.json")
  // const matchedEventsForUser2 = FermiDex.findMatchingEvents(openOrdersAuthority.orders,eventQ)
  // const matchedEventsForUser1 = FermiDex.findMatchingEvents(openOrdersCounterparty.orders,eventQ)

  // console.log(matchedEventsForUser2.entries())
  // console.log(matchedEventsForUser1.entries())


// const matchedEvents = FermiDex.findMatchingEvents(
//     openOrdersAuthority.orders,
//     eventQ
//   );

//   console.log(matchedEvents.entries())

//   for (const [orderId, match] of matchedEvents) {
//     const { orderIdMatched, orderIdSecondMatched } = match
//     if (!orderIdMatched || !orderIdSecondMatched) continue
//     console.log(`GOING TO FINALIZE FOR ORDER ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`)

//     await FermiDex.finaliseMatchesAsk({
//       eventSlot1: orderIdSecondMatched.idx,
//       eventSlot2: orderIdMatched.idx,
//       authority: authority,
//       authoritySecond: counterparty,
//       openOrdersOwnerPda: openOrdersAuthority.pda,
//       openOrdersCounterpartyPda: openOrdersCounterparty.pda,
//       connection: connection
//     })

//     await FermiDex.finaliseMatchesBid({
//       eventSlot1: orderIdSecondMatched.idx,
//       eventSlot2: orderIdMatched.idx,
//       authority: authority,
//       authoritySecond: counterparty,
//       openOrdersOwnerPda: openOrdersAuthority.pda,
//       openOrdersCounterpartyPda: openOrdersCounterparty.pda,
//       connection: connection
//     })

//     console.log(` ✅SUCCESSFULLY FINALIZED  ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`)
//   }
};

(async function() {
  try {
    await main();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
