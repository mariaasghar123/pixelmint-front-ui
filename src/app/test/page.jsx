"use client";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const ERC20_ABI = [
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

export default function SendUsdtButton() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const { address } = useAccount();

    const { writeContract, isPending, error } = useWriteContract();

    const sendUsdt = async () => {
        try {
            setStatus("Sending...");
            // USDT on BSC uses 18 decimals
            const value = parseUnits(amount, 18);
            const tx = await writeContract({
                address: USDT_ADDRESS,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [recipient, value]
            });
            setStatus(`Tx sent! Hash: ${tx}`);
        } catch (e) {
            setStatus("Error: " + (e?.message || "Unknown"));
        }
    };

    return (
        <div>
            <input
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="Recipient Address"
                className="border rounded p-2"
            />
            <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount (USDT)"
                type="number"
                className="border rounded p-2 mx-2"
            />
            <button
                onClick={sendUsdt}
                disabled={isPending || !address}
                className="bg-green-600 text-white rounded px-4 py-2"
            >
                {isPending ? "Sending..." : "Send USDT"}
            </button>
            <div className="mt-2 text-sm">{status}</div>
            {error && <div className="mt-2 text-red-500 text-sm">{error.message}</div>}
        </div>
    );
}
