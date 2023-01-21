import { useWallet } from '@solana/wallet-adapter-react'

const Counter = () => {
    const { publicKey } = useWallet()

    return (
        <div>
            <p>Counter: { publicKey ? Object.entries(publicKey) : "lol" }</p>
        </div>
    )
}

export default Counter
