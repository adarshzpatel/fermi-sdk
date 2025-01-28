import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { checkOrCreateAssociatedTokenAccount } from "../../src";
import { initLiquidityVaultClient } from "../utils";

const main = async () => {

  const vaultClient = initLiquidityVaultClient("./test-keypairs/alice/key.json");

  const tokenMint = new PublicKey("YOUR TOKEN ACCOUNT HERE");
  // Get user's token account
  const userTokenAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      vaultClient.provider,
      tokenMint,
      vaultClient.walletPk
    )
  );

  // Get vault state PDA
  const [vaultState] = await vaultClient.getVaultStatePDA(tokenMint);

  // Deposit tokens
  await vaultClient
    .deposit(new BN(1000000), vaultState, userTokenAccount)
    .then(() => console.log("Tokens deposited successfully"));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 