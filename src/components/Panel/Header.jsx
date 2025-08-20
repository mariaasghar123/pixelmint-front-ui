"use client";
import Button from "../ui/Button";
import { usePathname } from "next/navigation";

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

export default function Header() {
    const pathname = usePathname();
    const headerProps = headerPropsByPath[pathname] || {};
    const { title, subtitle, btnText } = headerProps

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-dark-800 rounded-xl">
            <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-light">{title}</h2>
                <span className="text-lg text-gray-400">{subtitle}</span>
            </div>
            {
                btnText &&
                <Button className="text-lg">{btnText}</Button>
            }
        </header>
    );
}
