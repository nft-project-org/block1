import { Connection, PublicKey } from "@solana/web3.js"
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor"
import idl from "./idl.json"
import { useState } from "react"
import WalletAdapter from "./WalletAdapter"
import { WalletBalance } from "./WalletBalance"
import { AppBar } from "./AppBar"
import { WalletModalButton } from "@solana/wallet-adapter-react-ui"

const opts = {
  preflightCommitment: "processed",
}
const programID = new PublicKey(idl.metadata.address)

function App() {
  const [counter, setCounter] = useState(undefined)
  const [provider, setProvider] = useState(undefined)

  async function getProvider() {
    const network = "http://127.0.0.1:8899"
    const connection = new Connection(network, opts.preflightCommitment)
    const wallet = window.solana

    const provider = new AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment
    )
    return provider
  }

  async function create() {
    const newProvider = await getProvider()
    setProvider(newProvider)
    setCounter(web3.Keypair.generate())

    const program = new Program(idl, programID)

    try {
      //const tx = await program.methods.create()
      //console.log("Sent! Signature: ", tx);

      await program.methods
        .create(window.solana.publicKey)
        .accounts({
          counter: counter.publicKey,
          user: window.solana.publicKey,
          systemProgram: programID,
        })
        .signers([counter])
        .rpc()

      //const counterAccount = await program.account.counter.fetch(counter.publicKey)
      //console.log(counterAccount.count)
    } catch (err) {
      console.log("Transaction Error: ", err)
    }
  }

  async function increment() {
    const program = new Program(idl, programID)

    try {
      const tx = await program.methods.increment()
      console.log("Sent! Signature: ", tx)

      const counterAccount = await program.account.counter.fetch(programID)
      console.log(counterAccount)
    } catch (err) {
      console.log("Transaction Error: ", err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <WalletAdapter>
          <AppBar />
          <div>
            <WalletBalance />
          </div>
        </WalletAdapter>
        <button onClick={create}>2. Create counter</button>
        <button onClick={increment}>3. Increment counter</button>
      </header>
    </div>
  )
}

export default App
