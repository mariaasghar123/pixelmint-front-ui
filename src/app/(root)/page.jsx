"use client";
import BuyerList from "@/components/BuyerList";
import PixelCanvas from "@/components/PixelCanvas";
import StatBox from "@/components/StatBox";
import StayConnected from "@/components/StayConnected";
import { MdGridOn } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useTotalPixelPurchased } from "@/api/pixel";

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
];

export default function Home() {
  const { data: topBuyers } = useQuery({
    queryKey: ["top-buyers"],
    queryFn: async () => {
      const data = await api.get("/user/buyers/area");
      return data.data.payload;
    },
  });

  const { data: ourClients } = useQuery({
    queryKey: ["our-clients"],
    queryFn: async () => {
      const data = await api.get("/user/clients");
      return data.data.payload;
    },
  });

  const { data: recentBuyers } = useQuery({
    queryKey: ["recent-buyers"],
    queryFn: async () => {
      const data = await api.get("/user/buyers/recent");
      return data.data.payload;
    },
  });

  const { data: totalPixels, isLoading, isError } = useTotalPixelPurchased();

  const stats = [
    {
      icon: MdGridOn,
      value: isLoading || isError ? "404" : totalPixels,
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
  ];

  return (
    <main className="w-[90%] mx-auto flex flex-col gap-6 my-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
        {stats.map((stat, i) => (
          <StatBox key={i} {...stat} />
        ))}
      </div>
      <PixelCanvas />
      <BuyerList
        title="Biggest Buyers"
        buyers={topBuyers?.length !== 0 ? topBuyers : buyers}
        iconColor="#FF9900"
      />
      <BuyerList
        buyers={recentBuyers?.length !== 0 ? recentBuyers : buyers}
        showColors={false}
        icon="FaClock"
      />
      <BuyerList
        title="Our Clients"
        buyers={ourClients?.length !== 0 ? ourClients : buyers}
        showColors={false}
        icon="FaUsers"
      />
      <StayConnected />
    </main>
  );
}
