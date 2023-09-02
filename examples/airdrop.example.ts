
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import * as os from 'os';
import * as path from 'path';

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, '.config/solana/id.json');

const airdropTokens = async () => {
  const owner = FermiDex.getLocalKeypair(solanaConfigPath); // authority keypair of market owner
  const connection = new Connection(rpcUrl);

  // Airdrop to user 1
  const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
  await FermiDex.airdropPcToken(user1, owner, connection)
  await FermiDex.airdropCoinToken(user1, owner, connection)

}

(async function() {
  try {
    await airdropTokens();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();
