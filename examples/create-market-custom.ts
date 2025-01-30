import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { FermiClient, createMint, getLocalKeypair } from "../src";
import { OWNER_KEYPAIR, programId, rpcUrl } from "./constants";

const secretKeyPath = "/Users/dm/.config/solana/id.json";


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
  const baseMint = new PublicKey("41386d3KTCZKteGXoMQNNueWqs6KY5kG3KsA48z5X577");
  /* Created test mint: 5sbpKP3FqsThf7gs7S4jFjpeAmdC8Xn5kY49JjYY7gcS
vaultStatePda: AKegYwThcAHX1MWp3VkbgQdfdbhTea26fWHa2mBorSQ8
vaultAuthPda: 65F3sF2awXh8PktKhiqoGjFg6kbfg1kBf2Pc4xsAQHxM bump = 254
vaultTokenAccPda: HB6y4LU5K4aEVTFs7tv8HXuhL2kNCiob8Sstv3rDWZaQ bump = 254
Vault initialized successfully.
vaultState.tokenMint: GyYpDrcbxPCDJeHefJGw2D8cRcKudTWPdfnpenmErP7a
vaultState.whitelistedProgram: D1MCk3t8B6Cp1GnUnNkKBtMS5iXG4FEq4U3yNvJgtdDz*/

  // Define market parameter
  const quoteLotSize = new BN(1000000);
  const baseLotSize = new BN(10000000);
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
