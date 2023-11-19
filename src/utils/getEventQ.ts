import * as anchor from "@project-serum/anchor";
import { programId } from "../../config.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { EventQueue, EventQueueItem, IDL } from "../types";
import getFermiDexProgram from "./getFermiDexProgram";

type FetchEventQueueParams = {
  authority: Keypair;
  marketPda: PublicKey;
  connection: Connection;
};

// Returns a raw event queue from blockchain
export async function fetchRawEventQ({
  authority,
  marketPda,
  connection,
}: FetchEventQueueParams) {
  const program = getFermiDexProgram(authority, connection);
  const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const eventQ = await program.account.eventQueue.fetch(eventQPda);
  return eventQ;
}

// Returns a parse readable eventQueue
export async function getParsedEventQ({
  authority,
  marketPda,
  connection,
}: FetchEventQueueParams) {
  const eventQ = await fetchRawEventQ({ authority, marketPda, connection });
  return parseEventQ(eventQ.buf);
}

export async function getRawEventQCustom(
  keypair: Keypair,
  connection: Connection,
  eventQPda: PublicKey
) {
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, programId, provider);
  const eventQ = await program.account.eventQueue.fetch(eventQPda);

  return eventQ;
}

export async function getParsedEventQCustom(
  keypair: Keypair,
  connection: Connection,
  eventQPda: PublicKey
) {
  const eventQ = await getRawEventQCustom(keypair, connection, eventQPda);
  return parseEventQ(eventQ.buf);
}

function parseEventQ(eventQ: any) {
  const events:EventQueue = [];
  for (let i = 0; i < (eventQ as any[]).length; i++) {
    const e = eventQ[i];
    if (e.orderId.toString() === "0") continue;
    const event: EventQueueItem = {} as EventQueueItem;
    event["idx"] = i;
    event["orderId"] = e.orderId.toString();
    event["orderIdSecond"] = e.orderIdSecond.toString();
    event["owner"] = e.owner.toString();
    event["eventFlags"] = e.eventFlags;
    event["ownerSlot"] = e.ownerSlot;
    event["finalised"] = e.finalised;
    event["nativeQtyReleased"] = e.nativeQtyReleased.toString();
    event["nativeQtyPaid"] = e.nativeQtyPaid.toString();
    event["timestamp"] = new Date(
      e.timestamp.toNumber() * 1000
    ).toLocaleString();
    events.push(event);
  }
  return events;
}
