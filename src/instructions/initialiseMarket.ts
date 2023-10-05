import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { createMint } from "../utils/createMint";
import { IDL } from "../types/IDL";
import { programId } from "../../config.json";


/**
 * Initialises a new market on the Solana blockchain.
 * 
 * @param authority - The keypair that represents the market's authority.
 * @param connection - The Solana network connection object.
 * @returns An object containing various constants related to the initialised market.
 */
export async function initialiseMarket(
  authority: Keypair,
  connection: Connection
) {
  const wallet = new anchor.Wallet(authority);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const program = new anchor.Program(IDL, programId, provider);

  const coinMint = anchor.web3.Keypair.generate();
  const pcMint = anchor.web3.Keypair.generate();

  await createMint(provider, coinMint, 9);
  await createMint(provider, pcMint, 6);

  const [marketPda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("market", "utf-8"),
      coinMint.publicKey.toBuffer(),
      pcMint.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
    program.programId
  );

  const [reqQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );

  const coinVault = await spl.getAssociatedTokenAddress(
    coinMint.publicKey,
    marketPda,
    true
  );
  const pcVault = await spl.getAssociatedTokenAddress(
    pcMint.publicKey,
    marketPda,
    true
  );

  await program.methods
    .initializeMarket(new anchor.BN("1000000000"), new anchor.BN("1000000"))
    .accounts({
      market: marketPda,
      coinVault,
      pcVault,
      coinMint: coinMint.publicKey,
      pcMint: pcMint.publicKey,
      bids: bidsPda,
      asks: asksPda,
      reqQ: reqQPda,
      eventQ: eventQPda,
      authority: authority.publicKey,
    })
    .signers([authority])
    .rpc();

  const marketConstants = {
    programId: programId,
    marketPda: marketPda,
    coinVault: coinVault,
    pcVault: pcVault,
    coinMint: coinMint.publicKey,
    pcMint: pcMint.publicKey,
    bidsPda: bidsPda,
    asksPda: asksPda,
    reqQPda: reqQPda,
    eventQPda: eventQPda,
    authority: authority.publicKey,
  };

  console.log(
    "New market initilalized ✨",
    JSON.stringify(marketConstants, null, 2)
  );

  // const fileContentString = `{
  //     "rpcUrl":"${connection.rpcEndpoint}",
  //     "programId:"${programId}",
  //     "marketConstants:{
  //       ${Object.entries(marketConstants).map(([key, value]) => `${key} = "${value}";`)
  //       .join("\n")}
  //     }
  //   }
  // `;

  // const CONSTANTS_FILE_PATH = `./constants.json`;

  // // write to file
  // fs.writeFile(CONSTANTS_FILE_PATH, fileContentString, (err) => {
  //   if (err) {
  //     console.error("Error writing to the file:", err);
  //   } else {
  //     console.log(
  //       `Constants file '${CONSTANTS_FILE_PATH}' generated successfully.`
  //     );
  //   }
  // });
  return marketConstants;
}

export async function initialiseMarketCustom(
  authority: Keypair,
  connection: Connection,
  coinMint: PublicKey,
  pcMint: PublicKey,
) {
  const wallet = new anchor.Wallet(authority);
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const program = new anchor.Program(IDL, programId, provider);

  //const coinMint = anchor.web3.Keypair.generate();
  //const pcMint = anchor.web3.Keypair.generate();

  //await createMint(provider, coinMint, 9);
  //await createMint(provider, pcMint, 6);

  const [marketPda] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("market", "utf-8"),
      coinMint.toBuffer(),
      pcMint.toBuffer(),
    ],
    program.programId
  );


  const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
    program.programId
  );

  const [reqQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );
  const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
    program.programId
  );

  const coinVault = await spl.getAssociatedTokenAddress(
    coinMint,
    marketPda,
    true
  );
  const pcVault = await spl.getAssociatedTokenAddress(
    pcMint,
    marketPda,
    true
  );

  await program.methods
    .initializeMarket(new anchor.BN("1000000000"), new anchor.BN("1000000"))
    .accounts({
      market: marketPda,
      coinVault,
      pcVault,
      coinMint: coinMint,
      pcMint: pcMint,
      bids: bidsPda,
      asks: asksPda,
      reqQ: reqQPda,
      eventQ: eventQPda,
      authority: authority.publicKey,
    })
    .signers([authority])
    .rpc();

  const marketConstants = {
    programId: programId,
    marketPda: marketPda,
    coinVault: coinVault,
    pcVault: pcVault,
    coinMint: coinMint,
    pcMint: pcMint,
    bidsPda: bidsPda,
    asksPda: asksPda,
    reqQPda: reqQPda,
    eventQPda: eventQPda,
    authority: authority.publicKey,
  };

  console.log(
    "New market initilalized ✨",
    JSON.stringify(marketConstants, null, 2)
  );

  // const fileContentString = `{
  //     "rpcUrl":"${connection.rpcEndpoint}",
  //     "programId:"${programId}",
  //     "marketConstants:{
  //       ${Object.entries(marketConstants).map(([key, value]) => `${key} = "${value}";`)
  //       .join("\n")}
  //     }
  //   }
  // `;

  // const CONSTANTS_FILE_PATH = `./constants.json`;

  // // write to file
  // fs.writeFile(CONSTANTS_FILE_PATH, fileContentString, (err) => {
  //   if (err) {
  //     console.error("Error writing to the file:", err);
  //   } else {
  //     console.log(
  //       `Constants file '${CONSTANTS_FILE_PATH}' generated successfully.`
  //     );
  //   }
  // });
  return marketConstants;
}
