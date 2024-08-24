import { Market, OpenOrders, OrderToPlace, SideUtils } from "../src";

import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const placeLimitBidAlice = async () => {
  const aliceClient = initClientWithKeypairPath(
    "./test-keypairs/alice/key.json"
  );

  const market = await Market.load(aliceClient, new PublicKey(marketPda));

  if (market === null) throw new Error("Market not found");

  const openOrders = await OpenOrders.loadNullableForMarketAndOwner(
    market,
    aliceClient.walletPk
  );
  if (!openOrders) throw new Error("Open orders account not found");

  const orderToPlace: OrderToPlace = {
    side: SideUtils.Bid,
    price: market.tickSize,
    size: market.minOrderSize,
  };

  console.log("orderToPlace.price", orderToPlace.price.toString());
  console.log("orderToPlace.size", orderToPlace.size.toString());

  await openOrders
    .placeOrder(orderToPlace)
    .then(() => console.log("Placed bid order successfully"));
};

placeLimitBidAlice().catch((err) => {
  console.log(err);
  process.exit(1);
});
