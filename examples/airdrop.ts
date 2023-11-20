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
  // Airdrop to user 1
  console.log("airdropping to user 1");
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  
  // airdrop coin tokens
  await FermiDex.airdropToken({
    receiverPk: user1.publicKey,
    amount: 100000,
    connection,
    mint: new PublicKey(currentMarket.coinMint),
    ownerKp: owner,
  });

  // airdrop pc acccounts
  await FermiDex.airdropToken({
    receiverPk: owner.publicKey,
    amount: 100000,
    connection,
    mint: new PublicKey(currentMarket.coinMint),
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
