
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import * as web3 from '@solana/web3.js'
import Counter from './Counter';
require('@solana/wallet-adapter-react-ui/styles.css')

const App = () => {
    const endpoint = web3.clusterApiUrl('devnet')
    const wallet = new PhantomWalletAdapter()

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[wallet]}>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <Counter />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default App
