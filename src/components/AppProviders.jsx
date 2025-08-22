"use client";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Loader from "@/components/ui/Loader";

import { config } from "../../wagmi.config";
import { WagmiProvider } from 'wagmi';
import { modal } from "../../appkit.config";


export default function AppProviders({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryProvider>
                <AuthProvider>
                    <Loader />
                    {children}
                </AuthProvider>
            </QueryProvider>
        </WagmiProvider>
    );
}
