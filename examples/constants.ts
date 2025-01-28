import { Keypair } from "@solana/web3.js";

export const rpcUrl = "http://api.devnet.solana.com";
//export const rpcUrl = "http://localhost:8899";

// Basic + Market orders + Market orders finalize
//export const programId = "AU2jGQtk7dmwwi1g18bqFwPn8oFaHL5A6735jssQC96E";
export const programId = "7xGbCv5cPLFEeYpGhSMjy5y8H1QrwHd6UAoS16znkjPN";

//export const marketPda = "3TEST3xCCxhcBWMrbSjbXSBSXZ9idpi8mUAtVxc39R8k";
export const marketPda2 = "Gz12RjFZVUDPqBfEP18dwxxoiXZncsQKKfdjJSUdgoWB";
export const marketPda = "4t1hSTH5m9cEco5yKGuhmuotY6QRi7uAgMS2BHAkFRKj";


// DCEp8dRr3TeLTcFADbEfHs2iHx6usXE6JhJwzu46M12W
export const OWNER_KEYPAIR = Keypair.fromSecretKey(
  Uint8Array.from([
    229, 207, 192, 114, 233, 58, 53, 201, 119, 77, 46, 179, 94, 131, 174, 205,
    54, 177, 178, 55, 62, 42, 240, 50, 60, 78, 34, 14, 181, 90, 90, 57, 181, 45,
    63, 255, 32, 103, 173, 51, 75, 240, 141, 152, 55, 52, 35, 133, 252, 111,
    202, 141, 174, 123, 200, 180, 83, 1, 183, 161, 227, 154, 145, 39,
  ])
);
