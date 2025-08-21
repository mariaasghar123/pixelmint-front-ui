"use client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import UserIcon from "@/components/ui/UserIcon";

export default function Navbar() {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleProfileClick = () => setDropdownOpen((open) => !open);
    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
    };

    return (
        <header className="w-full bg-dark-800 py-2">
            <nav className="container flex items-center justify-between w-[90%] mx-auto">
                <div className="flex items-center gap-4">
                    <Image
                        src="/logo.svg"
                        alt="Leaf Logo"
                        width={90}
                        height={103}
                        priority
                    />
                </div>

                <div className="flex items-center gap-2 relative">
                    <Button className="bg-green-100/10 border border-green-100 text-green-100">
                        About the Project
                    </Button>
                    <Button className="bg-green-100/10 border border-green-100 text-green-100">
                        Litepaper
                    </Button>
                    <Button>Become Affiliate</Button>

                    {!isAuthenticated ? (
                        <Link href="/auth/login">
                            <Button color="connect" disabled={loading}>Connect Wallet</Button>
                        </Link>
                    ) : (
                        <div className="relative">
                            <UserIcon onClick={handleProfileClick} />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-dark-600 rounded-lg shadow-lg z-10 flex flex-col py-2 border border-border">
                                    <Link
                                        href="/user"
                                        className="px-4 py-2 text-light hover:bg-dark-700 rounded transition"
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
            </nav>
        </header >
    );
}
