import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { initLiquidityVaultClient } from "../utils";
import { checkOrCreateAssociatedTokenAccount } from "../../src";

const main = async () => {
  const vaultClient = initLiquidityVaultClient(
    "./test-keypairs/alice/key.json"
  );

  const tokenMint = new PublicKey("YOUR TOKEN ACCOUNT HERE");

  // Get recipient token account
  const recipientTokenAccount = new PublicKey(
    await checkOrCreateAssociatedTokenAccount(
      vaultClient.provider,
      tokenMint,
      vaultClient.walletPk
    )
  );

  // Get vault state PDA
  const [vaultState] = await vaultClient.getVaultStatePDA(tokenMint);

  // Withdraw tokens
  await vaultClient
    .withdraw(new BN(500000), vaultState, recipientTokenAccount, vaultClient.walletPk)
    .then(() => console.log("Tokens withdrawn successfully"));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
