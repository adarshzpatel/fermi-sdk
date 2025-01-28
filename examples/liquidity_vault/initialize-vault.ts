import { PublicKey } from "@solana/web3.js";
import { vault_program } from "../constants";
import { initLiquidityVaultClient } from "../utils";

const main = async () => {
  // Initialize the vault client with transaction callback
  const vaultClient = initLiquidityVaultClient(
    "./test-keypairs/alice/key.json"
  );

  const tokenMint = new PublicKey("YOUR TOKEN ACCOUNT HERE");

  // Create vault for the token
  await vaultClient
    .createVault(tokenMint, vault_program)
    .then(() => console.log("Token vault created successfully"));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});