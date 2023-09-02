
import { Connection } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import * as os from 'os';
import * as path from 'path';

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, '.config/solana/id.json');

const createNewMarket = async () => {
  const authority = FermiDex.getLocalKeypair(solanaConfigPath);
  console.log("authority",authority.publicKey.toString())
  const connection = new Connection(rpcUrl)
  const market = await FermiDex.initialiseMarket(authority,connection);
  console.log(market);
}

(async function () {
  try {
    await createNewMarket();
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();