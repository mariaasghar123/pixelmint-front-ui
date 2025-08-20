"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChartBar, FaSearch } from "react-icons/fa";

const tabs = [
    {
        name: "Your Pixels",
        icon: FaHome,
        path: "/user",
    },
    {
        name: "My Ads",
        icon: FaChartBar,
        path: "/user/ads",
    },
    {
        name: "Query",
        icon: FaSearch,
        path: "/user/query",
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    console.log(pathname)

    return (
        <aside className="bg-dark-800 min-h-screen w-44 flex flex-col py-6 px-4 rounded-2xl min-w-[250px]">
            <div className="flex items-center justify-center gap-2 mb-3 px-2" >

                <img src="/logo_no_label.svg" alt="Logo" width={32} height={32} />

                <span className="font-semibold font-ari text-2xl">
                    <span className="text-[#1E894B]">
                        my
                    </span>
                    <span className="text-[#5DD075]">
                        Pixel
                    </span>
                    <span className="text-green-100">
                        Mint
                    </span>
                </span>
            </div>
            <hr className="h-[1px] border-0 w-full mb-8" style={{
                background: "linear-gradient(90deg, #98F08C00 0%,#98F08C 50%,#98F08C28 100%)"
            }} />

            <nav className="flex flex-col gap-3">
                {tabs.map((tab) => {
                    const active = (pathname === tab.path);
                    const Icon = tab.icon;
                    return (
                        <Link key={tab.name} href={tab.path}>
                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition
                                  ${active
                                        ? "bg-green-100 text-dark-700"
                                        : "bg-dark-800 hover:bg-[#224C38] cursor-pointer"}
                                `}
                            >
                                <div className={`p-2 rounded-xl ${active ? 'bg-[#0024201A]' : 'bg-green-100'}`}>
                                    <Icon size={18} strokeWidth={2} className="text-dark-800" />
                                </div>
                                {tab.name}
                            </button>
                        </Link>
                    );
                })}
            </nav>
        </aside >
    );
}
