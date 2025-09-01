"use client";
import { useState } from "react";
import { Wallet, Shield, Zap } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { useAppKit } from "@reown/appkit/react";
import { useConnect } from "wagmi";

export default function Login() {
    const { open } = useAppKit();
    const [loading, setLoading] = useState(false);
    const { isConnected } = useConnect()
    const [step, setStep] = useState("idle");
    const { authenticate } = useAuth();

    const handleConnectWallet = async () => {
        setLoading(true);
        setStep("connecting");
        try {
            if (!isConnected)
                open();
            setStep("connected");
        } catch (e) {
            toast.error(e.message || "Failed to connect wallet");
            setStep("idle");
        } finally {
            setLoading(false);
        }
    };

    const handleAuthenticate = async () => {
        setLoading(true);
        setStep("authenticating");
        try {
            const success = await authenticate();
            setStep(success ? "done" : "connected");
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

                <div className="mt-6 flex gap-6 justify-center">
                    <div className="flex flex-col items-center bg-dark-500 rounded-lg justify-center px-8 py-2">
                        <Shield size={36} fill="#98F08C" strokeWidth={0} />
                        <span className="mt-2 text-light font-medium">Secure</span>
                    </div>
                    <div className="flex flex-col items-center bg-dark-500 rounded-lg justify-center px-8 py-2">
                        <Zap size={36} fill="#98F08C" strokeWidth={0} />
                        <span className="mt-2 text-light font-medium">Instant</span>
                    </div>
                </div>

                {/* Step 1: Connect Wallet */}
                {(step === "idle" || step === "connecting") && (
                    <Button
                        className="mt-8 w-full py-3 border-none"
                        style={{
                            background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                            color: "#05281B",
                        }}
                        onClick={handleConnectWallet}
                        disabled={loading || step === "connecting"}
                    >
                        {loading && step === "connecting" ? "Connecting Wallet..." : "Connect Wallet"}
                    </Button>
                )}

                {/* Step 2: Authenticate */}
                {(step === "connected" || step === "authenticating") && (
                    <Button
                        className="mt-4 w-full py-3 border-none"
                        style={{
                            background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                            color: "#05281B",
                        }}
                        onClick={handleAuthenticate}
                        disabled={loading || step === "authenticating"}
                    >
                        {loading && step === "authenticating" ? "Authenticating..." : "Authenticate"}
                    </Button>
                )}

                {/* Success message */}
                {step === "done" && (
                    <div className="mt-8 text-green-100 text-center font-bold text-lg">
                        Authentication successful! Redirecting...
                    </div>
                )}

                <div className="mt-2 text-xs text-[#A9D7B8] text-center opacity-80">
                    Supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 wallets
                </div>
            </div >
        </div >
    );
}
