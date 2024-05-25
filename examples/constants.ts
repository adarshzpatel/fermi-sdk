import { Keypair } from "@solana/web3.js";

export const rpcUrl =
  "http://api.devnet.solana.com";

export const programId = "o9QBwW81vjiH22NWLpLZm23ifn5itMGz9Hka49YoJkv";

export const marketPda = "8VBaW4pm3detxtxY63m9g6RXMCnUC3u5D1SFnVhJ9mwN";
export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    229, 207, 192, 114, 233, 58, 53, 201, 119, 77, 46, 179, 94, 131, 174, 205,
    54, 177, 178, 55, 62, 42, 240, 50, 60, 78, 34, 14, 181, 90, 90, 57, 181, 45,
    63, 255, 32, 103, 173, 51, 75, 240, 141, 152, 55, 52, 35, 133, 252, 111,
    202, 141, 174, 123, 200, 180, 83, 1, 183, 161, 227, 154, 145, 39,
  ])
);
