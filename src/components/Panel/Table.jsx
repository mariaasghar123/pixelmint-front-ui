"use client";
import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong, FaChevronUp, FaChevronDown, FaEye, FaTrash } from "react-icons/fa6";

// Simple skeleton loader component
function SkeletonRow({ columns }) {
    return (
        <tr>
            {columns.map((_, idx) => (
                <td key={idx} className="px-4 py-4 align-middle">
                    <div className="h-6 bg-dark-700 rounded w-full animate-pulse" />
                </td>
            ))}
        </tr>
    );
}

function SkeletonCard({ columns }) {
    return (
        <div className="border-2 border-border rounded-2xl bg-dark-800 overflow-hidden mb-4 animate-pulse">
            <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-green-100 rounded-full" />
                <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-1/2 bg-dark-700 rounded" />
                    <div className="h-3 w-1/3 bg-dark-700 rounded" />
                </div>
            </div>
            <div className="px-4 pb-4 space-y-4">
                {columns.slice(1).map((col, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <span className="h-4 w-24 bg-dark-700 rounded" />
                        <div className="h-4 w-32 bg-dark-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Table({ columns, data, pageSize = 5, isLoading = false }) {
    const [page, setPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    const toggleRowExpansion = (index) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedRows(newExpanded);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage, endPage;
            if (page <= Math.ceil(maxVisiblePages / 2)) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (page >= totalPages - Math.floor(maxVisiblePages / 2)) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = page - Math.floor(maxVisiblePages / 2);
                endPage = page + Math.floor(maxVisiblePages / 2);
            }

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="dark:bg-dark-800 bg-gray-300 rounded-2xl w-full overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto min-w-full">
                        <thead>
                            <tr className="bg-green-100 rounded-t-2xl">
                                {columns.map((col) => (
                                    <th key={col.key} className="text-left px-4 py-3 font-semibold dark:text-dark-800 whitespace-nowrap">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                    <SkeletonRow columns={columns} key={idx} />
                                ))
                                : paginatedData.map((row, i) => (
                                    <tr key={i} className="border-b dark:border-white/10">
                                        {columns.map((col) => (
                                            <td key={col.key} className="px-4 py-4 align-middle darK:text-light/40 text-black whitespace-nowrap">
                                                {col.render ? col.render(row) : row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Expandable Cards */}
            <div className="md:hidden p-4 space-y-3">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <SkeletonCard columns={columns} key={idx} />
                    ))
                    : paginatedData.map((row, i) => {
                        const isExpanded = expandedRows.has(i);
                        const firstColumn = columns[0];

                        return (
                            <div key={i} className="border-2 border-border rounded-2xl bg-dark-800 overflow-hidden mb-4">
                                {/* Collapsed Header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer"
                                    onClick={() => toggleRowExpansion(i)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 p-2 bg-green-100 rounded-full flex items-center justify-center">
                                            {isExpanded ?
                                                <FaChevronUp className="text-dark-800" size={16} /> :
                                                <FaChevronDown className="text-dark-800" size={16} />
                                            }
                                        </div>
                                        <div className="flex gap-6">
                                            <div className="text-light/60 text-sm">
                                                {firstColumn?.render ? firstColumn.render(row) : row[firstColumn?.key]}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-4">
                                        {/* User Info Section */}
                                        <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                                            <div>
                                                <div className="text-white font-semibold text-lg">
                                                    {row.name || 'Unknown User'}
                                                </div>
                                                <div className="text-light/60">
                                                    {row.email || 'No email provided'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Data Fields */}
                                        {columns.slice(1).map((col) => (
                                            <div key={col.key} className="flex justify-between items-start">
                                                <span className="text-white font-medium">
                                                    {col.header}
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-light/80">
                                                        {col.render ? col.render(row) : row[col.key]}
                                                    </div>
                                                    {col.key === 'pixelsUsed' && row.pixelValue && (
                                                        <div className="text-light/60 text-sm">
                                                            ${row.pixelValue} value
                                                        </div>
                                                    )}
                                                    {col.key === 'adsPosted' && row.adImages && (
                                                        <div className="flex gap-1 mt-1 justify-end">
                                                            {Array.from({ length: parseInt(row.adsPosted) || 0 }).map((_, idx) => (
                                                                <div key={idx} className="w-6 h-6 bg-dark-600 rounded border border-white/20 flex items-center justify-center">
                                                                    <span className="text-xs">🖼️</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {col.key === 'datePosted' && row.timePosted && (
                                                        <div className="text-light/60 text-sm">
                                                            {row.timePosted}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Enhanced Responsive Pagination Footer */}
            <div className="border-t border-white/10 bg-dark-700/50">
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="bg-dark-600 border border-white/15 rounded-lg px-4 py-2 flex items-center gap-2 text-white hover:bg-dark-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <FaArrowLeftLong size={12} />
                            <span>Previous</span>
                        </button>

                        <div className="flex items-center justify-center gap-1">
                            {renderPageNumbers().map((pageNum, idx) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="text-light/40 px-2">...</span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`rounded-lg px-3 py-2 font-semibold text-sm transition min-w-[40px] ${page === pageNum
                                            ? "bg-green-100 text-dark-800"
                                            : "bg-transparent text-light/60 hover:bg-white/10"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            className="bg-green-100 rounded-lg px-4 py-2 flex items-center gap-2 text-dark-800 font-semibold hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <span>Next</span>
                            <FaArrowRightLong size={12} />
                        </button>
                    </div>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden md:flex items-center justify-between px-6 py-4">
                    <button
                        className="bg-dark-600 border border-white/15 rounded-lg px-6 py-2 flex items-center gap-2 text-white hover:bg-dark-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <FaArrowLeftLong size={12} />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                        {renderPageNumbers().map((pageNum, idx) => (
                            pageNum === '...' ? (
                                <span key={`ellipsis-${idx}`} className="text-light/40 px-2">...</span>
                            ) : (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`rounded-lg px-4 py-2 font-semibold text-sm transition min-w-[40px] ${page === pageNum
                                        ? "bg-green-100 text-dark-800"
                                        : "bg-transparent text-light/60 hover:bg-white/10"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        className="bg-green-100 rounded-lg px-6 py-2 flex items-center gap-2 text-dark-800 font-semibold hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        <span>Next</span>
                        <FaArrowRightLong size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
