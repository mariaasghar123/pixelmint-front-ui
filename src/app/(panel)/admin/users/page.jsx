"use client";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import UserDetailsModal from "@/components/Panel/UserDetailsModal";
import { Eye, ImageIcon, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime } from "@/utils/date.utils";
import api from "@/lib/api";

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchName, setSearchName] = useState("");

    const { data, isLoading, error } = useQuery({
        queryKey: ["user-list"],
        queryFn: async () => {
            const res = await api.get("/user/list");
            return res.data.payload;
        },
    });

    const tableData = useMemo(() => {
        if (!data) return [];
        return data.map(user => {
            // Get user's latest purchase, or fallback to empty
            const lastPurchase = user.purchases?.[user.purchases.length - 1];
            const { date, time } = formatDateTime(lastPurchase?.createdAt);
            return {
                id: user._id,
                name: lastPurchase?.adTitle || user.fullName,
                website: lastPurchase?.websiteUrl || "-",
                pixels: user.totalArea?.toLocaleString() || "0",
                value: user.totalArea ? `$${Math.round(user.totalArea / 100)} value` : "$0 value",
                ads: user.totalPurchases?.toString() || "0",
                date,
                time,
                user,
                adImages: user.purchases?.map(p => p.adImageUrl) || [],
            };
        });
    }, [data]);

    const handleViewUser = (row) => {
        setSelectedUser(row.user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const filteredTableData = useMemo(() => {
        if (!searchName) return tableData;
        return tableData.filter(row =>
            row.name?.toLowerCase().includes(searchName.toLowerCase())
        );
    }, [searchName, tableData]);

    const columns = [
        {
            header: "Name",
            key: "name",
            render: (row) => (
                <div>
                    <div className="font-semibold dark:text-white">{row.name}</div>
                    <div className="dark:text-light/40 text-sm">{row.website}</div>
                </div>
            ),
        },
        {
            header: "Pixels Used",
            key: "pixels",
            render: (row) => (
                <div>
                    <div className="dark:text-white">{row.pixels}</div>
                    <div className="dark:text-light/40 text-gray-600 text-sm">{row.value}</div>
                </div>
            ),
        },
        {
            header: "Ads Posted",
            key: "ads",
            render: (row) => (
                <div className="flex flex-col items-start">
                    <span className="dark:text-white">{row.ads}</span>
                    <div className="flex gap-1">
                        {row.adImages.slice(0, 2).map((src, idx) => (
                            <ImageIcon key={idx} className="dark:text-light/40 text-gray-700" />
                        ))}
                    </div>
                </div>
            ),
        },
        {
            header: "Date Posted",
            key: "date",
            render: (row) => (
                <div>
                    <div className="dark:text-white">{row.date}</div>
                    <div className="dark:text-light/40 text-sm">{row.time}</div>
                </div>
            ),
        },
        {
            header: "Actions",
            key: "actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        className="dark:bg-dark-800 p-2 rounded-lg hover:bg-white/5"
                        style={{
                            background: "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)",
                        }}
                        onClick={() => handleViewUser(row)}
                    >
                        <Eye className="dark:text-light w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">User Management</h1>
                <p className="dark:text-light/60">Manage Users and their pixel purchases</p>
            </div>
            <SearchFilterBar
                className="mt-3 mb-5"
                searchValue={searchName}
                onSearchChange={setSearchName}
            />
            {error ? (
                <div className="text-center py-10 text-error">Failed to load users.</div>
            ) : (
                <Table columns={columns} data={filteredTableData} isLoading={isLoading} />
            )}
            <UserDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} user={selectedUser} />
        </main>
    );
}
