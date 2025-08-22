import { createAppKit } from '@reown/appkit/react'
import { networks, wagmiAdapter } from './wagmi.config'

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID

const metadata = {
    name: 'Pixel Mint',
    description: 'Digital Billboard',
}

export const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId: PROJECT_ID,
    networks: networks,
    metadata,
    features: {
        email: false,
        socials: false,
        analytics: true
    }
})
