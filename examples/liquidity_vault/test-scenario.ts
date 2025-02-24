import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { initLiquidityVaultClient } from "../utils";
import { checkOrCreateAssociatedTokenAccount } from "../../src";
import { vault_program } from "../constants";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTestScenario() {
  try {
    console.log("Starting Liquidity Vault Test Scenario...\n");

    // Initialize the vault client
    const vaultClient = initLiquidityVaultClient(
      "./test-keypairs/alice/key.json"
    );

    const tokenMint = Keypair.generate().publicKey;
    // Replace with your actual token mint
    // const tokenMint = new PublicKey("YOUR_TOKEN_MINT_ADDRESS");

    // Get user's token account
    console.log("Setting up token accounts...");
    const userTokenAccount = new PublicKey(
      await checkOrCreateAssociatedTokenAccount(
        vaultClient.provider,
        tokenMint,
        vaultClient.walletPk
      )
    );

    // Step 1: Initialize the vault
    console.log("\n1. Creating new vault...");
    await vaultClient.createVault(tokenMint, vault_program);
    const [vaultState] = await vaultClient.getVaultStatePDA(tokenMint);
    console.log("Vault created successfully!");

    // Let's wait a bit for the transaction to be confirmed
    await sleep(2000);

    // Step 2: Deposit tokens
    const depositAmount = new BN(1000000);
    console.log(`\n2. Depositing ${depositAmount.toString()} tokens...`);
    await vaultClient.deposit(depositAmount, vaultState, userTokenAccount);
    console.log("Deposit successful!");

    // Check vault state after deposit
    const vaultStateAfterDeposit = await vaultClient.getVaultState(tokenMint);
    const userStateAfterDeposit = await vaultClient.getUserState(
      vaultClient.walletPk,
      tokenMint
    );
    console.log("Vault state after deposit", vaultStateAfterDeposit);
    console.log("User state after deposit", userStateAfterDeposit);

    // Step 3: Withdraw half the tokens
    const withdrawAmount = new BN(500000);
    console.log(`\n3. Withdrawing ${withdrawAmount.toString()} tokens...`);
    await vaultClient.withdraw(
      withdrawAmount,
      vaultState,
      userTokenAccount,
      vaultClient.walletPk
    );
    console.log("Withdrawal successful!");

    // Check balances after withdrawal
    const vaultStateAfterWithdraw = await vaultClient.getVaultState(tokenMint);
    const userStateAfterWithdraw = await vaultClient.getUserState(
      vaultClient.walletPk,
      tokenMint
    );
    console.log("Vault state after withdrawal", vaultStateAfterWithdraw);
    console.log("User state after withdrawal", userStateAfterWithdraw);

    // Step 4: Admin takes remaining tokens
    const takeAmount = new BN(500000);
    console.log(`\n4. Admin taking ${takeAmount.toString()} tokens...`);
    await vaultClient.takeTokens(
      takeAmount,
      vaultState,
      userTokenAccount,
      vaultClient.walletPk
    );
    console.log("Tokens taken successfully!");

    // Final balance check
    const finalVaultState = await vaultClient.getVaultState(tokenMint);
    const finalUserState = await vaultClient.getUserState(
      vaultClient.walletPk,
      tokenMint
    );
    console.log("\nFinal Balances:");
    console.log("Vault state", finalVaultState);
    console.log("User state", finalUserState);

    console.log("\nTest scenario completed successfully!");
  } catch (error) {
    console.error("\nError in test scenario:", error);
    throw error;
  }
}

runTestScenario().catch((err) => {
  console.error("Test scenario failed:", err);
  process.exit(1);
});
