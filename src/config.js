import { http, createConfig } from 'wagmi'
import { base, bsc, mainnet, optimism } from 'wagmi/chains'
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
// import { Core } from '@walletconnect/core'
// import { Web3Wallet } from '@walletconnect/web3wallet'

// const core = new Core({
//   projectId: 'fa3d84f47653d4f84cb0268e691ef692'
// })

// const metadata = {
//   name: 'watchdogswap',
//   description: 'AppKit Example',
//   url: 'https://web3modal.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/37784886']
// }

// const web3wallet = await Web3Wallet.init({
//   core, // <- pass the shared 'core' instance
//   metadata
// })


const projectId = 'fa3d84f47653d4f84cb0268e691ef692'

export const config = createConfig({
  chains: [mainnet, base, bsc],
  connectors: [
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
  },
})