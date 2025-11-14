"use client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import UserIcon from "@/components/ui/UserIcon";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "About", href: "https://tinyurl.com/MPMPitchDeck" },
  { label: "Litepaper", href: "https://tinyurl.com/MPMLightPaper" },
];

export default function Navbar() {
  const { logout, loading, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleProfileClick = () => setDropdownOpen((open) => !open);
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);

  return (
    <header className="w-full bg-dark-800 py-2 relative">
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

        <div className="hidden md:flex items-center gap-2 relative">
          {MENU_ITEMS.map((item, i) => (
            <a key={i} target="_blank" href={item.href}>
              <Button
                className={`border text-green-100 
                                    ${pathname === item.href ? "bg-green-100/20 font-semibold" : "bg-green-100/10"} `}
              >
                {item.label}
              </Button>
            </a>
          ))}

          <a target="_blank" href="https://tinyurl.com/MyPixelMintAffForm">
            <Button>Become Affiliate</Button>
          </a>

          {!user ? (
            <Link href="/auth/login">
              <Button disabled={loading}>Connect Wallet</Button>
            </Link>
          ) : (
            <div className="relative">
              <UserIcon onClick={handleProfileClick} />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-dark-600 rounded-lg shadow-lg z-10 flex flex-col py-2 border border-border">
                  <Link
                    href="/user/ads"
                    className="px-4 py-2 text-light hover:bg-dark-700 hover:text-primary rounded transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.user?.role == "admin" && (
                    <Link
                      href="/admin"
                      className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                        ${pathname === "/admin" ? "bg-green-100/20 font-semibold text-green-100" : ""}
                                        hover:bg-dark-600 hover:text-green-200`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
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
            width: "20px",
            height: "20px",
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
      <div
        className={`md:hidden absolute w-full top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="bg-dark-700 border-t border-border shadow-lg">
          <div className="container w-[90%] mx-auto py-4 flex flex-col gap-1">
            {MENU_ITEMS.map((item, i) => (
              <a
                key={i}
                target="_blank"
                href={item.href}
                className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                    hover:bg-dark-600 hover:text-green-200`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="border border-[1px] border-green-100 bg-green-100/10 w-full text-green-100">
                  {item.label}
                </Button>
              </a>
            ))}
            <a
              href="https://tinyurl.com/MyPixelMintAffForm"
              target="_blank"
              className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                    hover:bg-dark-600 hover:text-green-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full">Become Affiliate</Button>
            </a>

            {!user ? (
              <div className="pt-2 px-4">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button disabled={loading} className="w-full">
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-2 mt-2 border-t border-border">
                <Link
                  href="/user/ads"
                  className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                        ${pathname === "/user" ? "bg-green-100/20 font-semibold text-green-100" : ""}
                                        hover:bg-dark-600 hover:text-green-200`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.user?.role == "admin" && (
                  <Link
                    href="/admin"
                    className={`py-2 px-4 rounded-lg transition-colors duration-200 focus-visible:outline-none
                                        ${pathname === "/admin" ? "bg-green-100/20 font-semibold text-green-100" : ""}
                                        hover:bg-dark-600 hover:text-green-200`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
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
  );
}
