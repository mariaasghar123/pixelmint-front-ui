"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChartBar, FaSearch, FaRegCreditCard, FaCog, FaUser, FaUserAlt, FaUsers } from "react-icons/fa";

const userTabs = [
    // {
    //     name: "Your Pixels",
    //     icon: FaHome,
    //     path: "/user",
    // },
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

const adminTabs = [
    {
        name: "Dashboard",
        icon: FaHome,
        path: "/admin",
    },
    {
        name: "User Management",
        icon: FaUsers,
        path: "/admin/users",
    },
    {
        name: "Ad Moderation",
        icon: FaUserAlt,
        path: "/admin/ads",
    },
    {
        name: "Sales & Payments",
        icon: FaRegCreditCard,
        path: "/admin/payments",
    },
    {
        name: "Settings",
        icon: FaCog,
        path: "/admin/settings",
    },
];

// Utility function to detect if path is admin or user
function getTabsForPath(pathname) {
    if (pathname.startsWith("/admin")) return adminTabs;
    return userTabs;
}

export default function Sidebar() {
    const pathname = usePathname();
    const tabs = getTabsForPath(pathname);

    return (
        <aside className="bg-dark-800 min-h-[calc(100dvh - 1.25rem)] w-44 hidden md:flex flex-col py-6 px-4 rounded-2xl min-w-[250px]">
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
                                    <Icon size={18} strokeWidth={0} color="#002420" />
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
