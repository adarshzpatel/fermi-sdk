import { checkOrCreateAssociatedTokenAccount, getLocalKeypair } from "../src";

import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initClientWithKeypairPath } from "./utils";
import { marketPda } from "./constants";

const main = async () => {
  const client = initClientWithKeypairPath("./test-keypairs/bob/key.json");

  const market = await client.deserializeMarketAccount(
    new PublicKey(marketPda)
  );

  console.log("Authority client : ", client.walletPk.toString());

  if (market == null) throw new Error("Market not found");
  const provider = client.provider;

  const makerpubkey = getLocalKeypair("./test-keypairs/bob/key.json").publicKey;

  const takerpubkey = getLocalKeypair(
    "./test-keypairs/alice/key.json"
  ).publicKey;

  /**
   *  For Ask side, maker ata should be for base token, taker ata for quote token.
   *  For Bid side, maker ata should be for quote token, taker ata for base token.
   */

  const makerAtaPubKey = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.quoteMint,
      makerpubkey
    )
  );
  const takerAtaPubKey = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      provider,
      market.baseMint,
      takerpubkey
    )
  );

  const slotsToConsume = new BN(0);
  const limit = new BN(2);

  const makerOpenOrders = (
    await client.findOpenOrdersForMarket(makerpubkey, new PublicKey(marketPda))
  )[0];
  const takerOpenOrders = (
    await client.findOpenOrdersForMarket(takerpubkey, new PublicKey(marketPda))
  )[0];

  const args = {
    marketPublicKey: new PublicKey(marketPda),
    marketAuthority: market.marketAuthority,
    eventHeapPublicKey: market.eventHeap,
    makerAtaPublicKey: makerAtaPubKey,
    takerAtaPublicKey: takerAtaPubKey,
    marketVaultBasePublicKey: market.marketBaseVault,
    marketVaultQuotePublicKey: market.marketQuoteVault,
    maker: makerOpenOrders,
    taker: takerOpenOrders,
    slotsToConsume,
    limit
  };
  console.log(args);

  const [ixs, signers] = await client.createFinalizeGivenEventsInstruction(
    args.marketPublicKey,
    args.marketAuthority,
    args.eventHeapPublicKey,
    args.makerAtaPublicKey,
    args.takerAtaPublicKey,
    args.marketVaultBasePublicKey,
    args.marketVaultQuotePublicKey,
    args.maker,
    args.taker,
    args.slotsToConsume
  );

  await client.sendAndConfirmTransaction(ixs, {});
  console.log("Finalised successfully");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
