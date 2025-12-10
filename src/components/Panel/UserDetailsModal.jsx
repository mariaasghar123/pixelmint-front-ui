"use client"
import { X } from "lucide-react"

export default function UserDetailsModal({ isOpen, onClose, user }) {
    if (!isOpen || !user) return null

    // Extract values from user object
    const pixelsNum = user.totalArea || 0
    const valueNum = pixelsNum // $1 per pixel
    const adsNum = user.totalPurchases || 0

    // Shorten wallet address for display
    const shortWallet = user.walletAddress
        ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
        : "N/A"

    // Use user's purchases for ad images
    const adImages = user.purchases?.map(p => p.adImageUrl).filter(Boolean)

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="dark:bg-dark-700 bg-dark-300 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#208A54]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-semibold dark:text-white font-ari">User Details</h2>
                    <button onClick={onClose} className="dark:text-white hover:text-gray-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User ID and Status */}
                <div className="flex items-center justify-between mb-8">
                    <div className="dark:text-white text-lg font-mono">{shortWallet}</div>
                    <div className="flex items-center gap-2 dark:bg-green-100/20 bg-green-300 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 dark:bg-green-400 bg-dark-100 rounded-full"></div>
                        <span className="dark:text-green-100 text-white text-sm">Active</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="text-center dark:bg-dark-800 bg-gray-300 px-2 py-4 rounded-xl">
                        <div className="dark:bg-green-100/20 bg-green-200 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <div className="w-6 h-6 bg-green-100 rounded grid grid-cols-3 gap-0.5 p-1">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="bg-emerald-900 rounded-sm"></div>
                                ))}
                            </div>
                        </div>
                        <div className="text-2xl font-bold dark:text-white mb-1">{pixelsNum.toLocaleString()}</div>
                        <div className="dark:text-gray-400 text-sm">Pixels Purchased</div>
                    </div>

                    <div className="text-center dark:bg-dark-800 bg-gray-300 px-2 py-4 rounded-xl">
                        <div className="dark:bg-green-100/20 bg-green-200 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                <div className="w-4 h-3 bg-emerald-900 rounded-sm"></div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold dark:text-white mb-1">{String(adsNum).padStart(2, "0")}</div>
                        <div className="dark:text-gray-400 text-sm">Ads Posted</div>
                    </div>

                    <div className="text-center dark:bg-dark-800 bg-gray-300 px-2 py-4 rounded-xl">
                        <div className="dark:bg-green-100/20  bg-green-200 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-900 text-xs font-bold">$</span>
                            </div>
                        </div>
                        <div className="text-2xl font-bold dark:text-white mb-1">${valueNum.toLocaleString()}</div>
                        <div className="dark:text-gray-400 text-sm">Total Spent</div>
                    </div>
                </div>

                {/* Posted Advertisements */}
                <div>
                    <h3 className="text-xl dark:text-white mb-4">Posted Advertisements</h3>
                    <div className="grid !grid-cols-3 gap-4">
                        {adImages && adImages.length > 0 ? (
                            adImages.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                                    <img src={img} alt={`Advertisement ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 dark:text-light/40 text-center">No advertisements available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
