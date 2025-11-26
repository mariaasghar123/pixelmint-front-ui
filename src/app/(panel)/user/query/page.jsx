"use client";
import React, { useState } from "react";
import { Copy } from "lucide-react";
import Button from "@/components/ui/Button";
import { FaTelegram } from "react-icons/fa";

export default function SupportCards() {
    const [copied, setCopied] = useState(false);
    const [uniqueCode, setUniqueCode] = useState("04721983");

    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full mx-auto mt-6">
            <div className="flex-1 dark:bg-dark-800 bg-gray-300 rounded-lg p-5 min-w-[300px] flex flex-col">
                <h3 className="text-2xl font-semibold dark:text-white text-dark-700 mb-1">Your Unique Code</h3>
                <p className="text-xl text-gray-400 mb-4">
                    You can use this unique code to message admin via Telegram.
                </p>
                <div className="flex-1" />
                <div className="flex items-center dark:bg-dark-800 bg-dark-200 rounded-xl border dark:border-white border-black overflow-hidden p-1">
                    <input
                        type="text"
                        value={uniqueCode}
                        onChange={e => setUniqueCode(e.target.value)}
                        className="bg-transparent dark:text-white text-gray-400 px-3 py-2 flex-1 text-base outline-none"
                    />
                    <Button
                        onClick={handleCopy}
                        className="flex items-center gap-2 transition rounded-lg"
                    >
                        <Copy size={18} />
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
            </div>

            {/* Support Card */}
            <div className="flex-1 dark:bg-dark-800 bg-gray-300 rounded-lg p-5 min-w-[300px] flex flex-col">
                <h3 className="text-2xl font-semibold dark:text-white text-dark-700 mb-1">Support</h3>
                <p className="text-xl text-gray-400 mb-4">
                    Need help? Contact admin directly via Telegram.<br />
                    Must share your Unique code with admin
                </p>
                <a
                    href="https://t.me/username" // Replace with actual Telegram link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ari font-semibold inline-flex items-center gap-2 bg-[#3796E4] hover:bg-[#63B3ED] text-white px-5 py-2 rounded-lg transition"
                >
                    <FaTelegram />
                    Chat on Telegram
                </a>
            </div>
        </div>
    );
}
