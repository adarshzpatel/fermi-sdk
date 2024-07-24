import { Market } from "../src";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

/**
 * View events from the event heap
 */
const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");
  const market = await Market.load(client, new PublicKey(marketPda));
  await market.loadOrderBook();
  await market.loadEventHeap();
  
  console.log(market.eventHeap?.parsedEvents());
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
