import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FermiClient, createMint, getLocalKeypair } from "../src";
import { Wallet, AnchorProvider, BN } from "@coral-xyz/anchor";
import { programId, rpcUrl } from "./constants";

const secretKeyPath = "/Users/dm/.config/solana/id.json";

const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    229, 207, 192, 114, 233, 58, 53, 201, 119, 77, 46, 179, 94, 131, 174, 205,
    54, 177, 178, 55, 62, 42, 240, 50, 60, 78, 34, 14, 181, 90, 90, 57, 181, 45,
    63, 255, 32, 103, 173, 51, 75, 240, 141, 152, 55, 52, 35, 133, 252, 111,
    202, 141, 174, 123, 200, 180, 83, 1, 183, 161, 227, 154, 145, 39,
  ])
);

const main = async () => {
  // const authority = getLocalKeypair(secretKeyPath);
  const authority = OWNER_KEYPAIR
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
