import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/alice/key.json");
  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );
  if (market === null) throw new Error("Market not found");

  const bidsAcc = await client.deserializeBookSide(market.bids);
  const asksAcc = await client.deserializeBookSide(market.asks);
  const bids =
    bidsAcc &&
    client.getLeafNodes(bidsAcc).map((bid) => ({
      ...bid,
      key: bid.key.toString(),
      price: new BN(bid.key).shrn(64).toString(),
    }));
  const asks =
    asksAcc &&
    client.getLeafNodes(asksAcc).map((ask) => ({
      ...ask,
      key: ask.key.toString(),
      price: new BN(ask.key).shrn(64).toString(),
    }));

  const stringifiedBids = bids?.map((bid) =>
    Object.keys(bid).map((key) => `${key} : ${bid[key].toString()}`)
  );
  const stringifiedAsks = asks?.map((ask) =>
    Object.keys(ask).map((key) => `${key} : ${ask[key].toString()}`)
  );

  const orderbook = { bids:stringifiedBids, asks:stringifiedAsks };
  console.log(orderbook)
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
