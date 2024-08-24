import { Market, OpenOrders, OrderToPlace, SideUtils } from "../src";

import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const placeLimitAskAlice = async () => {
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

  await openOrders.placeOrder(orderToPlace).then(() => console.log("Placed bid order successfully"));
};

placeLimitAskAlice().catch((err) => {
  console.log(err);
  process.exit(1);
});
