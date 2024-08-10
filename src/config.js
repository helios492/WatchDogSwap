import { http, createConfig } from 'wagmi'
import { base, bsc, mainnet, optimism } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [mainnet, base, bsc],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    // metaMask(),
    // safe(),
    // coinbaseWallet()
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
  },
})