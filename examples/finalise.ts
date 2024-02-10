import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";
import { BN } from "@coral-xyz/anchor";
import { checkOrCreateAssociatedTokenAccount, getLocalKeypair } from "../src";


const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/alice/key.json");
  const market = await client.deserializeMarketAccount(new PublicKey(marketPda))

  if(market == null) throw new Error("Market not found")
  const provider = client.provider
  const makerpubkey = getLocalKeypair("./test-keypairs/alice/key.json").publicKey
  const takerpubkey = getLocalKeypair("./test-keypairs/bob/key.json").publicKey

  const makerAtaPubKey = new PublicKey(await checkOrCreateAssociatedTokenAccount(provider, market.baseMint, makerpubkey));
  const takerAtaPubKey = new PublicKey(await checkOrCreateAssociatedTokenAccount(provider, market.baseMint, takerpubkey));

  const slotsToConsume = new BN(1)
  const makerOpenOrders = (await client.findOpenOrdersForMarket(client.walletPk, new PublicKey(marketPda)))[0]
  console.log("maker open orders",makerOpenOrders.toString())
  const args = {
    marketPda: new PublicKey(marketPda),
    marketAuthority: market.marketAuthority.toString(),
    eventHeap: market.eventHeap.toString(),
    makerAtaPubKey:makerAtaPubKey.toString(),
    takerAtaPubKey:takerAtaPubKey.toString()  ,
    marketBaseVault: market.marketBaseVault.toString(),
    marketQuoteVault: market.marketQuoteVault.toString(),
    makerOpenOrders:makerOpenOrders.toString(),
    slotsToConsume:slotsToConsume.toString()
  }
  console.log(args)

  const [ix] = await client.createFinalizeEventsInstruction(
    new PublicKey(marketPda),
    market.marketAuthority,
    market.eventHeap,
    makerAtaPubKey,
    takerAtaPubKey,
    market.marketBaseVault,
    market.marketQuoteVault,
    makerOpenOrders,
    slotsToConsume
  );

  await client.sendAndConfirmTransaction([ix],{}).then((res) =>console.log("Finalised"))
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
