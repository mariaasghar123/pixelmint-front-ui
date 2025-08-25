"use client";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import { CircleCheck, MoreVertical, Clock, CircleX } from "lucide-react";

const tableData = [
    {
        transaction: "TXN-2024-001",
        date: "1/15/2024",
        time: "7:30:00 PM",
        user: { name: "Sarah Johnson", email: "sarah@example.com" },
        amount: "2,500",
        status: "Completed",
    },
    {
        transaction: "TXN-2024-002",
        date: "1/16/2024",
        time: "9:15:00 AM",
        user: { name: "Mike Chen", email: "mike@example.com" },
        amount: "1,000",
        status: "Completed",
    },
    {
        transaction: "TXN-2024-003",
        date: "1/17/2024",
        time: "2:20:00 PM",
        user: { name: "Lisa Wang", email: "lisa@example.com" },
        amount: "3,200",
        status: "Pending",
    },
    {
        transaction: "TXN-2024-004",
        date: "1/18/2024",
        time: "5:45:00 PM",
        user: { name: "Emily Davis", email: "emily@example.com" },
        amount: "1,500",
        status: "Failed",
    },
    {
        transaction: "TXN-2024-005",
        date: "1/19/2024",
        time: "10:05:00 AM",
        user: { name: "Alex Rodriguez", email: "alex@example.com" },
        amount: "2,750",
        status: "Completed",
    },
    {
        transaction: "TXN-2024-006",
        date: "1/20/2024",
        time: "4:10:00 PM",
        user: { name: "John Smith", email: "john@example.com" },
        amount: "800",
        status: "Pending",
    },
    {
        transaction: "TXN-2024-007",
        date: "1/21/2024",
        time: "11:55:00 AM",
        user: { name: "Olivia Brown", email: "olivia@example.com" },
        amount: "2,300",
        status: "Completed",
    },
    {
        transaction: "TXN-2024-008",
        date: "1/22/2024",
        time: "6:40:00 PM",
        user: { name: "David Lee", email: "david@example.com" },
        amount: "950",
        status: "Failed",
    },
    {
        transaction: "TXN-2024-009",
        date: "1/23/2024",
        time: "3:10:00 PM",
        user: { name: "Nina Patel", email: "nina@example.com" },
        amount: "1,800",
        status: "Completed",
    },
    {
        transaction: "TXN-2024-010",
        date: "1/24/2024",
        time: "8:25:00 AM",
        user: { name: "Mohamed Ali", email: "mohamed@example.com" },
        amount: "2,600",
        status: "Completed",
    },
];

const columns = [
    {
        header: "Transaction",
        key: "transaction",
        render: (row) => (
            <div>
                <div className="font-semibold text-white">{row.transaction}</div>
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
            <div className="text-white">{row.amount}</div>
        ),
    },
    {
        header: "Status",
        key: "status",
        render: (row) => {
            if (row.status === "Completed") {
                return (
                    <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-green-200 text-dark-800">
                        <CircleCheck size={16} /> Completed
                    </span>
                );
            }
            if (row.status === "Pending") {
                return (
                    <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-yellow-200 text-yellow-900">
                        <Clock size={16} /> Pending
                    </span>
                );
            }
            if (row.status === "Failed") {
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
        render: () => (
            <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5 flex items-center justify-center"
                style={{
                    background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                }}>
                <MoreVertical className="text-light w-5 h-5" />
            </button>
        ),
    },
];

export default function Page() {
    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">Transaction Management</h1>
                <p className="text-light/60">View and manage user transactions</p>
            </div>
            <SearchFilterBar className="mt-3 mb-5" />
            <Table columns={columns} data={tableData} />
        </main>
    );
}
