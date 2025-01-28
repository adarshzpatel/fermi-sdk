import { Keypair, PublicKey } from "@solana/web3.js";

export const rpcUrl = "http://api.devnet.solana.com";
//export const rpcUrl = "http://localhost:8899";

// Basic + Market orders + Market orders finalize
//export const programId = "AU2jGQtk7dmwwi1g18bqFwPn8oFaHL5A6735jssQC96E";
export const programId = "GvgrAcGcrh6YVDm5hWdiAZgphjFNykxfnQfsaScaFZJf";

//export const marketPda = "3TEST3xCCxhcBWMrbSjbXSBSXZ9idpi8mUAtVxc39R8k";
export const marketPda2 = "Gz12RjFZVUDPqBfEP18dwxxoiXZncsQKKfdjJSUdgoWB";
export const marketPda = "NQfo73y6cxQMFzastGG4Epu4uBMBhQ64t4SD1qWRc2q";


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
  "BANNVjj8udGGwZz7Co2x9VxqFVdfFxgrJh3KHpDiX1QJ"
);

export const vault_authority = new PublicKey(
  "G76xtqAZJUXVR3sNUsBuUK7XpHnt6LtF8PrhqJA8gE6U"
);
//const user_state= new PublicKey("BANNVjj8udGGwZz7Co2x9VxqFVdfFxgrJh3KHpDiX1QJ");
export const vault_program = new PublicKey(
  "HpXg2xR81SsNPLU9CTyh621ZEQhEUkedL1ASbMpSMpzT"
);
export const vault_token_account = new PublicKey(
  "DtCyyL1W5Ek8vYTBgCov6JawrCtSH4eN9k44J5KVwb6k"
);
