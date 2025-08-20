import BuyerList from "@/components/BuyerList";
import PixelCanvas from "@/components/PixelCanvas";
import StatBox from "@/components/StatBox";
import StayConnected from "@/components/StayConnected";
import { Grid, Users } from "lucide-react";

const stats = [
    {
        icon: Grid,
        value: "404",
        label: "PIXELS SOLD",
    },
    {
        icon: Users,
        value: "1 $USDT",
        label: "PIXELS RATE",
    },
    {
        icon: Users,
        value: "10 x 10px",
        label: "MINIMUM BUY",
    },
];

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
];

export default function Home() {
    return (
        <main className="w-[90%] mx-auto flex flex-col gap-6 my-6">
            <div className="flex gap-4 justify-end">
                {stats.map((stat, i) => (
                    <StatBox key={i} {...stat} />
                ))}
            </div>
            <PixelCanvas />
            <BuyerList title="Biggest Buyers" buyers={buyers} showCrown={true} />
            <BuyerList buyers={buyers} showColors={false} />
            <StayConnected />
        </main>
    )
}
