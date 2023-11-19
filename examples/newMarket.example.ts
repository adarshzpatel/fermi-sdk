
import { Connection, Keypair } from "@solana/web3.js";
import * as FermiDex from "../src"
import { rpcUrl } from "../config.json";
import * as os from 'os';
import * as path from 'path';

const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, '.config/solana/id.json');

const createNewMarket = async () => {
  const authority = Keypair.fromSecretKey(
    Uint8Array.from([
      1, 60, 46, 125, 82, 22, 178, 15, 93, 247, 249, 207, 76, 156, 177, 42, 124,
      17, 225, 67, 204, 111, 68, 38, 71, 16, 206, 114, 165, 219, 70, 72, 134, 112,
      118, 222, 227, 101, 128, 158, 70, 17, 179, 29, 31, 208, 236, 211, 12, 89,
      41, 84, 52, 209, 127, 51, 144, 164, 103, 219, 20, 253, 3, 158,
    ])
  );
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