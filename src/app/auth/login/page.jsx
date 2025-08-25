"use client";
import { useState } from "react";
import { Wallet, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { useAuth } from "@/components/AuthProvider";

export default function Login() {
    const [walletLoading, setWalletLoading] = useState(false);
    const { authenticate, loading } = useAuth();
    const { isConnected } = useAccount();
    const { open } = useAppKit();

    const handleConnect = async () => {
        setWalletLoading(true);
        try {
            open();
        } finally {
            setWalletLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-700" >
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

                <div className="mt-6 flex gap-6 justify-center">
                    <div className="flex flex-col items-center bg-dark-400 flex items-center rounded-lg justify-center px-8 py-2">
                        <Shield size={36} fill="#98F08C" strokeWidth={0} />
                        <span className="mt-2 text-light font-medium">Secure</span>
                    </div>
                    <div className="flex flex-col items-center bg-dark-400 flex items-center rounded-lg justify-center px-8 py-2">
                        <Zap size={36} fill="#98F08C" strokeWidth={0} />
                        <span className="mt-2 text-light font-medium">Instant</span>
                    </div>
                </div>

                {!isConnected ? (
                    <Button
                        className="mt-5 w-full py-3"
                        style={{
                            background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                            color: "#05281B",
                            boxShadow: "0 2px 8px 0 #65E78C22"
                        }}
                        onClick={handleConnect}
                        disabled={walletLoading}
                    >
                        {walletLoading ? "Loading..." : "Connect Wallet"}
                    </Button>
                ) : (
                    <Button
                        className="mt-5 w-full py-3"
                        style={{
                            background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                            color: "#05281B",
                            boxShadow: "0 2px 8px 0 #65E78C22"
                        }}
                        onClick={authenticate}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </Button>
                )}

                <div className="mt-2 text-xs text-[#A9D7B8] text-center opacity-80">
                    Supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 wallets
                </div>
            </div>
        </div>
    );
}
