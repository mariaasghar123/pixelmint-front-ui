"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./ui/Loader";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user?.user) {
                router.replace("/auth/login");
                setChecking(true);
            } else if (allowedRoles && !allowedRoles.includes(user.user.role)) {
                router.replace("/");
                setChecking(true);
            } else {
                setChecking(false);
            }
        }
    }, [user, loading, allowedRoles, router]);

    if (loading || checking) {
        return <Loader />;
    }

    return children;
}
