"use client"

import { Eye } from "lucide-react"

export default function AdsList({ ads = [], onOpen }) {
    console.log(ads)

    return (
        <section className="bg-dark-800 rounded-xl p-6 w-full mt-5 mx-auto">
            <h2 className="text-white font-semibold text-lg mb-4">Active Advertisements</h2>
            <div className="flex flex-col gap-4">
                {ads?.map((ad) => (
                    <div key={ad._id} className="flex items-center bg-dark-700 rounded-lg px-4 py-4 gap-6">
                        {/* Ad image */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            <img
                                src={ad.adImageUrl || "/default-ad-logo.png"}
                                alt={ad.adTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Ad details */}
                        <div className="flex-1 flex flex-col">
                            <span className="text-base font-semibold text-white">{ad.adTitle}</span>
                            <span className="text-sm text-[#A9D7B8] break-words">{ad.websiteUrl}</span>
                            <span className="text-sm text-[#A9D7B8]">{ad.pixelArea?.area ?? 0} Pixels</span>
                        </div>
                        {/* Controls */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onOpen?.(ad)}
                                className="p-3 rounded-lg text-light transition cursor-pointer"
                                style={{
                                    background: "linear-gradient(90deg, #FFFFFF33 0%, #FFFFFF00 100%)",
                                }}
                                title="View"
                            >
                                <Eye size={24} color="#EBFFF9" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

