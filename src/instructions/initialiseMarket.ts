import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { programId } from "../../config.json";
import getFermiDexProgram from "../utils/getFermiDexProgram";


export async function intialiseMarket(
  authority: Keypair,
  connection: Connection,
  coinMint: PublicKey,
  pcMint: PublicKey,
) {
  const program = getFermiDexProgram(authority,connection);

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
