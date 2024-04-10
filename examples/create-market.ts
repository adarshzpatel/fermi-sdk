import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FermiClient, createMint, getLocalKeypair } from "../src";
import { Wallet, AnchorProvider, BN } from "@coral-xyz/anchor";
import { programId, rpcUrl } from "./constants";

const secretKeyPath = "/Users/zero/.config/solana/id.json";

const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
    17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
    118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
    41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
  ])
);

const main = async () => {
  const authority = getLocalKeypair(secretKeyPath);
  // const authority = OWNER_KEYPAIR
  const payer = authority;
  console.log("Authority Public Key:", OWNER_KEYPAIR.publicKey.toString());
  // wrap authority keypair in an anchor wallet
  const wallet = new Wallet(authority);

  const conn = new Connection(rpcUrl);
  const provider = new AnchorProvider(conn, wallet, {
    commitment: "confirmed",
  });
  const client = new FermiClient(provider, new PublicKey(programId));
  const coinMint = Keypair.generate();
  const pcMint = Keypair.generate();

  await createMint(provider, coinMint, 9);
  await createMint(provider, pcMint, 6);

  const quoteMint = new PublicKey(coinMint.publicKey.toBase58());
  const baseMint = new PublicKey(pcMint.publicKey.toBase58());

  // Define market parameter
  const quoteLotSize = new BN(1000000);
  const baseLotSize = new BN(1000000000);
  const makerFee = new BN(0);
  const takerFee = new BN(0);
  const timeExpiry = new BN(0);

  const [
    [bidIx, askIx, eventHeapIx, ix],
    [market, bidsKeypair, askKeypair, eventHeapKeypair],
  ] = await client.createMarketIx(
    payer.publicKey,
    "Market Name",
    quoteMint,
    baseMint,
    quoteLotSize,
    baseLotSize,
    makerFee,
    takerFee,
    timeExpiry,
    null, // oracleA
    null, // oracleB
    null, // openOrdersAdmin
    null, // consumeEventsAdmin
    null // closeMarketAdmin
  );

  console.log("Creating New Market....");
  await client.sendAndConfirmTransaction([bidIx, askIx, eventHeapIx, ix], {
    additionalSigners: [
      payer,
      market,
      bidsKeypair,
      askKeypair,
      eventHeapKeypair,
    ],
  });

  console.log("New Market created:", market.publicKey.toString());
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
