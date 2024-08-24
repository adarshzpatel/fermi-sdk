import { Market, OpenOrders, OrderToPlace, SideUtils } from "../src";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
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
    price: market.tickSize * 1.5, // Example: setting bid price slightly higher
    size: market.minOrderSize * 1.5, // Example: setting size slightly larger
  };

  console.log("orderToPlace.price", orderToPlace.price.toString());
  console.log("orderToPlace.size", orderToPlace.size.toString());

  await openOrders.placeOrder(orderToPlace);
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
