"use client";
import { useState, useEffect, useRef } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import Button from "@/components/ui/Button";

const ANAS_ADDRESS = "0x1DFA18C791a45C82410ac5970C8a4D4ED4895E58";

const ERC20_ABI = [
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

export default function SendUsdtButton() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const [streamStatus, setStreamStatus] = useState("");
    const { address } = useAccount();

    const { data: decimals } = useReadContract({
        address: ANAS_ADDRESS,
        abi: ERC20_ABI,
        functionName: "decimals",
    });

    const { data: txHash, writeContract } = useWriteContract();

    const eventSourceRef = useRef(null);
    const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pixel/reservation-stream`;

    const sendUsdt = async () => {
        if (!decimals) return;
        const value = parseUnits(amount, decimals);
        writeContract({
            address: ANAS_ADDRESS,
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [recipient, value]
        });
    };

    useEffect(() => {
        if (txHash) {
            const url = `${streamUrl}?transactionHash=${txHash}`;
            if (eventSourceRef.current) eventSourceRef.current.close();
            const evtSource = new EventSource(url);
            eventSourceRef.current = evtSource;
            evtSource.onmessage = (event) => {
                setStreamStatus(event.data);
            };
            evtSource.onerror = () => {
                evtSource.close();
                eventSourceRef.current = null;
            };
        }
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [txHash, streamUrl]);

    return (
        <div>
            <input
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="Recipient Address"
            />
            <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
            />
            <Button
                onClick={sendUsdt}
                disabled={!address || !decimals}
            >
                Send USDT
            </Button>
            <div>{status}</div>
            <div>{streamStatus}</div>
        </div>
    );
}
