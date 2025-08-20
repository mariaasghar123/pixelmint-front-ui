"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/auth/status");
            setIsAuthenticated(true);
            setUser(res.data.payload?.user || null);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    }, []);

    const connectMetaMask = useCallback(async () => {
        if (typeof window === "undefined" || !window.ethereum || !window.ethereum.isMetaMask) {
            toast.error("MetaMask extension not detected. Please install MetaMask and refresh the page.");
            return;
        }
        toast.info("Connecting to MetaMask...");
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Get nonce
            const nonceRes = await api.post('/auth/nonce', { walletAddress });
            const nonce = nonceRes.data.payload.nonce;

            // Sign nonce
            const signedToken = await window.ethereum.request({
                method: "personal_sign",
                params: [nonce, walletAddress],
            });

            // Connect wallet
            const loginRes = await api.post(
                "/auth/connect",
                {
                    walletAddress,
                    nonce,
                    signature: signedToken,
                }
            );
            const loginResult = loginRes.data;

            if (loginResult.success) {
                toast.success("Logged in successfully!");
                await checkAuthStatus();
            } else {
                toast.error(`Login failed: ${loginResult.message || "Unknown error"}`);
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            console.error("MetaMask login error:", err);
            toast.error("Failed to connect or authenticate with MetaMask.");
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [checkAuthStatus]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await api.post("/auth/disconnect");
            toast.info("Logged out.");
            await checkAuthStatus();
        } catch (err) {
            toast.error("Failed to logout.");
        }
        setLoading(false);
    }, [checkAuthStatus]);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            connectMetaMask,
            logout,
            isAuthenticated,
            checkAuthStatus,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
