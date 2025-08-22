"use client";
import React, { createContext, useContext } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isLoading: connectLoading } = useConnect();
    const { signMessageAsync, isLoading: signLoading } = useSignMessage();
    const { disconnect } = useDisconnect();
    const router = useRouter();

    // Authenticate
    const authenticate = async () => {
        if (!address) {
            toast.error("Please connect your wallet first.");
            return;
        }
        try {
            // 1. Get nonce from backend
            const nonceRes = await api.post('/auth/nonce', { walletAddress: address });
            const nonce = nonceRes.data.payload.nonce;

            // 2. Sign nonce using wagmi
            const signature = await signMessageAsync({ message: nonce });

            // 3. Send signature to backend
            const loginRes = await api.post("/auth/connect", {
                walletAddress: address,
                nonce,
                signature,
            });

            if (loginRes.data.success) {
                toast.success("Logged in!");
                router.push("/");
            } else {
                toast.error(`Login failed: ${loginRes.data.message || "Unknown error"}`);
            }
        } catch (err) {
            toast.error("Authentication failed.");
        }
    };

    return (
        <AuthContext.Provider value={{
            address,
            isConnected,
            connect,
            connectors,
            connectLoading,
            authenticate,
            logout: disconnect,
            signLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
