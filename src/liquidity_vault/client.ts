import { Program, BN } from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import { FermiVault, IDL } from "./fermi_vault";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Commitment,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { sendTransaction } from "../utils";

export interface LiquidityVaultClientOptions {
  postSendTxCallback?: ({ txid }: { txid: string }) => void;
  commitment?: Commitment;
}

/**
 * Client for interacting with the Fermi Vault program
 */
export class LiquidityVaultClient {
  program: Program<FermiVault>;
  walletPk: PublicKey;
  private readonly postSendTxCallback?: ({ txid }: { txid: string }) => void;
  private readonly txConfirmationCommitment: Commitment;

  constructor(
    public provider: AnchorProvider,
    public programId: PublicKey,
    opts: LiquidityVaultClientOptions = {}
  ) {
    this.program = new Program(IDL, programId, provider);
    this.provider = provider;
    this.walletPk = provider.wallet.publicKey;
    this.postSendTxCallback = opts?.postSendTxCallback;
    this.txConfirmationCommitment = opts?.commitment ?? "processed";
  }

  /// Transactions
  public async sendAndConfirmTransaction(
    ixs: TransactionInstruction[],
    opts: any = {}
  ): Promise<string> {
    return await sendTransaction(
      this.program.provider as AnchorProvider,
      ixs,
      opts.alts ?? [],
      {
        postSendTxCallback: this.postSendTxCallback,
        txConfirmationCommitment: this.txConfirmationCommitment,
        ...opts,
      }
    );
  }

  /**
   * Derives the vault state PDA address
   */
  async getVaultStatePDA(mint: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from("vault_state"), mint.toBuffer()],
      this.programId
    );
  }

  /**
   * Derives the vault authority PDA address
   */
  async getVaultAuthorityPDA(
    vaultState: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from("vault_authority"), vaultState.toBuffer()],
      this.programId
    );
  }

  /**
   * Derives the user state PDA address
   */
  async getUserStatePDA(
    user: PublicKey,
    vault: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from("user_state"), user.toBuffer(), vault.toBuffer()],
      this.programId
    );
  }

  /**
   * Initialize a new vault for a given token mint
   */
  async createVault(tokenMint: PublicKey, whitelistedProgram: PublicKey) {
    const [vaultState] = await this.getVaultStatePDA(tokenMint);
    const [vaultAuthority] = await this.getVaultAuthorityPDA(vaultState);
    const vaultTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      vaultAuthority,
      true
    );

    const ix = await this.program.methods
      .initialize(whitelistedProgram)
      .accounts({
        vaultState,
        tokenMint,
        vaultAuthority,
        vaultTokenAccount,
        payer: this.walletPk,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    return this.sendAndConfirmTransaction([ix]);
  }

  /**
   * Deposit tokens into the vault
   */
  async deposit(
    amount: number | BN,
    vault: PublicKey,
    userTokenAccount: PublicKey,
    user: PublicKey = this.walletPk
  ) {
    const [vaultState] = await this.getVaultStatePDA(vault);
    const [vaultAuthority] = await this.getVaultAuthorityPDA(vaultState);
    const [userState] = await this.getUserStatePDA(user, vault);
    const vaultTokenAccount = await getAssociatedTokenAddress(
      vault,
      vaultAuthority,
      true
    );

    const ix = await this.program.methods
      .deposit(user, new BN(amount))
      .accounts({
        vaultState,
        userState,
        user,
        userTokenAccount,
        vaultTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction();

    return this.sendAndConfirmTransaction([ix]);
  }

  /**
   * Withdraw tokens from the vault
   */
  async withdraw(
    amount: number | BN,
    vault: PublicKey,
    recipientTokenAccount: PublicKey,
    user: PublicKey
  ) {
    const [vaultState] = await this.getVaultStatePDA(vault);
    const [vaultAuthority] = await this.getVaultAuthorityPDA(vaultState);
    const [userState] = await this.getUserStatePDA(user, vault);
    const vaultTokenAccount = await getAssociatedTokenAddress(
      vault,
      vaultAuthority,
      true
    );

    const ix = await this.program.methods
      .withdraw(user, new BN(amount))
      .accounts({
        vaultState,
        userState,
        vaultAuthority,
        vaultTokenAccount,
        recipientTokenAccount,
        caller: this.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return this.sendAndConfirmTransaction([ix], {
      postSendTxCallback: this.postSendTxCallback,
    });
  }

  /**
   * Take tokens from the vault (admin function)
   */
  async takeTokens(
    amount: number | BN,
    vault: PublicKey,
    recipientTokenAccount: PublicKey,
    user: PublicKey
  ) {
    const [vaultState] = await this.getVaultStatePDA(vault);
    const [vaultAuthority] = await this.getVaultAuthorityPDA(vaultState);
    const [userState] = await this.getUserStatePDA(user, vault);
    const vaultTokenAccount = await getAssociatedTokenAddress(
      vault,
      vaultAuthority,
      true
    );

    const ix = await this.program.methods
      .takeTokens(user, new BN(amount))
      .accounts({
        vaultState,
        userState,
        vaultAuthority,
        vaultTokenAccount,
        recipientTokenAccount,
        caller: this.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return this.sendAndConfirmTransaction([ix], {
      postSendTxCallback: this.postSendTxCallback,
    });
  }

  /**
   * Get vault state info
   */
  async getVaultState(vault: PublicKey) {
    const [vaultState] = await this.getVaultStatePDA(vault);
    return await this.program.account.vaultState.fetch(vaultState);
  }

  /**
   * Get user state info
   */
  async getUserState(user: PublicKey, vault: PublicKey) {
    const [userState] = await this.getUserStatePDA(user, vault);
    return await this.program.account.userState.fetch(userState);
  }
}
