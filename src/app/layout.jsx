import localFont from "next/font/local"
import { ToastContainer } from "react-toastify";

import QueryProvider from "@/components/QueryProvider";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Loader from "@/components/ui/Loader";

const ari = localFont({
    src: [
        {
            path: "./fonts/ari-w9500-condensed.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/ari-w9500-condensed-display.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/ari-w9500-condensed-bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-ari",
})

export const metadata = {
    title: "Pixel Mint",
    description: "Digital Billboard",
};


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${ari.variable} antialiased`}
            >
                <ToastContainer
                    theme="dark"
                    position="bottom-right"
                    pauseOnHover
                />
                <QueryProvider>
                    <AuthProvider>
                        <Loader />
                        {children}
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
