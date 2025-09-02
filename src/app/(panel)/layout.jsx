"use client";
import Sidebar from "@/components/Panel/Sidebar";
import Header from "@/components/Panel/Header";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/ui/Loader";

export default function Layout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user?.user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (loading || !user?.user) return <Loader />;

    return (
        <div className="flex min-h-[100dvh] w-full md:p-4 gap-4">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <div className="p-4 md:p-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
