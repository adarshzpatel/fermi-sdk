import { Keypair, PublicKey } from "@solana/web3.js";

export const rpcUrl = "http://api.devnet.solana.com";
//export const rpcUrl = "http://localhost:8899";

// Basic + Market orders + Market orders finalize
//export const programId = "AU2jGQtk7dmwwi1g18bqFwPn8oFaHL5A6735jssQC96E";
export const programId = "3LaFxgsYSc27YuEhY7CwkfGyvpcAinmiHcAA5qE399ob";

//export const marketPda = "3TEST3xCCxhcBWMrbSjbXSBSXZ9idpi8mUAtVxc39R8k";
//export const marketPda = "6ud7RKsbTJ8y6YxB7ExmhVAEQWSYKAxGa8azFna6NctL";
export const marketPda = "GnDethiMd2Z1ANCeSAcP7fxRWXL64FM6dNJowho6Knxt";


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
  "6bNHAnuHZ4hjrmZYFCcABXhHd4GzuzHV554ApPMsgbih"
);

export const vault_authority = new PublicKey(
  "GzyS5fbZcY2vHk7hFqkZXe6CowE4WpJnh6r8wC5GCY32"
);

export const vault_program = new PublicKey(
  "2AcUsdsFXdUfKm5pd7JLQqNAKhgsZZz7e8Pc7E6Dowbx"
);

export const vault_token_account = new PublicKey(
  "E567RjVmqQjxfj9hwDEHQEWZDx1AzwfSrAP45KmoG4Y6"
);

/*
  fermi-vault
  fermi-vault
Created test mint: 41386d3KTCZKteGXoMQNNueWqs6KY5kG3KsA48z5X577
vaultStatePda: 6bNHAnuHZ4hjrmZYFCcABXhHd4GzuzHV554ApPMsgbih
vaultAuthPda: GzyS5fbZcY2vHk7hFqkZXe6CowE4WpJnh6r8wC5GCY32 bump = 255
vaultTokenAccPda: E567RjVmqQjxfj9hwDEHQEWZDx1AzwfSrAP45KmoG4Y6 bump = 253
Vault initialized successfully.
vaultState.tokenMint: 41386d3KTCZKteGXoMQNNueWqs6KY5kG3KsA48z5X577
vaultState.whitelistedProgram: 3FYwm5bHaUYYcnb6Cvu8QUuZUbzTe3wutHXVvrjRaZpF
vaultState.vaultAuthorityBump: 255
vaultState.vaultTokenAccountBump: 253
    ✔ Is initialized! (1244ms)
Deposit successful, usertokenaccount: GcHgJhH7E7wg2ijCZUSjX7dhxzuwNw17fmX1yHPviUb
*/