

import * as anchor from "@project-serum/anchor"
import {programId,marketConstants} from "../../config.json"
import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import { Event, IDL } from "../types";


const parseEventQ = (eventQ:any) => {
  const events:Event[] = [] 
  for(let i = 0;i<(eventQ as any[]).length;i++){
    const e = eventQ[i];
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
    event['timestamp'] = new Date(e.timestamp.toNumber()*1000).toLocaleString()
    events.push(event)
  }
  return events;
}

export async function getRawEventQ(keypair:Keypair,connection:Connection){
  const {eventQPda} = marketConstants
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );
  const program = new anchor.Program(IDL, programId, provider);
  const eventQ = await program.account.eventQueue.fetch(eventQPda);

  return eventQ;
}

export async function getParsedEventQ(keypair:Keypair,connection:Connection){
  const eventQ = await getRawEventQ(keypair,connection);
  return parseEventQ(eventQ.buf);
}

export async function getRawEventQCustom(keypair:Keypair,connection:Connection,eventQPda:PublicKey){
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  );
  const program = new anchor.Program(IDL, programId, provider);
  const eventQ = await program.account.eventQueue.fetch(eventQPda);

  return eventQ;
}

export async function getParsedEventQCustom(keypair:Keypair,connection:Connection,eventQPda:PublicKey){
  const eventQ = await getRawEventQCustom(keypair,connection,eventQPda);
  return parseEventQ(eventQ.buf);
}