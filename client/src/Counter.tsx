import * as anchor from '@coral-xyz/anchor'
import { findProgramAddressSync } from '@coral-xyz/anchor/dist/cjs/utils/pubkey'
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { useWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import idl from './idl';


const Counter = () => {
  const { wallet, publicKey, signAllTransactions, sendTransaction } = useWallet()
  const programID = new PublicKey(idl.metadata.address)
  const anchorWallet = useAnchorWallet()
  const { connection } = useConnection()

  const [initialized, setInitialized] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)

  const [counter, setCounter]: any = useState(undefined)
  const [count, setCount] = useState(0)
  const [info, setInfo] = useState('')

  const program = useMemo(() => {

    if (anchorWallet) {
        // connection overwrittern for localhost
        const network = "http://127.0.0.1:8899";
        const connection = new Connection(network, {});
        const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
        return new anchor.Program(idl, idl.metadata.address, provider)
    }
  }, [connection, anchorWallet])

  const create = async () => {
    if (!program || !publicKey) {
      return
    }
    const counter = anchor.web3.Keypair.generate();
    try {
        setTransactionPending(true)

        await program.methods
            .create(publicKey)
            .accounts({
                counter: counter.publicKey,
                user: publicKey,
                systemProgram: SystemProgram.programId,
            }).signers([counter])
            .rpc()
        setInitialized(true)
        setInfo('succesfully created counter')
        setCounter(counter)
    } catch (error: any) {
        console.log(error)
        setInfo(error.toString())
    } finally {
        setTransactionPending(false)
    }
  }

  const increment = async () => {
    if (!program || !publicKey || !counter) {
      return
    }
    
    await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
        authority: publicKey,
      })
      .rpc();

    const counterAccount: any = await program.account.counter.fetch(
      counter.publicKey
    )
    setCount(counterAccount.count.toNumber())
  }
    
  return (
      <div>
          <p>{info}</p>
          <p>Counter: { counter ? publicKey?.toString() : 'Not initialized' }</p>
          <p>Count: { counter ? count : '-' }</p>
          <button onClick={create}>Create Counter</button>
          <button onClick={increment}>Increment</button>
      </div>
  )
}

export default Counter
