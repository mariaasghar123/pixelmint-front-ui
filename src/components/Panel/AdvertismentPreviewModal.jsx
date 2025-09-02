"use client";
import { useState } from "react";
import { X, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function AdvertisementPreviewModal({ isOpen, onClose, ad }) {
    const queryClient = useQueryClient()
    const [moderatorNote, setModeratorNote] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: async (note) => {
            if (!ad?._id) throw new Error("Ad ID is missing");
            const res = await api.put(`/pixel/purchase/${ad._id}/moderator`, {
                moderatorNote: note,
            });
            return res.data;
        },
        onSuccess: () => {
            setModeratorNote("");
            setError("");
            queryClient.invalidateQueries(['pixel-purchases'])
            onClose?.();
        },
        onError: (e) => {
            setError(e?.message || "Something went wrong");
        },
    });

    if (!isOpen || !ad) return null;

    // Parse date and time
    const createdAt = ad.createdAt ? new Date(ad.createdAt) : null;
    const date = createdAt ? createdAt.toLocaleDateString() : "-";
    const time = createdAt ? createdAt.toLocaleTimeString() : "-";

    // Statistics
    const pixels = ad.pixelArea?.area?.toLocaleString() || "0";
    const value = `$${ad.pixelArea?.area || 0}`;
    const displayName = ad.displayName || "Unknown";
    const websiteUrl = ad.websiteUrl || "-";
    const adTitle = ad.adTitle || "No Title";
    const adImageUrl = ad.adImageUrl;
    const status = "Active"; // You may adjust as needed

    const handleRemoveAd = () => {
        if (!moderatorNote || moderatorNote.trim().length < 5) {
            setError("Moderator note must be at least 5 characters long.");
            return;
        }
        setError("");
        mutation.mutate(moderatorNote);
    };

    function handleClose() {
        setError(null)
        setModeratorNote(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto font-pixel border border-[#208A54]">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <h2 className="text-3xl font-semibold  font-ari">
                        Advertisement Preview
                    </h2>
                    <button onClick={handleClose} className=" hover:text-gray-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Ad Content */}
                <div className="bg-dark-700 rounded-xl p-6 mb-7">
                    <h3 className="font-bold text-lg  mb-5">Ad Content</h3>
                    <div className="flex flex-col items-center justify-center border border-[#208A54] rounded-lg p-6 mb-6">
                        {adImageUrl ? (
                            <img src={adImageUrl} alt={adTitle} className="w-24 h-24 object-contain mb-4" />
                        ) : (
                            <>
                                <div className="w-24 h-24 flex items-center justify-center bg-dark-800 rounded mb-4">
                                    <svg width="40" height="40" fill="none"><rect width="40" height="40" rx="8" fill="#1E894B" /><path d="M12 28v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="#5DD075" strokeWidth="2" /><circle cx="20" cy="16" r="4" stroke="#5DD075" strokeWidth="2" /></svg>
                                </div>
                                <div className="text-error text-center font-bold mb-4">
                                    This ad has already been removed by the admin.
                                </div>
                            </>
                        )}
                        <div className="text-xl font-bold  mb-2 text-center">{adTitle}</div>
                        {/* Description not in API, fallback to adTitle or omit */}
                        <div className="text-light/60 text-center">
                            {/* If you have adDescription, use it here */}
                            {adTitle}
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="font-bold  mb-1">Title</div>
                        <div className="text-light/90">{adTitle}</div>
                    </div>
                    <div>
                        <div className="font-bold  mb-1">Target URL</div>
                        <div className="text-light/90">{websiteUrl}</div>
                    </div>
                </div>

                {/* Owner / Statistics */}
                <div className="bg-dark-700 rounded-xl p-6 mb-7">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-dark-800"></div>
                            <div>
                                <div className="font-semibold  text-lg">{displayName}</div>
                            </div>
                        </div>
                        <span className="flex items-center gap-2 bg-green-100/20 px-3 py-1 rounded-full text-green-100 text-sm font-semibold">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            {status}
                        </span>
                    </div>
                    <div className="mt-4">
                        <div className="font-bold  mb-2">Statistics</div>
                        <div className="flex gap-10 text-light/80">
                            <div>
                                <span className="font-bold text-green-400">{pixels}</span> Pixels
                            </div>
                            <div>
                                <span className="font-bold text-green-400">{date}</span> Posted
                            </div>
                            <div>
                                Value: <span className="font-bold text-green-400">{value}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moderation Notes */}
                <div className="bg-dark-700 rounded-xl p-6 mb-7">
                    <div className="font-bold mb-2">Moderation Notes</div>
                    <textarea
                        className={`w-full text-light/80 p-3 rounded-lg border ${!!error ? 'border-error' : 'border-border'}  resize-none`}
                        rows={3}
                        placeholder="Add notes or rejection reason (optional)"
                        value={moderatorNote}
                        onChange={e => setModeratorNote(e.target.value)}
                    />
                    {error && (
                        <div className="text-error mt-2 font-semibold">{error}</div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end mt-2">
                    <button
                        className={`bg-error/90 hover:bg-error disabled:bg-error/40 font-bold py-3 px-6 rounded-lg flex items-center gap-2 ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleRemoveAd}
                        disabled={mutation.isLoading || ad.adImageUrl === null}
                    >
                        <X className="w-5 h-5" /> {mutation.isLoading ? "Removing..." : "Remove Ad"}
                    </button>
                </div>
            </div>
        </div>
    );
}
