import {
  WalletMultiButton,
  WalletModalButton,
} from "@solana/wallet-adapter-react-ui"

export const AppBar = () => {
  return (
    <div>
      <div>
        <WalletMultiButton />
      </div>
      <br />
      <div>
        <WalletModalButton>Change wallet</WalletModalButton>
      </div>
    </div>
  )
}
