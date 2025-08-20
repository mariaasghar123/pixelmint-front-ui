"use client";
import { useQuery } from "@tanstack/react-query";
import AdsList from "@/components/Panel/AdsList";

async function fetchAds() {
    const res = await axios.get("http://localhost:5000/api/ads");
    if (!res.ok) throw new Error("Failed to fetch ads");
    return res.data.payload;
}
const DUMMY_ADS = [
    {
        id: 1,
        title: "My Tech Blog",
        url: "https://myblog.com",
        pixels: 500,
        logo: "https://placehold.co/56x56?text=Ad",
    },
    {
        id: 2,
        title: "My Tech Blog",
        url: "https://myblog.com",
        pixels: 500,
        logo: "https://placehold.co/56x56?text=Ad",
    },
    {
        id: 3,
        title: "My Tech Blog",
        url: "https://myblog.com",
        pixels: 500,
        logo: "https://placehold.co/56x56?text=Ad",
    },
];

export default function AdsPage() {
    const { data: ads = [] } = useQuery({
        queryKey: ["ads"],
        queryFn: fetchAds,
    });

    return (
        <div className="w-full flex justify-center">
            <AdsList
                ads={DUMMY_ADS}
            />
        </div>
    );
}
