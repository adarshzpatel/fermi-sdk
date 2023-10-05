import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl, programId, marketConstants } from "../config.json";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import getFermiDexProgram from "../src/utils/getFermiDexProgram";

const deposit = async () => {
  const connection = new Connection(rpcUrl);
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json"); // 5TwNSHaijveFjz9pD1qKXvqoU9dRgEAnCWKM8LcbQQ8M

  const program = await getFermiDexProgram(user1,connection)
  console.log(program)

  // const deposit = await FermiDex.depositPcTokens({
  //   connection,
  //   authority: user1,
  //   amount: 100,
  //   marketPda: new PublicKey(marketConstants.marketPda),
  //   pcMint: new PublicKey(marketConstants.pcMint),
  // });
};

(async function () {
  try {
    await deposit();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }
  process.exit(0);
})();
