
const secretKeyPath = "~/.config/solana/id.json"

const main = async () => {
  console.log(secretKeyPath)
}


main().catch(err=>{
  console.error(err)
  process.exit(1)
})

