import { Search, RotateCcw } from "lucide-react";

export default function SearchFilterBar({ className = "", searchValue, onSearchChange }) {
    return (
        <div className={`dark:bg-dark-800 bg-gray-300 p-5 py-6 rounded-xl w-full ${className}`}>
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between w-full">
                <div className="flex gap-6 max-w-[1050px] w-full">
                    <div className="flex items-center bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 flex-2 w-[350px]">
                        <Search className="dark:text-light/50 mr-3 w-5 h-5 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={e => onSearchChange(e.target.value)}
                            className="bg-transparent border-none outline-none dark:text-light/50 w-full dark:placeholder:text-light/50"
                            placeholder="Search Ads By Title, owner"
                        />
                    </div>

                    <select className="bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 dark:text-light/50 flex-1">
                        <option>All Sizers</option>
                    </select>
                    <select className="bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 dark:text-light/50 flex-1">
                        <option>All Time</option>
                    </select>
                </div>

                <button className="bg-light/5 border-none rounded-lg w-12 h-12 flex items-center justify-center ml-2">
                    <RotateCcw className="dark:text-light/40 w-5 h-5" />
                </button>
            </div>

            {/* Mobile column layout */}
            <div className="flex flex-col gap-4 md:hidden w-full">
                <div className="flex items-center bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 w-full">
                    <Search className="dark:text-light/50 mr-3 w-5 h-5 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={e => onSearchChange(e.target.value)}
                        className="bg-transparent border-none outline-none dark:text-light/50 w-full dark:placeholder:text-light/50"
                        placeholder="Search Ads By Title, owner"
                    />
                </div>
                <select className="bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 dark:text-light/50 w-full">
                    <option>All Sizers</option>
                </select>
                <select className="bg-transparent border dark:border-light/50 rounded-lg px-4 py-2 h-12 dark:text-light/50 w-full">
                    <option>All Time</option>
                </select>
                <button className="bg-light/5 border-none rounded-lg w-full h-12 flex items-center justify-center self-end">
                    <RotateCcw className="dark:text-light/40 w-full h-5" />
                </button>
            </div>
        </div>
    );
}
