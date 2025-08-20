"use client";
import { User } from "lucide-react";

export default function UserIcon({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="ml-2 p-2 rounded-full transition-colors ease-in duration-300 focus:outline-none bg-green-100 hover:bg-green-100/60 font-ari font-semibold text-dark-800 cursor-pointer"
            aria-label="User Profile"
            type="button"
        >
            <User size={24} fill="#fff" color="#fff" strokeWidth={2} />
        </button>
    );
}
