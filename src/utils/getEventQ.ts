

import * as anchor from "@project-serum/anchor"
import {programId,marketConstants} from "../../config.json"
import {Connection, Keypair} from "@solana/web3.js"
import { Event, IDL } from "types";


const parseEventQ = (eventQ:any) => {
  const events:Event[] = [] 
  for(let i = 0;i<(eventQ.buf as any[]).length;i++){
    const e = eventQ.buf[i];
    if(e.orderId.toString() === '0') continue
    const event:Event= {} as Event
    event['idx'] = i;
    event['orderId'] = e.orderId.toString()
    event['orderIdSecond'] = e.orderIdSecond.toString();
    event['owner'] = e.owner.toString();
    event['eventFlags'] = e.eventFlags
    event['ownerSlot'] = e.ownerSlot
    event['finalised'] = e.finalised 
    event['nativeQtyReleased'] = e.nativeQtyReleased.toString()
    event['nativeQtyPaid'] = e.nativeQtyPaid.toString()
    events.push(event)
  }
  return events;
}


export async function getEventQ(keypair:Keypair,connection:Connection){
  const {eventQPda} = marketConstants
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );
  const program = new anchor.Program(IDL, programId, provider);
  const eventQ = await program.account.eventQueue.fetch(eventQPda);

  return parseEventQ(eventQ);

}