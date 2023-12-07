import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import * as os from "os";
import * as path from "path";
import {markets} from "./markets"

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, ".config/solana/id.json");

const airdropTokens = async () => {
  const owner = FermiDex.getLocalKeypair(solanaConfigPath); // authority keypair of market owner
  const connection = new Connection(rpcUrl);
  const currentMarket = markets[0];
  console.log(owner);
  // Airdrop to user 1

  const bobKp = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  const aliceKp = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");


  // AIRDROP TOKENS TO BOB
  // airdrop coin tokens
  await FermiDex.airdropToken({
    receiverPk: bobKp.publicKey,
    amount: 1000 * (10 ** 9),
    connection,
    mint: new PublicKey(currentMarket.coinMint),
    ownerKp: owner,
  });

  // airdrop pc acccounts
  await FermiDex.airdropToken({
    receiverPk: bobKp.publicKey,
    amount: 1000 * (10 ** 6),
    connection,
    mint: new PublicKey(currentMarket.pcMint),
    ownerKp: owner,
  });

  // AIRDROP TOKENS TO ALICE
  await FermiDex.airdropToken({
    receiverPk: aliceKp.publicKey,
    amount: 1000 * (10 ** 9),
    connection,
    mint: new PublicKey(currentMarket.coinMint),
    ownerKp: owner,
  });

  // airdrop pc acccounts
  await FermiDex.airdropToken({
    receiverPk: aliceKp.publicKey,
    amount: 1000 * (10 ** 6),
    connection,
    mint: new PublicKey(currentMarket.pcMint),
    ownerKp: owner,
  });


};

(async function () {
  try {
    await airdropTokens();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();
