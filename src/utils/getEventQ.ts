import * as anchor from "@project-serum/anchor";
import { programId } from "../../config.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { EventQueue, EventQueueItem, FermiDex, IDL } from "../types";
import getFermiDexProgram from "./getFermiDexProgram";

type FetchEventQueueParams = {
  marketPda: PublicKey;
  program: anchor.Program<FermiDex>;
};

// Returns a raw event queue from blockchain
export async function fetchRawEventQ({
  marketPda,
  program,
}: FetchEventQueueParams) {

  const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const eventQ = await program.account.eventQueue.fetch(eventQPda);
  return eventQ;
}

// Returns a parse readable eventQueue
export async function getParsedEventQ({
  marketPda,
  program,
}: FetchEventQueueParams) {
  const eventQ = await fetchRawEventQ({ marketPda, program });
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
