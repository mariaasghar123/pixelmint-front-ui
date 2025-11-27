"use client";
import { useQuery } from "@tanstack/react-query";
import SearchFilterBar from "@/components/Panel/SearchFilterBar";
import Table from "@/components/Panel/Table";
import { Eye, CircleCheck, CircleX } from "lucide-react";
import { formatDateTime } from "@/utils/date.utils";
import api from "@/lib/api";
import AdvertisementPreviewModal from "@/components/Panel/AdvertismentPreviewModal";
import { useMemo, useState } from "react";


export default function PixelPurchasesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
    const [searchName, setSearchName] = useState("");

    // Fetch purchases
    const { data, isLoading, error } = useQuery({
        queryKey: ["pixel-purchases"],
        queryFn: async () => {
            const res = await api.get("/pixel/purchases");
            return res.data.payload.pixel;
        },
    });

    const handleViewAd = (row) => {
        setIsModalOpen(true);
        console.log(row)
        const ad = data.find(v => v._id === row.id)
        setSelectedAd(ad);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAd(null);
    };

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
                    <div className="font-semibold text-white">{row.owner?.name || "N/A"}</div>
                    <div className="text-light/40 text-sm">{row.owner?.email || "N/A"}</div>
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
        ,
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
                        onClick={() => handleViewAd(row)}
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

    const tableData = (data || []).map((item) => {
        const { date, time } = formatDateTime(item.createdAt);

        return {
            id: item._id,
            name: item.adTitle,
            website: item.websiteUrl,
            owner: {
                name: item.displayName,
                email: "",
            },
            pixels: item.pixelArea.area.toLocaleString(),
            value: `$${item.pixelArea.area} value`,
            status: "Approved",
            date,
            time,
        };
    });

    const filteredTableData = useMemo(() => {
        if (!searchName) return tableData;
        return tableData.filter(row =>
            row.name?.toLowerCase().includes(searchName.toLowerCase())
        );
    }, [searchName, tableData]);

    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">Pixel Purchases</h1>
                <p className="dark:text-light/60">Review and manage pixel ad purchases</p>
            </div>
            <SearchFilterBar className="mt-3 mb-5" searchValue={searchName} onSearchChange={setSearchName} />
            <Table columns={columns} data={filteredTableData} isLoading={isLoading} />
            {error && <div className="text-error mt-4">Failed to load purchases.</div>}
            <AdvertisementPreviewModal isOpen={isModalOpen} onClose={handleCloseModal} ad={selectedAd} />
        </main>
    );
}
