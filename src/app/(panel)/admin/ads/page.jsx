"use client";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import { Check, Clock, Eye, X, CircleCheck, CircleX, AlertCircle } from "lucide-react";

const tableData = [
    {
        name: "Premium Web Design Services",
        website: "https://sarahdesigns.com/",
        owner: {
            name: "Sarah Johnson",
            email: "sarah@example.com",
        },
        pixels: "2,500",
        value: "$250 value",
        status: "Pending",
        date: "1/15/2024",
        time: "3:30:00 PM",
    },
    {
        name: "AI-Powered Marketing Tools",
        website: "https://aimarketing.com/",
        owner: {
            name: "Mike Chen",
            email: "mike@example.com",
        },
        pixels: "5,000",
        value: "$500 value",
        status: "Approved",
        date: "1/14/2024",
        time: "8:45:00 PM",
    },
    {
        name: "Crypto Investment Platform",
        website: "https://sarahdesigns.com/",
        owner: {
            name: "Alex Rodriguez",
            email: "alex@example.com",
        },
        pixels: "1,000",
        value: "$100 value",
        status: "Reported",
        reportedCount: 5,
        date: "1/13/2024",
        time: "2:20:00 PM",
    },
    {
        name: "Online Learning Platform",
        website: "https://sarahdesigns.com/",
        owner: {
            name: "Emily Davis",
            email: "emily@example.com",
        },
        pixels: "3,200",
        value: "$320 value",
        status: "Approved",
        date: "1/12/2024",
        time: "7:10:00 PM",
    },
    {
        name: "Fitness Coaching App",
        website: "https://fitcoach.app",
        owner: {
            name: "Lisa Wang",
            email: "lisa@example.com",
        },
        pixels: "750",
        value: "$75 value",
        status: "Pending",
        date: "1/11/2024",
        time: "4:30:00 PM",
    },
];

// Columns based on the image
const columns = [
    {
        header: "Name",
        key: "name",
        render: (row) => (
            <div>
                <div className="font-semibold text-white">{row.name}</div>
                <div className="text-light/40 text-sm">{row.website}</div>
            </div>
        ),
    },
    {
        header: "Owner",
        key: "owner",
        render: (row) => (
            <div>
                <div className="font-semibold text-white">{row.owner.name}</div>
                <div className="text-light/40 text-sm">{row.owner.email}</div>
            </div>
        ),
    },
    {
        header: "Pixels Used",
        key: "pixels",
        render: (row) => (
            <div>
                <div className="text-white">{row.pixels}</div>
                <div className="text-light/40 text-sm">{row.value}</div>
            </div>
        ),
    },
    {
        header: "Status",
        key: "status",
        render: (row) => {
            if (row.status === "Approved") {
                return (
                    <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-green-200 text-dark-800">
                        <CircleCheck size={16} /> Approved
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
            if (row.status === "Reported") {
                return (
                    <span className="rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 bg-red-200 text-red-900">
                        <AlertCircle size={16} /> Reported ({row.reportedCount})
                    </span>
                );
            }
        },
    },
    {
        header: "Date Posted",
        key: "date",
        render: (row) => (
            <div>
                <div className="text-white">{row.date}</div>
                <div className="text-light/40 text-sm">{row.time}</div>
            </div>
        ),
    },
    {
        header: "Actions",
        key: "actions",
        render: (row) => (
            <div className="flex gap-2">
                <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                    style={{
                        background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                    }}
                >
                    <Eye className="text-light w-5 h-5" />
                </button>
                {(row.status === "Pending" || row.status === "Reported") && (
                    <>
                        <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                            style={{
                                background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                            }}
                        >
                            <CircleCheck className="text-green-600 w-5 h-5" />
                        </button>
                        <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                            style={{
                                background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                            }}
                        >
                            <CircleX className="text-red-600 w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
        ),
    },
];

export default function AdManagementPage() {
    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">Ad Management</h1>
                <p className="text-light/60">Review and manage ads and their owners</p>
            </div>
            <SearchFilterBar className="mt-3 mb-5" />
            <Table columns={columns} data={tableData} />
        </main>
    );
}
