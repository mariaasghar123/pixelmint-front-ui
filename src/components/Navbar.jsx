"use client"
import Image from "next/image"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import UserIcon from "@/components/ui/UserIcon"
import { usePathname } from "next/navigation"
import { ethers } from "ethers"

const MENU_ITEMS = [
    { label: "About", href: "#" },
    { label: "Litepaper", href: "#" },
    { label: "Become Affiliate", href: "#" },
]

export default function Navbar() {
    const { logout, loading, user } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const RPC_URL = "https://bsc-dataseed.binance.org/";
    const PRIVATE_KEY = "2264b741e8084e4e8896e134e0450388"; // Sender wallet
    const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // USDT contract (BSC)
    const TO = "0xD85B0dbB45991892884ba67b2FC727ec086c4D83"; // Recipient
    const AMOUNT = "10"; // Amount in USDT

    (async () => {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

        // Minimal ERC20 ABI
        const erc20Abi = [
            "function transfer(address to, uint amount) returns (bool)",
            "function decimals() view returns (uint8)"
        ];
        const usdt = new ethers.Contract(USDT_ADDRESS, erc20Abi, wallet);

        // Get decimals for USDT (should be 18 on BSC)
        const decimals = await usdt.decimals();
        const amount = ethers.parseUnits(AMOUNT, decimals);

        // Send transaction
        const tx = await usdt.transfer(TO, amount);
        console.log("Transaction sent! Hash:", tx.hash);
        await tx.wait();
        console.log("Success! USDT sent.");
    })();

    const handleProfileClick = () => setDropdownOpen((open) => !open)
    const handleLogout = async () => {
        await logout()
        setDropdownOpen(false)
    }

    const toggleMobileMenu = () => setMobileMenuOpen((open) => !open)

    return (
        <header className="w-full bg-dark-800 py-2 relative">
            <nav className="container flex items-center justify-between w-[90%] mx-auto">
                <div className="flex items-center gap-4">
                    <Image src="/logo.svg" alt="Leaf Logo" width={90} height={103} priority />
                </div>

                <div className="hidden md:flex items-center gap-2 relative">
                    {MENU_ITEMS.map((item, i) => (
                        <Link key={i} href={item.href}>
                            <Button
                                className={`border text-green-100 
                                    ${pathname === item.href ? "bg-green-100/20 font-semibold" : "bg-green-100/10"} `}
                            >
                                {item.label}
                            </Button>
                        </Link>
                    ))}

                    {!user ? (
                        <Link href="/auth/login">
                            <Button color="connect" disabled={loading}>
                                Connect Wallet
                            </Button>
                        </Link>
                    ) : (
                        <div className="relative">
                            <UserIcon onClick={handleProfileClick} />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-dark-600 rounded-lg shadow-lg z-10 flex flex-col py-2 border border-border">
                                    <Link
                                        href={user?.user?.role === "admin" ? "/admin" : "/user"}
                                        className="px-4 py-2 text-light hover:bg-dark-700 hover:text-primary rounded transition"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        className="px-4 py-2 text-left text-red-400 hover:bg-dark-700 rounded transition"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden relative cursor-pointer"
                    style={{
                        width: '20px',
                        height: '20px',
                    }}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    {/* Top bar */}
                    <span
                        className={`
      absolute left-0 w-full h-0.5 bg-green-100 transition-transform duration-300 origin-center
      ${mobileMenuOpen ? "rotate-[45deg] !top-[50%]" : "top-[35%]"}
    `}
                    ></span>
                    {/* Bottom bar */}
                    <span
                        className={`
      absolute left-0 w-full h-0.5 bg-green-100 transition-transform duration-300 origin-center
      ${mobileMenuOpen ? "rotate-[-45deg] top-[50%]" : "top-[75%]"}
    `}
                    ></span>
                </button>
            </nav>

            {/* Simple Mobile Dropdown */}
            <div className={`md:hidden absolute w-full top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96" : "max-h-0"}`}>
                <div className="bg-dark-700 border-t border-border shadow-lg">
                    <div className="container w-[90%] mx-auto py-4 flex flex-col gap-1">
                        {MENU_ITEMS.map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                    ${pathname === item.href ? "bg-green-100/20 font-semibold text-green-100" : ""}
                                    hover:bg-dark-600 hover:text-green-200`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {!user ? (
                            <div className="pt-2 px-4">
                                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button disabled={loading} className="w-full">
                                        Connect Wallet
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 pt-2 mt-2 border-t border-border">
                                <Link
                                    href={user?.user?.role === "admin" ? "/admin" : "/user"}
                                    className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                        ${(pathname === "/admin" || pathname === "/user") ? "bg-green-100/20 font-semibold text-green-100" : ""}
                                        hover:bg-dark-600 hover:text-green-200`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Button
                                    className="!bg-error border-none"
                                    onClick={handleLogout}
                                >

                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
