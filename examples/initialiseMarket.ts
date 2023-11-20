import { Connection, Keypair } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import * as os from "os";
import * as path from "path";
import { AnchorProvider, Wallet } from "@project-serum/anchor";


const homeDirectory = os.homedir();
const solanaConfigPath = path.join(homeDirectory, ".config/solana/id.json");

// initialise a new market
const createNewMarket = async () => {
  const authority = FermiDex.getLocalKeypair(solanaConfigPath);
  const connection = new Connection(rpcUrl);

  const wallet = new Wallet(authority);

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  const newMarket = await FermiDex.initialiseMarket(authority, provider);
  console.log({ newMarket });
};

const createNewCustomMarket = async () => {
  const authority = FermiDex.getLocalKeypair(solanaConfigPath);
  const connection = new Connection(rpcUrl);
  const USDCMint = Keypair.generate();
  const wSolMint = Keypair.generate();
  const wallet = new Wallet(authority);

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  await FermiDex.createMint(provider, wSolMint, 9);
  await FermiDex.createMint(provider, USDCMint, 6);

  const newCustomMarket = await FermiDex.initialiseMarketCustom(
    authority,
    provider,
    wSolMint.publicKey,
    USDCMint.publicKey
  );

  console.log({newCustomMarket})
};

(async function () {
  try {
  // await createNewMarket();
    await createNewCustomMarket()
  } catch (err) {
    console.log("Error: ", err);
    process.exit(1);
  }

  process.exit(0);
})();
