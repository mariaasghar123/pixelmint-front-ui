"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import { CircleCheck, MoreVertical, Clock, CircleX, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/utils/date.utils";
import api from "@/lib/api";

export default function PaymentManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, error } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => {
            const res = await api.get("/payments");
            return res.data.payload;
        },
    });

    const columns = [
        {
            header: "Transaction",
            key: "transaction",
            render: (row) => (
                <div>
                    <div className="font-semibold text-white truncate max-w-[200px]">{row.transaction}</div>
                    <div className="text-light/40 text-sm">{row.date} at {row.time}</div>
                </div>
            ),
        },
        {
            header: "User",
            key: "user",
            render: (row) => (
                <div>
                    <div className="font-semibold text-white">{row.user.name}</div>
                    <div className="text-light/40 text-sm">{row.user.email}</div>
                </div>
            ),
        },
        {
            header: "Amount (USDT)",
            key: "amount",
            render: (row) => (
                <div className="text-white">{row.amount.toLocaleString()}</div>
            ),
        },
        {
            header: "Status",
            key: "status",
            render: (row) => {
                if (row.status === "confirmed") {
                    return (
                        <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-green-200 text-dark-800">
                            <CircleCheck size={16} /> Confirmed
                        </span>
                    );
                }
                if (row.status === "pending") {
                    return (
                        <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-yellow-200 text-yellow-900">
                            <Clock size={16} /> Pending
                        </span>
                    );
                }
                if (row.status === "failed") {
                    return (
                        <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-red-200 text-red-900">
                            <CircleX size={16} /> Failed
                        </span>
                    );
                }
                return null;
            },
        },
        {
            header: "Actions",
            key: "actions",
            render: (row) => (
                <div className="flex gap-2">
                    {(row.transactionHash && !row.transactionHash.includes('admin')) && (
                        <a
                            href={`https://etherscan.io/tx/${row.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-dark-800 p-2 rounded-lg hover:bg-white/5 flex items-center justify-center"
                            title="View on Etherscan"
                            style={{
                                background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                            }}
                        >
                            <ExternalLink className="text-light w-5 h-5" />
                        </a>
                    )}
                    {/* <button */}
                    {/*     className="bg-dark-800 p-2 rounded-lg hover:bg-white/5 flex items-center justify-center" */}
                    {/*     style={{ */}
                    {/*         background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)" */}
                    {/*     }} */}
                    {/* > */}
                    {/*     <MoreVertical className="text-light w-5 h-5" /> */}
                    {/* </button> */}
                </div>
            ),
        },
    ];

    const tableData = useMemo(() => {
        return (data || []).map((item) => {
            const { date, time } = formatDateTime(item.createdAt);

            return {
                id: item._id,
                transaction: item.transactionHash || `Payment ID: ${item._id.slice(0, 8)}...`,
                transactionHash: item.transactionHash,
                date,
                time,
                user: {
                    name: item.user?.fullName || "Unknown User",
                    email: item.user?.email || "N/A",
                    wallet: item.user?.walletAddress || "N/A"
                },
                amount: item.amount,
                status: item.status,
            };
        });
    }, [data]);

    const filteredTableData = useMemo(() => {
        if (!searchTerm) return tableData;

        const lowerSearchTerm = searchTerm.toLowerCase();

        return tableData.filter(row =>
            row.transaction?.toLowerCase().includes(lowerSearchTerm) ||
            row.user.name.toLowerCase().includes(lowerSearchTerm) ||
            row.user.email.toLowerCase().includes(lowerSearchTerm) ||
            row.user.wallet.toLowerCase().includes(lowerSearchTerm) ||
            String(row.amount).includes(lowerSearchTerm)
        );
    }, [searchTerm, tableData]);

    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">Transaction Management</h1>
                <p className="text-light/60">View and manage blockchain payment transactions</p>
            </div>
            <SearchFilterBar
                className="mt-3 mb-5"
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search by transaction ID, user, or amount..."
            />
            <Table
                columns={columns}
                data={filteredTableData}
                isLoading={isLoading}
            />
            {error && <div className="text-red-500 mt-4">Failed to load payment data.</div>}
        </main>
    );
}
