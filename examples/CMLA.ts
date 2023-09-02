import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, marketConstants } from "../config.json";
import * as anchor from "@project-serum/anchor";
import * as os from "os";
import * as path from "path";

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, ".config/solana/id.json");

const main = async () => {
  const connection = new Connection(rpcUrl);
  const owner = FermiDex.getLocalKeypair(solanaConfigPath);
  const wallet = new anchor.Wallet(owner);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
  console.log("Alice : ", user1.publicKey.toString());
  console.log("Bob : ", user2.publicKey.toString());
  console.log("Owner : ", owner.publicKey.toString());

  // Create Mints
  const USDCMint = anchor.web3.Keypair.generate();
  const wSolMint = anchor.web3.Keypair.generate();
  const BonkMint = anchor.web3.Keypair.generate();

  await FermiDex.createMint(provider, wSolMint, 9);
  await FermiDex.createMint(provider, USDCMint, 6);
  await FermiDex.createMint(provider, BonkMint, 9);
  // 1. CREATE MARKET -- WORKING
  
  const market1Pdas = await FermiDex.initialiseMarketCustom(owner, connection, wSolMint.publicKey, USDCMint.publicKey);
  const market2Pdas = await FermiDex.initialiseMarketCustom(owner, connection, BonkMint.publicKey, USDCMint.publicKey);

  // 2. Airdrop Tokens -- WORKING
  console.log("AIRDROPPING TOKENS !!");
  console.log("------------------------");

  // Airdrop 1000 USDC to user1 (Alice)
  await FermiDex.airdropCustomToken(
    user1,
    owner,
    connection,
    USDCMint.publicKey,
    BigInt("100000000000")
  ); //1000 * 1000000 decimals

  // Airdrop 500000 BONK to user2 (Bob)
  await FermiDex.airdropCustomToken(
    user2,
    owner,
    connection,
    BonkMint.publicKey,
    BigInt("5000000000000000")
  ); //500000 * 1000000000 decimals

  console.log("sleeping for 20 sec");
  await FermiDex.sleep(20000);
  console.log("Sleep ended !");

  // 3. FETCH TOKEN BALANCE -- WORKING
  console.log("User 1");
  console.log(
    "USDC balance",
    await FermiDex.getTokenBalance(
      user1.publicKey,
      USDCMint.publicKey,
      connection
    )
  );
  //console.log("BONK balance",(await FermiDex.getTokenBalance(user1.publicKey,BonkMint.publicKey,connection)))
  //console.log("WSOL balance",(await FermiDex.getTokenBalance(user1.publicKey,wSolMint.publicKey,connection)))

  console.log("User 2");
  //console.log("USDC balance",(await FermiDex.getTokenBalance(user2.publicKey,USDCMint.publicKey,connection)))
  console.log(
    "BONK balance",
    await FermiDex.getTokenBalance(
      user2.publicKey,
      BonkMint.publicKey,
      connection
    )
  );
  //console.log("WSOL balance",(await FermiDex.getTokenBalance(user2.publicKey,wSolMint.publicKey,connection)))

  // 4. PLACING ORDERS

  // Alice places new Bid on both markets
  // Place Bid on USDC/wSol market
  await FermiDex.placeNewBuyOrderCustom(
    user1,
    1000,
    connection,
    market1Pdas.marketPda,
    wSolMint.publicKey,
    USDCMint.publicKey
  );
  //Place Bid on USDC/Bonk market
  await FermiDex.placeNewBuyOrderCustom(
    user1,
    1000,
    connection,
    market2Pdas.marketPda,
    BonkMint.publicKey,
    USDCMint.publicKey
  );

  //await FermiDex.placeNewBuyOrder(user1, 36, connection);
  //await FermiDex.placeNewSellOrder(user2, 35, connection);

  // Bob places new sell order on Bonk/USDC market, selling 500 USDC worth of Sol at the market price.
  await FermiDex.placeNewSellOrderCustom(
    user2,
    500,
    connection,
    market2Pdas.marketPda,
    BonkMint.publicKey,
    USDCMint.publicKey
  );

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
    market1Pdas.marketPda
  );

  console.log("user2", openOrdersAuthority);
  console.log("user1", openOrdersCounterparty);
  
  const eventQmarket1 = await FermiDex.getParsedEventQCustom(user1, connection,market1Pdas.eventQPda);
  const eventQmarket2 = await FermiDex.getParsedEventQCustom(user1, connection,market2Pdas.eventQPda);
  console.log({eventQmarket1,eventQmarket2});

  const matchedEvents = FermiDex.findMatchingEvents(
    openOrdersAuthority.orders,
    eventQmarket2
  );

  console.log(matchedEvents.entries());

  for (const [orderId, match] of matchedEvents) {
    const { orderIdMatched, orderIdSecondMatched } = match;
    if (!orderIdMatched || !orderIdSecondMatched) continue;
    console.log(
      `GOING TO FINALIZE FOR ORDER ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`
    );

    await FermiDex.finaliseMatchesAskCustom({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection,
      marketPda:market2Pdas.marketPda,
      coinMint:market2Pdas.coinMint,
      pcMint:market2Pdas.pcMint
    });

    await FermiDex.finaliseMatchesBidCustom({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection,
      marketPda:market2Pdas.marketPda,
      coinMint:market2Pdas.coinMint,
      pcMint:market2Pdas.pcMint
    });

    console.log(
      ` ✅SUCCESSFULLY FINALIZED  ${orderId} and events ${orderIdMatched.idx} <-> ${orderIdSecondMatched?.idx}`
    );
  }
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
