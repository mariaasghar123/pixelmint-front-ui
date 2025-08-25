"use client";
import React, { createContext, useContext } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isLoading: connectLoading } = useConnect();
    const { signMessageAsync, isLoading: signLoading } = useSignMessage();
    const { disconnect } = useDisconnect();
    const router = useRouter();
    const queryClient = useQueryClient()

    const {
        data: userData,
        isLoading: statusLoading,
        refetch: refetchStatus,
    } = useQuery({
        queryKey: ["auth-status"],
        queryFn: async () => {
            try {
                const res = await api.get("/auth/status");
                return res.data.payload;
            } catch (err) {
                console.error(err)
            }
            return null;
        },
        staleTime: 2700000
    });

    const authenticate = async () => {
        if (!address) {
            toast.error("Please connect your wallet first.");
            return;
        }
        try {
            const nonceRes = await api.post('/auth/nonce', { walletAddress: address });
            const nonce = nonceRes.data.payload.nonce;

            const signature = await signMessageAsync({ message: nonce });

            const loginRes = await api.post("/auth/connect", {
                walletAddress: address,
                nonce,
                signature,
            });

            if (loginRes.data.success) {
                toast.success("Logged in!");
                refetchStatus();
                queryClient.invalidateQueries(['auth-status'])
                router.push("/");
            } else {
                toast.error(`Login failed: ${loginRes.data.message || "Unknown error"}`);
            }
        } catch (err) {
            toast.error("Authentication failed.");
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/disconnect", {});
            disconnect();
            refetchStatus();
            queryClient.setQueryData(['auth-status'], null)
            toast.success("Logged out!");
            router.push("/auth/login");
        } catch (err) {
            toast.error("Logout failed.");
        }
    };

    return (
        <AuthContext.Provider value={{
            user: userData,
            address,
            isConnected,
            connect,
            connectors,
            connectLoading,
            authenticate,
            logout,
            signLoading,
            loading: statusLoading,
            refetchStatus,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
