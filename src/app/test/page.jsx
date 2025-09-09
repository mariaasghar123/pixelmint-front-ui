"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import Button from "@/components/ui/Button";
import PaymentModal from "@/components/PaymentModal";

export default function SendUsdtButton() {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [amount, setAmount] = useState(100);
    const { address } = useAccount();
    console.log("TEST")

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-2xl font-bold mb-4">Send ANAS Tokens</h2>

            <div className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Amount to Send (ANAS)
                    </label>
                    <input
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Amount"
                        type="number"
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>

                <Button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!address}
                    className="w-full"
                >
                    {!address ? "Connect Wallet to Continue" : "Send ANAS Tokens"}
                </Button>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    open={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    description="Complete your payment with ANAS tokens on Sepolia"
                />
            )}
        </div>
    );
}
