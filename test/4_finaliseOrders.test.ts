import { Connection } from "@solana/web3.js";
import {rpcUrl} from "../config.json"
import * as FermiDex from "../src"

describe("Finalise orders",()=>{
  it("should finalize orders",async()=>{
    const connection = new Connection(rpcUrl);
    const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
    const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
    const authority = user2;
    const counterparty = user1;
    const openOrdersAuthority = await FermiDex.getOpenOrders(authority, connection);
    const openOrdersCounterparty = await FermiDex.getOpenOrders(counterparty, connection);
    const eventQ = await FermiDex.getParsedEventQ(user1, connection);
    const matchedEvents = FermiDex.findMatchingEvents(
      openOrdersAuthority.orders,
      eventQ
    );
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
  })
})