"use client";
import React from "react";

export default function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="relative z-10 bg-dark-800 rounded-2xl p-8 shadow-xl w-full max-w-md mx-auto flex flex-col items-center">
                {children}
                <button
                    className="mt-4 px-4 py-2 rounded-lg bg-green-200 text-dark-800 font-semibold hover:bg-green-300"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
