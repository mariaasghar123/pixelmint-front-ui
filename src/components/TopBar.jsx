"use client"
import { useState } from "react"
import AuthModal from "./AuthModal"
import Button from "./ui/Button"
import { FaExpand, FaCompress, FaSearchPlus, FaSearchMinus } from "react-icons/fa"

function PixelLegend() {
    return (
        <div className="flex items-center flex-wrap gap-3 lg:gap-6 bg-[#18312c] rounded-lg px-3 lg:px-5 py-2 lg:py-[7px]">
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-dark-800" />
                <span className="text-green-200 text-sm lg:text-lg font-normal">Free</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-error" />
                <span className="text-green-200 text-sm lg:text-lg font-normal">Taken</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-[#3b82f6]" />
                <span className="text-green-200 text-sm lg:text-lg font-normal">Reserved</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-green-300" />
                <span className="text-green-200 text-sm lg:text-lg font-normal">Selected</span>
            </span>
        </div>
    )
}

function TopBar({
    isExpanded,
    mousePixelPos,
    expandClick,
    zoomActive,
    onZoomClick,
    zoomedIn,
    canDraw,
    onCanDrawToggle,
}) {
    const [showModal, setShowModal] = useState(false)

    const handleBuyPixels = () => {
        onCanDrawToggle()
    }

    return (
        <>
            <AuthModal open={showModal} onClose={() => setShowModal(false)} />
            <div className="rounded-t-lg w-full bg-[#0d2320] flex flex-col-reverse items-center justify-between p-3 lg:px-5 lg:py-3 border-b border-[#142d29] min-h-14">
                <div className="w-full md:mb-2 mt-2">
                    <div className="text-gray-400 text-left text-sm lg:text-base font-aria hidden md:block">
                        The selected pixels will be <span className="text-green-200">reserved for 10 minutes</span>. If you do not
                        complete your transaction within this time, the pixels will be available for purchase by others.
                    </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full justify-start lg:justify-between items-center">
                    <div className="py-2 lg:py-3 px-3 lg:px-4 bg-[#18312c] rounded-md flex items-center gap-3 lg:gap-4 text-xs lg:text-sm font-medium min-w-0 flex-shrink ">
                        <span className="whitespace-nowrap">
                            Pixel:{" "}
                            {mousePixelPos?.x !== null && mousePixelPos?.y !== null
                                ? `(${mousePixelPos.x}, ${mousePixelPos.y})`
                                : "(–,–)"}
                        </span>
                        <span className="whitespace-nowrap">Block: 10x10 Pixels($10)</span>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap lg:flex-nowrap">
                        <Button
                            onClick={handleBuyPixels}
                            style={{
                                background: canDraw && "#E44A4A",
                                borderColor: canDraw && "#E44A4A",
                            }}
                            className="whitespace-nowrap text-sm lg:text-base !p-1 md:p-2"
                        >
                            {canDraw ? "Revert" : "Buy Pixels"}
                        </Button>

                        {canDraw && (
                            <div className="hidden sm:block lg:ml-0">
                                <PixelLegend />
                            </div>
                        )}

                        <button
                            className={`cursor-pointer p-2 rounded transition duration-150 ease ${zoomActive ? "bg-[#19992c] ring ring-primary" : "bg-[#18312c] hover:bg-[#19992c]/80"
                                }`}
                            title={zoomedIn ? "Zoom Out" : "Zoom In"}
                            onClick={onZoomClick}
                            style={{
                                color: "#fff",
                                outline: zoomActive ? "2px solid #19992c" : undefined,
                                boxShadow: zoomActive ? "0 0 0 2px #19992c inset" : undefined,
                            }}
                        >
                            {zoomedIn ? (
                                <FaSearchMinus size={16} className="w-5 h-5" />
                            ) : (
                                <FaSearchPlus size={16} className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={expandClick}
                            className="cursor-pointer p-2 rounded bg-[#18312c] hover:bg-[#19992c]/80 transition duration-150 ease"
                        >
                            {!isExpanded ? (
                                <FaExpand size={16} className="w-5 h-5" />
                            ) : (
                                <FaCompress size={16} className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {canDraw && (
                    <div className="block sm:hidden w-full mt-2">
                        <PixelLegend />
                    </div>
                )}
            </div>
        </>
    )
}

export default TopBar

