import { Connection } from "@solana/web3.js";
import { finaliseMatchesAsk, finaliseMatchesBid, findMatchingEvents, getLocalKeypair, getOpenOrders, getParsedEventQ } from "../src";
import {rpcUrl} from "../config.json"

describe("Finalise orders",()=>{
  it("should finalize orders",async()=>{
    const connection = new Connection(rpcUrl)
    const user1 = getLocalKeypair("./test-keypairs/user1/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M
    const user2 = getLocalKeypair("./test-keypairs/user2/key.json"); // D1MCk3t8B6Cp1GnUnNkKBtMS5iXG4FEq4U3yNvJgtdD
    const eventQ = await getParsedEventQ(user1,connection);
    
    
    const openOrdersUser1 = await getOpenOrders(user1,connection); 
    const openOrdersUser2 = await getOpenOrders(user2,connection);

    const matchedEventsUser2 = findMatchingEvents(openOrdersUser2.orders,eventQ);

    console.log("Finalizing orders with kp3 as authority");
    
    matchedEventsUser2.forEach(async (match,orderId)=>{

      const {orderIdMatched,orderIdSecondMatched} = match;
      if(!orderIdMatched || !orderIdSecondMatched) throw new Error(`Couldn't find match for ${orderId}`);
      const finalizeAskTx = await finaliseMatchesAsk({
        eventSlot1:orderIdSecondMatched?.idx,
        eventSlot2:orderIdMatched?.idx,
        authority:user2,
        authoritySecond:user1,
        openOrdersOwnerPda:openOrdersUser2.pda,
        openOrdersCounterpartyPda:openOrdersUser1.pda,
        connection:connection
      });

      console.log("Ask side finalized :",finalizeAskTx)
      const finalizeBidTx = await finaliseMatchesBid({
        eventSlot1:orderIdSecondMatched.idx,
        eventSlot2:orderIdMatched.idx,
        authority:user2,
        authoritySecond:user1,
        openOrdersOwnerPda:openOrdersUser2.pda,
        openOrdersCounterpartyPda:openOrdersUser1.pda,
        connection:connection
      });
      console.log("Bid side finalized :",finalizeBidTx)

      console.log(`Order id ${orderId} finalized successfully with events ${orderIdSecondMatched.idx} <-> ${orderIdMatched.idx}`)
    })
  })
})