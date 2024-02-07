import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";
import { BN } from "@coral-xyz/anchor";

const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");
  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market === null) throw new Error("Market not found");

  const bidsAcc = await client.deserializeBookSide(market.bids);
  const asksAcc = await client.deserializeBookSide(market.asks);
  const bids =
    bidsAcc &&
    client
      .getLeafNodes(bidsAcc)
      .map((bid) => ({
        ...bid,
        key: bid.key.toString(),
        price: new BN(bid.key).shrn(64).toString(),
      }));
  const asks =
    asksAcc &&
    client
      .getLeafNodes(asksAcc)
      .map((ask) => ({
        ...ask,
        key: ask.key.toString(),
        price: new BN(ask.key).shrn(64).toString(),
      }));
  const orderbook = { bids, asks };
  console.log("Orderbook", JSON.stringify(orderbook, null, 2));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
