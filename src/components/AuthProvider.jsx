"use client";
import React, { createContext, useContext, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { connectors, isLoading: connectLoading } = useConnect();
    const { signMessageAsync, isLoading: signLoading } = useSignMessage();
    const { disconnect } = useDisconnect();
    const router = useRouter();
    const queryClient = useQueryClient();

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
            } catch (err) { }
            return null;
        },
        staleTime: 2700000
    });

    const authenticate = async () => {
        if (!address) {
            toast.error("Wallet address required for authentication.");
            return false;
        }
        try {
            const nonceRes = await api.post("/auth/nonce", { walletAddress: address });
            const nonce = nonceRes.data.payload.nonce;
            const signature = await signMessageAsync({ message: nonce });
            const loginRes = await api.post("/auth/connect", {
                walletAddress: address,
                nonce,
                signature,
            });
            console.log(loginRes)
            if (loginRes.data.success) {
                toast.success("Logged in!");
                refetchStatus();
                queryClient.invalidateQueries(["auth-status"]);
                router.push("/");
                return true;
            } else {
                toast.error(`Login failed: ${loginRes.data.message || "Unknown error"}`);
                return false;
            }
        } catch (err) {
            console.error(err);
            toast.error("Authentication failed.");
            return false;
        }
    };

    // Step: Logout
    const logout = async () => {
        try {
            await api.post("/auth/disconnect", {});
            disconnect();
            refetchStatus();
            queryClient.setQueryData(['auth-status'], null);
            toast.success("Logged out!");
            router.push("/auth/login");
        } catch (err) {
            console.error(err);
            toast.error("Logout failed.");
        }
    };

    return (
        <AuthContext.Provider value={{
            user: userData,
            address,
            isConnected,
            authenticate,
            logout,
            connectLoading,
            signLoading,
            loading: statusLoading,
            refetchStatus,
            connectors,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
