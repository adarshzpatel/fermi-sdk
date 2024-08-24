import { Market, OpenOrders, OrderToPlace, SideUtils } from "../src";

import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const placeLimitAskBob = async () => {
  const bobClient = initClientWithKeypairPath("./test-keypairs/bob/key.json");

  const market = await Market.load(bobClient, new PublicKey(marketPda));

  if (market === null) throw new Error("Market not found");

  const openOrders = await OpenOrders.loadNullableForMarketAndOwner(
    market,
    bobClient.walletPk
  );
  if (!openOrders) throw new Error("Open orders account not found");

  const orderToPlace: OrderToPlace = {
    side: SideUtils.Ask,
    price: market.tickSize,
    size: market.minOrderSize,
  };

  await openOrders.placeOrder(orderToPlace).then(() => console.log("Placed ask order successfully"));
};

placeLimitAskBob().catch((err) => {
  console.log(err);
  process.exit(1);
});
