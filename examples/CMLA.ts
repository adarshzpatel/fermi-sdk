import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";
import * as anchor from "@project-serum/anchor"

const main = async () => {
  const connection = new Connection(rpcUrl);
  const owner = FermiDex.getLocalKeypair("/Users/zero/.config/solana/id.json");
  const wallet = new anchor.Wallet(owner);
  const provider = new anchor.AnchorProvider(connection,wallet,anchor.AnchorProvider.defaultOptions())
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  console.log("User1 : ", user1.publicKey.toString());
  console.log("User2 : ", user2.publicKey.toString());
  console.log("Owner : ", owner.publicKey.toString());
  
    // Create Mints
   const USDCMint = anchor.web3.Keypair.generate();
   const wSolMint = anchor.web3.Keypair.generate();
   const BonkMint = anchor.web3.Keypair.generate();


   await FermiDex.createMint(provider, wSolMint, 9);
   await FermiDex.createMint(provider, USDCMint, 6);
   await FermiDex.createMint(provider, BonkMint, 9);
  // 1. CREATE MARKET -- WORKING
  
  await FermiDex.initialiseMarketCustom(owner, connection, USDCMint.publicKey, wSolMint.publicKey);
  await FermiDex.initialiseMarketCustom(owner, connection, USDCMint.publicKey, BonkMint.publicKey);

  // 2. Airdrop Tokens -- WORKING
  console.log("AIRDROPPING TOKENS !!");
  console.log("------------------------");

  // Airdrop USDC to user1 (Alice)
  await FermiDex.airdropCoinToken(user1, owner, connection);
  await FermiDex.airdropPcToken(user1, owner, connection);

  await FermiDex.airdropCoinToken(user2, owner, connection);
  await FermiDex.airdropPcToken(user2, owner, connection);


  console.log("sleeping for 20 sec")
  await FermiDex.sleep(20000)
  console.log("Sleep ended !")

  // 3. FETCH TOKEN BALANCE -- WORKING
  console.log("User 1");
  console.log("Pc balance",(await FermiDex.getTokenBalance(user1.publicKey,new PublicKey(marketConstants.pcMint),connection)))
  console.log("Coin balance",(await FermiDex.getTokenBalance(user1.publicKey,new PublicKey(marketConstants.coinMint),connection)))

  console.log("User 2");
  console.log("Pc balance",(await FermiDex.getTokenBalance(user2.publicKey,new PublicKey(marketConstants.pcMint),connection)))
  console.log("Coin balance",(await FermiDex.getTokenBalance(user2.publicKey,new PublicKey(marketConstants.coinMint),connection)))

  // 4. PLACING ORDERS

  // Alice places new Bid on both markets 
  await FermiDex.placeNewBuyOrder(user1, 36, connection);
  await FermiDex.placeNewSellOrder(user2, 35, connection);

  // Bob places new sell order on Bonk/USDC market

  console.log("sleeping for 20 sec")
  await FermiDex.sleep(20000)
  console.log("Sleep ended !")

  // 5. Finalise Orders
  //BOB FINALISES ORDERS
  const authority = user2;
  const counterparty = user1;
  const openOrdersAuthority = await FermiDex.getOpenOrders(authority, connection);
  const openOrdersCounterparty = await FermiDex.getOpenOrders(counterparty, connection);
  const eventQ = await FermiDex.getParsedEventQ(user1, connection);
  console.log("user2",openOrdersAuthority)
  console.log("user1",openOrdersCounterparty)
  console.log(eventQ)

const matchedEvents = FermiDex.findMatchingEvents(
    openOrdersAuthority.orders,
    eventQ
  );

  console.log(matchedEvents.entries())

  for (const [orderId, match] of matchedEvents) {
    const { orderIdMatched, orderIdSecondMatched } = match
    if (!orderIdMatched || !orderIdSecondMatched) continue
    console.log(`GOING TO FINALIZE FOR ORDER ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`)

    await FermiDex.finaliseMatchesAsk({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection
    })

    await FermiDex.finaliseMatchesBid({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection
    })

    console.log(` ✅SUCCESSFULLY FINALIZED  ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`)
  }
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
