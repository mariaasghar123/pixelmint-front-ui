"use client";
import { useState, useEffect } from "react";
import { Wallet, Shield, Zap } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";

export default function Login() {
    const { open } = useAppKit();
    const [loading, setLoading] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const { address, isConnected } = useAccount();
    const [step, setStep] = useState("idle");
    const { authenticate } = useAuth();
    const [authAttempts, setAuthAttempts] = useState(0);

    useEffect(() => {
        if (isConnected && address && step !== "authenticating" && step !== "done") {
            setStep("connected");
        } else if (!isConnected && step !== "connecting" && step !== "authenticating") {
            setStep("idle");
            setButtonClicked(false);
            setAuthAttempts(0);
        }
    }, [isConnected, address, step]);

    useEffect(() => {
        const handleAuthenticate = async () => {
            // Only allow up to 3 attempts
            if (isConnected && address && step === "connected" && authAttempts < 3) {
                setLoading(true);
                setStep("authenticating");
                setAuthAttempts(prev => prev + 1);
                try {
                    const success = await authenticate();
                    setStep(success ? "done" : "connected");
                } catch (e) {
                    toast.error(e.message || "Authentication failed");
                    setStep("connected");
                } finally {
                    setLoading(false);
                }
            } else if (authAttempts >= 3) {
                toast.error("Maximum authentication attempts reached. Please reload the page or reconnect.");
                setStep("idle");
            }
        };

        handleAuthenticate();
    }, [isConnected, address, authAttempts]);

    const handleConnectWallet = async () => {
        if (loading || buttonClicked || isConnected) {
            return;
        }

        setLoading(true);
        setButtonClicked(true);
        setStep("connecting");

        try {
            if (!isConnected) {
                await open();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (e) {
            console.error("Wallet connection error:", e);
            toast.error(e.message || "Failed to connect wallet");
            setStep("idle");
            setButtonClicked(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const isButtonDisabled =
        loading || buttonClicked || isConnected || step === "connecting" || step === "authenticating";

    const getButtonText = () => {
        if (step === "connecting" || (buttonClicked && !isConnected)) {
            return "Opening Wallet...";
        }
        if (loading && step === "connecting") {
            return "Connecting Wallet...";
        }
        return "Connect Wallet";
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

            <div className="w-[90%] md:w-full max-w-[500px] bg-transparent rounded-xl border-2 border-[rgba(101,231,140,0.25)] flex flex-col items-center py-8 px-12 shadow-lg">
                <div className="bg-dark-400 rounded-full flex items-center justify-center mb-2" style={{ width: 56, height: 56 }}>
                    <Wallet size={32} fill="#98F08C" strokeWidth={0} />
                </div>

                <h1 className="mt-4 text-2xl font-semibold font-ari text-light text-center">
                    Login with your crypto wallet
                </h1>

                <p className="mt-2 text-base text-[#A9D7B8] text-center">One Tap, No Passwords.</p>

                {isConnected && address && (
                    <div className="mt-4 px-4 py-2 bg-dark-500 rounded-lg">
                        <p className="text-xs text-[#A9D7B8] text-center">
                            Connected: {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                    </div>
                )}

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

                {(step === "idle" || step === "connecting") && (
                    <Button
                        className={`mt-8 w-full py-3 border-none transition-opacity duration-200 ${isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                        style={{
                            background: isButtonDisabled
                                ? "linear-gradient(90deg,#4a9960 0%, #7ba88a 100%)"
                                : "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                            color: "#05281B",
                        }}
                        onClick={handleConnectWallet}
                        disabled={isButtonDisabled}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {(loading || buttonClicked) && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#05281B]"></div>
                            )}
                            <span>{getButtonText()}</span>
                        </div>
                    </Button>
                )}

                {(step === "connected" || step === "authenticating") && (
                    <div className="mt-8 w-full">
                        <div className="flex items-center justify-center space-x-2 py-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#65E78C]"></div>
                            <span className="text-[#A9D7B8]">
                                {step === "authenticating" ? "Authenticating..." : "Preparing authentication..."}
                            </span>
                        </div>
                        {authAttempts >= 3 && (
                            <div className="mt-4 text-red-400 text-center text-sm">
                                Maximum authentication attempts reached.
                            </div>
                        )}
                    </div>
                )}

                {step === "done" && (
                    <div className="mt-8 w-full">
                        <div className="flex items-center justify-center space-x-2 py-3">
                            <div className="rounded-full h-4 w-4 bg-green-500 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-green-100 font-bold">
                                Authentication successful! Redirecting...
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-2 text-xs text-[#A9D7B8] text-center opacity-80">
                    Supports MetaMask, WalletConnect, Coinbase Wallet, and other Web3 wallets
                </div>
            </div>
        </div>
    );
}
