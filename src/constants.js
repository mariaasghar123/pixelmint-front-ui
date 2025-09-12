import { Wallet, CreditCard, Key } from "lucide-react";

export const TOKENS = {
    1: {
        usdt: {
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            name: "USDT",
            fullName: "Tether USD",
            decimals: 6,
            icon: <Wallet className="mb-2 h-6 w-6 text-[#94D9C0]" />,
            chainKey: "ethereum"
        },
        usdc: {
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            name: "USDC",
            fullName: "USD Coin",
            decimals: 6,
            icon: <CreditCard className="mb-2 h-6 w-6 text-[#94D9C0]" />,
            chainKey: "ethereum"
        }
    },
    11155111: {
        // old USDT config - commented out for future use
        // usdt: {
        //     address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        //     name: "USDT",
        //     fullName: "Tether USD (Test)",
        //     decimals: 6,
        //     icon: <Wallet className="mb-2 h-6 w-6 text-[#94D9C0]" />,
        //     chainKey: "sepolia"
        // },
        usdt: {
            address: "0x2F5f6B9FF3FA56b8DF06810096e2520E435F95B5",
            name: "tUSDT",
            fullName: "TestUSDT",
            decimals: 6,
            icon: <Wallet className="mb-2 h-6 w-6 text-[#94D9C0]" />,
            chainKey: "sepolia",
            isTestToken: true
        },
        usdc: {
            address: "0x8267cF9254734C6Eb452a7BB7dBda921c13F9cCC",
            name: "USDC",
            fullName: "USD Coin (Test)",
            decimals: 6,
            icon: <CreditCard className="mb-2 h-6 w-6 text-[#94D9C0]" />,
            chainKey: "sepolia"
        },
        anas: {
            address: "0x1DFA18C791a45C82410ac5970C8a4D4ED4895E58",
            name: "TEST",
            fullName: "TEST Token",
            decimals: 18,
            icon: <Key className="mb-2 h-6 w-6 text-[#94D9C0]" />,
            isEasterEgg: true,
            chainKey: "sepolia"
        }
    }
};

export const SUPPORTED_NETWORKS = {
    1: "Ethereum Mainnet",
    11155111: "Sepolia Testnet"
};

export const PAYMENT_STATES = {
    INITIATING: "INITIATING",
    SIGNING: "SIGNING",
    READY: "READY",
    PROCESSING: "PROCESSING",
    CONFIRMING: "CONFIRMING",
    VERIFYING: "VERIFYING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    CANCELED: "CANCELED"
};

export const ERC20_DECIMALS_ABI = [
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    }
];

export const ERC20_ABI = [
    {
        name: "decimals",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint8" }]
    },
    {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        outputs: [{ type: "bool" }]
    }
];
