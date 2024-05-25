import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FermiClient, createMint, getLocalKeypair } from "../src";
import { OWNER_KEYPAIR, programId, rpcUrl } from "./constants";

const secretKeyPath = "/Users/Zero/.config/solana/id.json";



const main = async () => {
  // const authority = getLocalKeypair(secretKeyPath);
  const authority = OWNER_KEYPAIR
  const payer = authority;
  console.log("Authority Public Key:", payer.publicKey.toString());
  
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
