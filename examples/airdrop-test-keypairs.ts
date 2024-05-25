import { FermiClient, airdropToken, getLocalKeypair } from "../src"
import { OWNER_KEYPAIR, marketPda } from "./constants"

import { PublicKey } from "@solana/web3.js"
import { initClientWithKeypairPath } from "./utils"

const main = async () => {
  // const marketOwnerKp = getLocalKeypair("/Users/dm/.config/solana/id.json");
  const marketOwnerKp = OWNER_KEYPAIR
  const bobClient:FermiClient = initClientWithKeypairPath("./test-keypairs/bob/key.json")
  const aliceClient:FermiClient= initClientWithKeypairPath("./test-keypairs/alice/key.json")

  // get the market 
  const market = await bobClient.deserializeMarketAccount(new PublicKey(marketPda))
  const baseMint = market?.baseMint
  const quoteMint = market?.quoteMint
  if(!baseMint || !quoteMint) throw new Error("Invalid market")
    
  // airdrop tokens to bob 
  await airdropToken({
    amount:1000 * market?.baseLotSize.toNumber(),
    connection: bobClient.provider.connection,
    mint: baseMint,
    ownerKp: marketOwnerKp,
    receiverPk: bobClient.walletPk
  }).then(()=>console.log("Airdropped 1000 base tokens to bob"))

  await airdropToken({
    amount:1000 * market?.quoteLotSize.toNumber(),
    connection: bobClient.provider.connection,
    mint: quoteMint,
    ownerKp: marketOwnerKp,
    receiverPk: bobClient.walletPk
  }).then(()=>console.log("Airdropped 1000 quote tokens to bob"))
  // airdrop token to alice
  await airdropToken({
    amount:1000 * market?.baseLotSize.toNumber(),
    connection: aliceClient.provider.connection,
    mint: baseMint,
    ownerKp: marketOwnerKp,
    receiverPk: aliceClient.walletPk
  }).then(()=>console.log("Airdropped 1000 base tokens to alice"))

  await airdropToken({
    amount:1000 * market?.quoteLotSize.toNumber(),
    connection: aliceClient.provider.connection,
    mint: quoteMint,
    ownerKp: marketOwnerKp,
    receiverPk: aliceClient.walletPk
  }).then(()=>console.log("Airdropped 1000 quote tokens to bob"))


}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})