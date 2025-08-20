"use client";
import { useAuth } from "../AuthProvider";

function Loader() {
    "use client";
    const { loading } = useAuth();
    if (!loading) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-800 bg-opacity-70">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full border-4 border-t-green-300 border-gray-300 h-12 w-12 mb-4"></div>
                <div className="text-light text-xl font-semibold">Loading...</div>
            </div>
        </div>
    );
}

export default Loader
