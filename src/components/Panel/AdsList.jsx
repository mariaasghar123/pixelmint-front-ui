import { Pencil, Trash2 } from "lucide-react";

export default function AdsList({ ads = [], onEdit, onDelete }) {
    return (
        <section className="bg-dark-800 rounded-xl p-6 w-full mt-5 mx-auto">
            <h2 className="text-white font-semibold text-lg mb-4">
                Active Advertisements
            </h2>
            <div className="flex flex-col gap-4">
                {ads.map((ad) => (
                    <div
                        key={ad.id}
                        className="flex items-center bg-dark-700 rounded-lg px-4 py-4 gap-6"
                    >
                        {/* Ad image */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                            <img
                                src={ad.logo || "/default-ad-logo.png"}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Ad details */}
                        <div className="flex-1 flex flex-col">
                            <span className="text-base font-semibold text-white">
                                {ad.title}
                            </span>
                            <span className="text-sm text-[#A9D7B8]">
                                {ad.url}
                            </span>
                            <span className="text-sm text-[#A9D7B8]">
                                {ad.pixels} Pixels
                            </span>
                        </div>
                        {/* Controls */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit?.(ad)}
                                className="p-3 rounded-lg text-light transition cursor-pointer"
                                style={{
                                    background: "linear-gradient(90deg, #FFFFFF33 0%, #FFFFFF00 100%)"
                                }}
                                title="Edit"
                            >
                                <Pencil size={24} color="#EBFFF9" />
                            </button>
                            <button
                                onClick={() => onDelete?.(ad)}
                                className="p-3 rounded-lg transition cursor-pointer"
                                style={{
                                    background: "linear-gradient(90deg, #FFFFFF33 0%, #FFFFFF00 100%)"
                                }}
                                title="Delete"
                            >
                                <Trash2 size={24} color="#E0524D" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
