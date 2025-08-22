import localFont from "next/font/local"
import { ToastContainer } from "react-toastify";

import AppProviders from "@/components/AppProviders";
import "./globals.css";

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
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}
