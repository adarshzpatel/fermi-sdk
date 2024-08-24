import { initClientWithKeypairPath, initReadOnlyClient } from "./utils";

import { BN } from "@coral-xyz/anchor";
import { Market } from "../src";
import { PublicKey } from "@solana/web3.js";
import { marketPda } from "./constants";

const main = async () => {
  const client = initReadOnlyClient();
  const market = await Market.load(client, new PublicKey(marketPda));

  if (market === null) throw new Error("Market not found");
  await market.loadOrderBook();

  const bids = market.bids?.fixedItems();
  if (bids) {
    for (const bid of bids) {
      console.log(bid.leafNode.key.toString());
    }
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
