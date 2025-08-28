"use client";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Loader from "@/components/ui/Loader";
import { config } from "../../wagmi.config";
import { WagmiProvider } from 'wagmi';
import { modal } from "../../appkit.config";

function AuthGate({ children }) {
    const { loading } = useAuth();
    if (loading) return <Loader />;
    return children;
}

export default function AppProviders({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryProvider>
                <AuthProvider>
                    <AuthGate>
                        {children}
                    </AuthGate>
                </AuthProvider>
            </QueryProvider>
        </WagmiProvider>
    );
}
