import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import {
  EventHeapAccount,
  FermiClient,
  FillEvent,
  OutEvent,
  createAssociatedTokenAccount,
  getLocalKeypair,
  mintTo,
} from "../src";
import * as spl from "@solana/spl-token";
import { programId, rpcUrl } from "./constants";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, type Keypair } from "@solana/web3.js";

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



interface AirdropTokenParams {
  receiverPk: PublicKey;
  ownerKp: Keypair;
  connection: Connection;
  mint: PublicKey;
  amount: number;
}

export async function airdropToken({
  receiverPk,
  ownerKp,
  connection,
  mint,
  amount,
}: AirdropTokenParams): Promise<void> {
  try {
    const wallet = new anchor.Wallet(ownerKp);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );

    const receiverTokenAccount: PublicKey = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(mint),
      receiverPk,
      false
    );

    if ((await connection.getAccountInfo(receiverTokenAccount)) == null) {
      console.log("ATA not found, creating one...");
      await createAssociatedTokenAccount(
        provider,
        new anchor.web3.PublicKey(mint),
        receiverTokenAccount,
        receiverPk
      );
      console.log("✅ ATA created for ", receiverPk.toString());
    }

    await mintTo(
      provider,
      new anchor.web3.PublicKey(mint),
      receiverTokenAccount,
      BigInt(amount.toString())
    );

    console.log(
      "✅ Tokens minted successfully to ",
      receiverTokenAccount.toString()
    );

    // return receiverTokenAccount;
  } catch (err) {
    console.log("Something went wrong while airdropping coin token.");
    console.log(err);
  }
}

