"use client";
import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

export default function Table({ columns, data, pageSize = 5 }) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="bg-dark-800 rounded-2xl w-full overflow-hidden">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-green-100 rounded-t-2xl">
                        {columns.map((col) => (
                            <th key={col.key} className="text-left px-4 py-3 font-semibold text-dark-800">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, i) => (
                        <tr key={i} className="border-b border-white/10">
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-4 align-middle text-light/40">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination Footer */}
            <div className="flex items-center justify-between mt-3 p-4">
                <button
                    className="bg-black border border-white/15 rounded-lg px-6 py-2 flex items-center gap-2 text-white font-semibold hover:bg-black/40 transition"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    <FaArrowLeftLong size={12} />
                    Previous
                </button>
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx + 1)}
                            className={`rounded-lg px-3 py-1 font-semibold ${page === idx + 1
                                ? "bg-green-100 text-dark-800"
                                : "bg-transparent text-light/40 hover:bg-white/5"
                                } transition`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
                <button
                    className="bg-green-100 rounded-lg px-6 py-2 flex items-center gap-2 text-dark-800 font-semibold hover:bg-green-400 transition"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next <FaArrowRightLong size={12} />
                </button>
            </div>
        </div>
    );
}
