import { Keypair, PublicKey } from "@solana/web3.js";

export const rpcUrl = "http://api.devnet.solana.com";
//export const rpcUrl = "http://localhost:8899";

// Basic + Market orders + Market orders finalize
//export const programId = "AU2jGQtk7dmwwi1g18bqFwPn8oFaHL5A6735jssQC96E";
export const programId = "7xGbCv5cPLFEeYpGhSMjy5y8H1QrwHd6UAoS16znkjPN";

//export const marketPda = "3TEST3xCCxhcBWMrbSjbXSBSXZ9idpi8mUAtVxc39R8k";
export const marketPda = "6ud7RKsbTJ8y6YxB7ExmhVAEQWSYKAxGa8azFna6NctL";
//export const marketPda = "NQfo73y6cxQMFzastGG4Epu4uBMBhQ64t4SD1qWRc2q";


// DCEp8dRr3TeLTcFADbEfHs2iHx6usXE6JhJwzu46M12W
export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    229, 207, 192, 114, 233, 58, 53, 201, 119, 77, 46, 179, 94, 131, 174, 205,
    54, 177, 178, 55, 62, 42, 240, 50, 60, 78, 34, 14, 181, 90, 90, 57, 181, 45,
    63, 255, 32, 103, 173, 51, 75, 240, 141, 152, 55, 52, 35, 133, 252, 111,
    202, 141, 174, 123, 200, 180, 83, 1, 183, 161, 227, 154, 145, 39,
  ])
);


// Liquidity vault constants
export const vault_state = new PublicKey(
  "EywqiGFTj1N2QArnXndzTxNAEFLBbtmaERqnqf4tRa2P"
);

export const vault_authority = new PublicKey(
  "47dVEsyXQ6uRFSQWhezaE4mCjuG7qk7WyK9WpfWuXw8b"
);

export const vault_program = new PublicKey(
  "BCXpeg3WcbfLV7EDB1HGnzEkdJTPuNTKkRzyNfAHQbQ1"
);

export const vault_token_account = new PublicKey(
  "4Q31M1DYZmcmTVDEHKWhaz7XXDqCAdRoJrsGt8Zi9nQv"
);

/*
ProgramId: BCXpeg3WcbfLV7EDB1HGnzEkdJTPuNTKkRzyNfAHQbQ1


  fermi-vault
    1) Is initialized!

  fermi-vault
Created test mint: 49VWKzC7xsHwWtH9GrEssQWXYBCiALLN4oxX7nXUeRcC
vaultStatePda: EywqiGFTj1N2QArnXndzTxNAEFLBbtmaERqnqf4tRa2P
vaultAuthPda: 47dVEsyXQ6uRFSQWhezaE4mCjuG7qk7WyK9WpfWuXw8b bump = 254
vaultTokenAccPda: 4Q31M1DYZmcmTVDEHKWhaz7XXDqCAdRoJrsGt8Zi9nQv bump = 254
Vault initialized successfully.
vaultState.tokenMint: 49VWKzC7xsHwWtH9GrEssQWXYBCiALLN4oxX7nXUeRcC
vaultState.whitelistedProgram: D1MCk3t8B6Cp1GnUnNkKBtMS5iXG4FEq4U3yNvJgtdDz
vaultState.vaultAuthorityBump: 254
*/