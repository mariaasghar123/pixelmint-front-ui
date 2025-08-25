"use client";
import Button from "../ui/Button";
import { usePathname, useRouter } from "next/navigation";

const headerPropsByPath = {
    "/user": {
        title: "Buy Pixels",
        subtitle: "Purchase pixels to display your ad",
        btnText: "Buy Pixels",
    },
    "/user/ads": {
        title: "Buy Pixels",
        subtitle: "Purchase pixels to display your ad",
        btnText: "Add Ads",
    },
    "/user/query": {
        title: "Query",
        subtitle: "Manage your Query",
        btnText: null,
    },
};

function isAdminRoute(pathname) {
    return pathname.startsWith("/admin");
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter()
    const headerProps = headerPropsByPath[pathname] || {};
    const { title, subtitle, btnText } = headerProps

    if (isAdminRoute(pathname)) {
        return (
            <header className="flex items-center p-4 px-6 bg-dark-800 rounded-xl">
                <input
                    type="text"
                    placeholder="Search Users, Transactions..."
                    className="w-full max-w-md px-4 py-3 rounded-lg bg-dark-700 text-light text-lg focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <Button className="ml-4 h-full" onClick={() => router.push("/")}>Home</Button>
            </header >
        )
    }

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-dark-800 rounded-xl">
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-light">{title}</h2>
                <span className="text-lg text-gray-400">{subtitle}</span>
            </div>
            {
                btnText &&
                <Button className="text-lg mr-4">{btnText}</Button>
            }
            <Button className="text-lg h-full" onClick={() => router.push("/")}>Home</Button>

        </header>
    );
}
