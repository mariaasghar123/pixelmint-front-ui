"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./ui/Loader";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user } = useAuth();
    console.log(user)
    const router = useRouter();

    useEffect(() => {
        if (!user?.user) {
            router.replace("/auth/login");
        } else if (allowedRoles && !allowedRoles.includes(user?.user.role)) {
            router.replace("/");
        }
    }, [user, allowedRoles, router]);

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Loader />;
    }

    return children;
}
