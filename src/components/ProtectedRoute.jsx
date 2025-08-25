"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./ui/Loader";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/login");
        } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
            router.replace("/");
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role))) {
        return <Loader />;
    }

    return children;
}
