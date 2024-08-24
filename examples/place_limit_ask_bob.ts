import { Market, OpenOrders, OrderToPlace, SideUtils } from "../src";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
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
    price: market.tickSize * 2, // Example: setting ask price higher than bid
    size: market.minOrderSize,
  };

  console.log("orderToPlace.price", orderToPlace.price.toString());
  console.log("orderToPlace.size", orderToPlace.size.toString());

  await openOrders.placeOrder(orderToPlace);
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
