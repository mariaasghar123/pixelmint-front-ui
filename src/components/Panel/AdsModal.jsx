"use client"
import { X } from "lucide-react"

export default function AdsModal({ open, onClose, ad }) {
    if (!open || !ad) return null

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-[95vw] sm:max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-green-400 flex flex-col items-start relative">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white hover:text-red-400 transition-colors cursor-pointer"
                >
                    <X size={28} />
                </button>

                <div className="text-4xl font-semibold mb-6 text-white font-ari tracking-tight">Ad Details</div>

                <div className="w-full text-white space-y-6">
                    {/* Ad Image */}
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-dark-900 flex items-center justify-center border border-dark-600">
                            <img
                                src={ad.adImageUrl || "/default-ad-logo.png"}
                                alt={ad.adTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Ad Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-sm font-medium text-dark-300 block mb-1">Ad Title</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3 text-white">{ad.adTitle}</div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-dark-300 block mb-1">Pixel Area</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3 text-white">
                                {ad.pixelArea.area.toLocaleString()} pixels
                            </div>
                        </div>

                        <div className="">
                            <label className="text-sm font-medium text-dark-300 block mb-1">Display Name</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3 text-white">{ad.displayName}</div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-dark-300 block mb-1">Position</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3 text-white text-sm">
                                <span>
                                    ({ad.pixelArea.topLeft[0]}, {ad.pixelArea.topLeft[1]})
                                </span>
                                , &nbsp;
                                <span>
                                    ({ad.pixelArea.bottomRight[0]}, {ad.pixelArea.bottomRight[1]})
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-dark-300 block mb-1">Website URL</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3">
                                <a
                                    href={ad.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 transition-colors break-all"
                                >
                                    {ad.websiteUrl}
                                </a>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-dark-300 block mb-1">Created</label>
                            <div className="bg-dark-700 rounded-lg px-4 py-3 text-white text-sm">{formatDate(ad.createdAt)}</div>
                        </div>

                    </div>

                    {/* Ad ID */}
                    <div>
                        <label className="text-sm font-medium text-dark-300 block mb-1">Ad ID</label>
                        <div className="bg-dark-700 rounded-lg px-4 py-3 text-dark-400 text-sm font-mono">{ad._id}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
