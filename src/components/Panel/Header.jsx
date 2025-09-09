"use client"
import { useState } from "react"
import Button from "../ui/Button"
import { usePathname, useRouter } from "next/navigation"
import {
    FaHome,
    FaChartBar,
    FaSearch,
    FaRegCreditCard,
    FaCog,
    FaUsers,
    FaUserAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa"

const headerPropsByPath = {
    "/user": {
        title: "Buy Pixels",
        subtitle: "Purchase pixels to display your ad",
        btnText: null,
    },
    "/user/ads": {
        title: "Buy Pixels",
        subtitle: "Purchase pixels to display your ad",
        btnText: null,
    },
    "/user/query": {
        title: "Query",
        subtitle: "Manage your Query",
        btnText: null,
    },
    "/admin": {
        title: null,
        subtitle: null,
        btnText: null,
    },
    "/admin/users": {
        title: null,
        subtitle: null,
        btnText: null,
    },
    "/admin/ads": {
        title: null,
        subtitle: null,
        btnText: null,
    },
    "/admin/payments": {
        title: null,
        subtitle: null,
        btnText: null,
    },
    "/admin/settings": {
        title: null,
        subtitle: null,
        btnText: null,
    },
}

const userTabs = [
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
]

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
]

function getTabsForPath(pathname) {
    if (pathname.startsWith("/admin")) return adminTabs
    return userTabs
}

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const headerProps = headerPropsByPath[pathname] || {}
    const { title, subtitle, btnText } = headerProps
    const tabs = getTabsForPath(pathname)

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

    const handleNavigation = (path) => {
        router.push(path)
        setIsDropdownOpen(false)
    }

    return (
        <div className="relative">
            <header className="flex items-center justify-between md:justify-start p-4 px-4 bg-dark-800 md:rounded-xl">
                {/* Logo on mobile */}
                <div className="flex md:hidden items-center justify-center gap-2 px-2" >
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

                {/* Dropdown toggle for mobile */}
                <button
                    onClick={toggleDropdown}
                    className="md:hidden p-2 text-green-100 hover:text-green-200 transition-colors mr-3 cursor-pointer"
                >
                    {isDropdownOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* Header title & subtitle */}
                <div className={`hidden md:flex flex-col justify-center mr-6 ${!!(title === null && subtitle === null) ?? 'hidden'}`}>
                    <h2 className="text-2xl font-semibold text-light">{title}</h2>
                    <span className="text-lg text-gray-400">{subtitle}</span>
                </div>

                {/* Search bar for admin, can be extended for user */}
                <input
                    type="text"
                    placeholder={pathname.startsWith("/admin") ? "Search Users, Transactions..." : "Search Ads, Pixels..."}
                    className="hidden md:block ml-auto w-full max-w-md px-4 py-3 rounded-lg bg-dark-700 text-light text-lg focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <Button className="hidden md:block ml-4 h-full" onClick={() => router.push("/")}>
                    Home
                </Button>
            </header>

            {/* Mobile Dropdown Tabs */}
            {isDropdownOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-dark-600 shadow-lg border-b border-b-2 border-green-100">
                    <nav className="flex flex-col p-4 gap-2">
                        {/* Tabs (User/Admin based on path) */}
                        {tabs.map((tab) => {
                            const active = pathname === tab.path
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => handleNavigation(tab.path)}
                                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full transition
                                        ${active
                                            ? "bg-green-100 text-dark-700"
                                            : "text-light hover:bg-[#224C38]"
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${active ? "bg-[#0024201A]" : "bg-green-100"}`}>
                                        <Icon size={16} color="#002420" />
                                    </div>
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>
            )}
        </div>
    )
}
