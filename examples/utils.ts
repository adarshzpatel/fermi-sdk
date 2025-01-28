import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  EventHeapAccount,
  FermiClient,
  FillEvent,
  OutEvent,
  getLocalKeypair,
} from "../src";
import { liquidityVaultProgramId, programId, rpcUrl } from "./constants";
import { LiquidityVaultClient } from "../src/liquidity_vault/client";

// Function to initilize the client with the keypair path
export const initClientWithKeypairPath = (path: string) => {
  const authority = getLocalKeypair(path);

  // wrap authority keypair in an anchor wallet
  const wallet = new Wallet(authority);

  const conn = new Connection(rpcUrl);
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "finalized",
  });
  const client = new FermiClient(provider, new PublicKey(programId), {
    postSendTxCallback: (tx) =>
      console.log(
        "Tx Sent:",
        `https://solana.fm/tx/${tx.txid}?cluster=devnet-alpha`
      ),
  });
  console.log("Client initialized", client);
  return client;
};

// Function to parse the event heap into readable format
export const parseEventHeap = (
  client: FermiClient,
  eventHeap: EventHeapAccount | null
) => {
  if (eventHeap == null) throw new Error("Event Heap not found");
  const fillEvents: any = [];
  const outEvents: any = [];
  const fillDirectEvents: any = [];

  if (eventHeap !== null) {
    // find nodes having eventType = 2
    (eventHeap.nodes as any).forEach((node: any, i: number) => {
      if (node.event.eventType === 2) {
        const fillDirectEvent: any = client.program.coder.types.decode(
          "FillEventDirect",
          Buffer.from([0, ...node.event.padding])
        );
        if (fillDirectEvent.timestamp.toString() !== "0") {
          fillDirectEvents.push({
            ...fillDirectEvent,
            index: i,
            maker: fillDirectEvent.maker.toString(),
            taker: fillDirectEvent.taker.toString(),
            price: fillDirectEvent.price.toString(),
            quantity: fillDirectEvent.quantity.toString(),
            makerClientOrderId: fillDirectEvent.makerClientOrderId.toString(),
            takerClientOrderId: fillDirectEvent.takerClientOrderId.toString(),
          });
        }
      } else if (node.event.eventType === 0) {
        const fillEvent: FillEvent = client.program.coder.types.decode(
          "FillEvent",
          Buffer.from([0, ...node.event.padding])
        );
        if (fillEvent.timestamp.toString() !== "0") {
          fillEvents.push({
            ...fillEvent,
            index: i,
            maker: fillEvent.maker.toString(),
            taker: fillEvent.taker.toString(),
            price: fillEvent.price.toString(),
            quantity: fillEvent.quantity.toString(),
            makerClientOrderId: fillEvent.makerClientOrderId.toString(),
            takerClientOrderId: fillEvent.takerClientOrderId.toString(),
          });
        }
      } else if (node.event.eventType === 1) {
        const outEvent: OutEvent = client.program.coder.types.decode(
          "OutEvent",
          Buffer.from([0, ...node.event.padding])
        );

        if (outEvent.timestamp.toString() !== "0")
          outEvents.push({ ...outEvent, index: i });
      }
    });
  }

  return { fillEvents, outEvents, fillDirectEvents };
};

export const initLiquidityVaultClient = (path: string) => {
  const authority = getLocalKeypair(path);
  const wallet = new Wallet(authority);
  const conn = new Connection(rpcUrl);

  const provider = new AnchorProvider(conn, wallet, {
    commitment: "confirmed",
  });

  return new LiquidityVaultClient(
    provider,
    new PublicKey(liquidityVaultProgramId),
    {
      postSendTxCallback: (tx) =>
        console.log(
          "Tx Sent:",
          `https://solana.fm/tx/${tx.txid}?cluster=devnet-alpha`
        ),
    }
  );
};
