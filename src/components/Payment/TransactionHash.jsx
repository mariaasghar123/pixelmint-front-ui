import { ExternalLink } from "lucide-react";
import { SUPPORTED_NETWORKS } from "@/constants";

export default function TransactionHashDisplay({ hash, networkId, isAdminTransaction = false }) {
    if (!hash) return null;

    // For admin transactions, just show the hash without the explorer link
    if (isAdminTransaction || hash.startsWith('admin-')) {
        return (
            <div className="bg-[#002F28] border border-[#FFFFFF11] p-3 rounded-lg">
                <div className="flex justify-between items-center">
                    <div className="overflow-hidden">
                        <span className="text-[#94D9C0]/70 text-sm">Admin Approved</span>
                        <div className="text-[#EBFFF9] font-mono text-sm mt-1 truncate">
                            {hash}
                        </div>
                    </div>
                    <div className="bg-blue-900/50 p-1.5 rounded-lg">
                        <span className="text-blue-300">Admin</span>
                    </div>
                </div>
            </div>
        );
    }

    // Get explorer URL based on network
    let explorerUrl = null;
    switch (networkId) {
        case 1: // Ethereum
            explorerUrl = `https://etherscan.io/tx/${hash}`;
            break;
        case 137: // Polygon
            explorerUrl = `https://polygonscan.com/tx/${hash}`;
            break;
        case 56: // BSC
            explorerUrl = `https://bscscan.com/tx/${hash}`;
            break;
        case 11155111: // Sepolia
            explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`;
            break;
        default:
            explorerUrl = null;
    }

    return (
        <div className="bg-[#002F28] border border-[#FFFFFF11] p-3 rounded-lg">
            <div className="flex justify-between items-center">
                <div className="overflow-hidden">
                    <span className="text-[#94D9C0]/70 text-sm">{SUPPORTED_NETWORKS[networkId] || "Blockchain"} Transaction</span>
                    <div className="text-[#EBFFF9] font-mono text-sm mt-1 truncate">
                        {hash}
                    </div>
                </div>
                {explorerUrl && (
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#21c192]/10 p-2 rounded-lg hover:bg-[#21c192]/20 transition-colors"
                        title="View on Blockchain Explorer"
                    >
                        <ExternalLink size={18} className="text-[#21c192]" />
                    </a>
                )}
            </div>
        </div>
    );
}
