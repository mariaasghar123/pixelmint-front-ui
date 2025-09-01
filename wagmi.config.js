import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { metaMask, walletConnect } from 'wagmi/connectors'
import { mainnet, sepolia } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY

if (!PROJECT_ID) {
    throw new Error("Project ID was not provided")
}

export const networks = [mainnet, sepolia]

const wagmiConfig = createConfig({
    connectors: [
        metaMask(),
        walletConnect({
            projectId: PROJECT_ID,
            chains: [mainnet, sepolia]
        })
    ],
    chains: networks,
    transports: {
        [mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
        [sepolia.id]: http(`https://sepolia.infura.io/v3/${INFURA_KEY}`),
    },
})

export const wagmiAdapter = new WagmiAdapter({
    config: wagmiConfig,
    networks,
    projectId: PROJECT_ID,
    ssr: true,
})

export const config = wagmiAdapter.wagmiConfig
