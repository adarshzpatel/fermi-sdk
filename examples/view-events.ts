import { initClientWithKeypairPath, parseEventHeap } from "./utils";

import { PublicKey } from "@solana/web3.js";
import { marketPda } from "./constants";

/**
 * Vew events from the event heap
 */
const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");
  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market === null) throw new Error("Market not found");

  const eventHeapAcc = await client.deserializeEventHeapAccount(market.eventHeap)
  const parsedEvents = eventHeapAcc && parseEventHeap(client,eventHeapAcc)
  console.log(parsedEvents)

};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
