import { Search, RotateCcw } from "lucide-react";

export default function SearchFilterBar({ className = "" }) {
    return (
        <div className={`bg-dark-800 p-5 py-6 rounded-xl flex items-center justify-between w-full ${className}`}>
            <div className="flex gap-6 max-w-[1050px] w-full">
                <div className="flex items-center bg-transparent border border-light/50 rounded-lg px-4 py-2 h-12 flex-2">
                    <Search className="text-light/50 mr-3 w-5 h-5 flex-shrink-0" />
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-light/50 w-full placeholder:text-light/50"
                        placeholder="Search Ads By Title, owner"
                    />
                </div>

                <select className="bg-transparent border border-light/50 rounded-lg px-4 py-2 h-12 text-light/50 flex-1">
                    <option>All Status</option>
                </select>
                <select className="bg-transparent border border-light/50 rounded-lg px-4 py-2 h-12 text-light/50 flex-1">
                    <option>All Sizers</option>
                </select>
                <select className="bg-transparent border border-light/50 rounded-lg px-4 py-2 h-12 text-light/50 flex-1">
                    <option>All Time</option>
                </select>
            </div>

            <button className="bg-light/5 border-none rounded-lg w-12 h-12 flex items-center justify-center ml-2">
                <RotateCcw className="text-light/40 w-5 h-5" />
            </button>
        </div>
    );
}
