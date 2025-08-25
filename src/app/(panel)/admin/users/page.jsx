"use client";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import { Check, Clock, Eye, Image, Trash2 } from "lucide-react";

const tableData = [
    {
        name: "Premium Web Design Services",
        website: "https://sarahdesigns.com/",
        pixels: "2,500",
        value: "$250 value",
        ads: "02",
        date: "1/15/2024",
        time: "3:30:00 PM",
        status: "Pending",
    },
    {
        name: "AI-Powered Marketing Tools",
        website: "https://aimarketing.com/",
        pixels: "5,000",
        value: "$500 value",
        ads: "02",
        date: "1/14/2024",
        time: "8:45:00 PM",
        status: "Approved",
    },
    {
        name: "Crypto Investment Platform",
        website: "https://sarahdesigns.com/",
        pixels: "1,000",
        value: "$100 value",
        ads: "02",
        date: "1/13/2024",
        time: "2:20:00 PM",
        status: "Pending",
    },
    {
        name: "Online Learning Platform",
        website: "https://sarahdesigns.com/",
        pixels: "3,200",
        value: "$320 value",
        ads: "02",
        date: "1/12/2024",
        time: "7:10:00 PM",
        status: "Approved",
    },
    {
        name: "Fitness Coaching App",
        website: "https://fitcoach.app",
        pixels: "750",
        value: "$75 value",
        ads: "02",
        date: "1/11/2024",
        time: "4:30:00 PM",
        status: "Pending",
    },
];

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
        header: "Ads Posted",
        key: "ads",
        render: (row) => (
            <div className="flex flex-col items-start">
                <span className="text-white">{row.ads}</span>
                <div className="flex">
                    <Image className="text-light/40" />
                    <Image className="text-light/40" />
                </div>
            </div>
        ),
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
        header: "Status",
        key: "status",
        render: (row) => (
            <span
                className={`rounded-full px-3 py-1 font-medium text-sm flex items-center gap-2 ${row.status === "Approved"
                    ? "bg-green-200 text-dark-800"
                    : "bg-yellow-200 text-yellow-900"
                    }`}
            >
                {row.status === "Approved" ? <Check size={16} /> : <Clock size={16} />} {row.status}
            </span>
        ),
    },
    {
        header: "Actions",
        key: "actions",
        render: (row) => (
            <div className="flex gap-2">
                <div className="flex gap-2">
                    <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                        style={{
                            background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                        }}
                    >
                        <Eye className="text-light w-5 h-5" />
                    </button>
                    <button className="bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                        style={{
                            background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
                        }}
                    >
                        <Trash2 className="text-error w-5 h-5" />
                    </button>
                </div>
            </div>
        ),
    },
];

export default function Page() {
    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">User Management</h1>
                <p className="text-light/60">Manage Users and their pixel purchases</p>
            </div>
            <SearchFilterBar className="mt-3 mb-5" />
            <Table columns={columns} data={tableData} />
        </main>
    );
}
