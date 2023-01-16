import * as web3 from "@solana/web3.js"

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"

import {
  PhantomWalletAdapter,
  GlowWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  SolletExtensionWalletAdapter,
} from "@solana/wallet-adapter-wallets"

require("@solana/wallet-adapter-react-ui/styles.css")

const WalletAdapter = ({ children }) => {
  const endpoint = web3.clusterApiUrl("devnet")
  const wallets = [
    new PhantomWalletAdapter(),
    new GlowWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new SolletExtensionWalletAdapter(),
  ]

  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default WalletAdapter
