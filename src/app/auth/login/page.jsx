"use client";
import { useState } from "react";
import { Wallet } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { authenticate } = useAuth();
    const { isConnected } = useAccount();
    const { open } = useAppKit();

    // Always try to connect wallet first if not connected, then authenticate
    const handleSingleButton = async () => {
        setLoading(true);
        try {
            if (!isConnected) {
                await open();
            }
            await authenticate();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-700">
            <div className="flex flex-col items-center mb-4">
                <Image
                    src="/logo.svg"
                    width={150}
                    height={170}
                    alt="Leaf Logo"
                    priority
                />
            </div>

            <div className="min-w-[380px] bg-transparent rounded-xl border-2 border-[rgba(101,231,140,0.25)] flex flex-col items-center py-8 px-12 shadow-lg">
                <div className="bg-dark-400 rounded-full flex items-center justify-center mb-2" style={{ width: 56, height: 56 }}>
                    <Wallet size={32} fill="#98F08C" strokeWidth={0} />
                </div>

                <h1 className="mt-4 text-2xl font-semibold font-ari text-light text-center">
                    Login with your crypto wallet
                </h1>

                <p className="mt-2 text-base text-[#A9D7B8] text-center">One Tap, No Passwords.</p>

                <Button
                    className="mt-8 w-full py-3"
                    style={{
                        background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                        color: "#05281B",
                        boxShadow: "0 2px 8px 0 #65E78C22"
                    }}
                    onClick={handleSingleButton}
                    disabled={loading}
                >
                    {loading
                        ? !isConnected
                            ? "Signing In..."
                            : "Authenticating..."
                        : "Sign In"}
                </Button>

                <div className="mt-2 text-xs text-[#A9D7B8] text-center opacity-80">
                    Supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 wallets
                </div>
            </div>
        </div>
    );
}
