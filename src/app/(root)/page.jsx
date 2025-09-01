"use client";
import BuyerList from "@/components/BuyerList"
import PixelCanvas from "@/components/PixelCanvas"
import StatBox from "@/components/StatBox"
import StayConnected from "@/components/StayConnected"
import { MdGridOn } from "react-icons/md"
import { FaUsers } from "react-icons/fa"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api";

const stats = [
    {
        icon: MdGridOn,
        value: "404",
        label: "PIXELS SOLD",
    },
    {
        icon: FaUsers,
        value: "1 $USDT",
        label: "PIXELS RATE",
    },
    {
        icon: FaUsers,
        value: "10 x 10px",
        label: "MINIMUM BUY",
    },
]

const buyers = [
    {
        name: "Shopverse",
        avatar: "/shopverse.png",
        bought: "45x40 px",
        position: "(--, --)",
    },
    {
        name: "Shopverse",
        avatar: "/shopverse.png",
        bought: "45x40 px",
        position: "(--, --)",
    },
    {
        name: "Shopverse",
        avatar: "/shopverse.png",
        bought: "45x40 px",
        position: "(--, --)",
    },
    {
        name: "Shopverse",
        avatar: "/shopverse.png",
        bought: "45x40 px",
        position: "(--, --)",
    },
    {
        name: "Shopverse",
        avatar: "/shopverse.png",
        bought: "45x40 px",
        position: "(--, --)",
    },
]


export default function Home() {

    const { data: topBuyers } = useQuery({
        queryKey: ['top-buyers'],
        queryFn: async () => {
            const data = await api.get("/user/top-area-buyers")
            console.log(data)
            return data.data.payload
        }
    })

    const { data: recentBuyers } = useQuery({
        queryKey: ['recent-buyers'],
        queryFn: async () => {
            const data = await api.get("/user/top-recent-buyers")
            console.log(data)
            return data.data.payload
        }
    })

    return (
        <main className="w-[90%] mx-auto flex flex-col gap-6 my-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                {stats.map((stat, i) => (
                    <StatBox key={i} {...stat} />
                ))}
            </div>
            <PixelCanvas />
            <BuyerList title="Biggest Buyers" buyers={topBuyers?.length !== 0 ? topBuyers : buyers} iconColor="#FF9900" />
            <BuyerList buyers={recentBuyers?.length !== 0 ? recentBuyers : buyers} showColors={false} icon="FaClock" />
            <BuyerList title="Our Clients" buyers={buyers} showColors={false} icon="FaUsers" />
            <StayConnected />
        </main>
    )
}

