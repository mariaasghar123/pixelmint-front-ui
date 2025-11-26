"use client"
import { useState } from "react"
import AuthModal from "./AuthModal"
import Button from "./ui/Button"
import { FaExpand, FaCompress, FaHome, FaSearchPlus, FaPlus, FaMinus, FaCrosshairs, FaSearchMinus } from "react-icons/fa"

function PixelLegend() {
    return (
        <div className="flex items-center flex-wrap gap-3 lg:gap-6 dark:bg-[#18312c] bg-[#22C092]/50 rounded-lg px-3 lg:px-5 py-2 lg:py-[7px]">
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-green-800 bg:bg-dark-800" />
                <span className="dark:text-green-200 text-sm lg:text-lg font-normal">Free</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-error" />
                <span className="dark:text-green-200 text-sm lg:text-lg font-normal">Taken</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-[#3b82f6]" />
                <span className="dark:text-green-200 text-sm lg:text-lg font-normal">Reserved</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 lg:w-5 lg:h-5 rounded bg-green-300" />
                <span className="dark:text-green-200 text-sm lg:text-lg font-normal">Selected</span>
            </span>
        </div>
    )
}

function TopBar({
    isExpanded,
    mousePixelPos,
    expandClick,
    canDraw,
    onCanDrawToggle,
    zoom,
    onResetZoom,
    magnifierActive,
    onMagnifierToggle,
    magnifierZoom,
    onMagnifierZoomChange,
    isMobile,
    clickZoomLevel,
    clickZoomLevels,
    canDrawDisabled
}) {
    const [showModal, setShowModal] = useState(false)

    const handleBuyPixels = () => {
        onCanDrawToggle()
    }

    const isZoomed = zoom !== 1

    // Get current click zoom level info
    function getCurrentZoomInfo() {
        if (clickZoomLevel === 0) return "Normal"
        if (clickZoomLevel <= clickZoomLevels.length) {
            return `${clickZoomLevels[clickZoomLevel - 1]}x`
        }
        return `${clickZoomLevels[clickZoomLevels.length - 1]}x`
    }

    // Get instructions based on current mode
    function getInstructions() {
        if (canDraw) {
            return (
                <>
                    The selected pixels will be <span className="text-green-200">reserved for 10 minutes</span>. If you do not
                    complete your transaction within this time, the pixels will be available for purchase by others.
                </>
            )
        }

        if (isMobile) {
            return (
                <>
                    Use <span className="text-green-200">pinch to zoom</span> and <span className="text-green-200">drag to pan</span>.
                    Current zoom: <span className="text-green-200">{Math.round(zoom * 100)}%</span>.
                </>
            )
        }

        if (magnifierActive) {
            return (
                <>
                    <span className="text-green-200">Magnifier Active:</span> Move to inspect, <span className="text-green-200">click to zoom in</span>.
                    Magnification: <span className="text-green-200">{magnifierZoom}x</span>, Canvas: <span className="text-green-200">{getCurrentZoomInfo()}</span>.
                    Use <span className="text-green-200">scroll wheel</span> to adjust magnifier.
                </>
            )
        }

        return (
            <>
                Hold <span className="text-green-200">Ctrl + Scroll</span> to zoom in/out.
                Current zoom: <span className="text-green-200">{Math.round(zoom * 100)}%</span>.
                Hold <span className="text-green-200">Ctrl + Drag</span> to pan.
                Use the <span className="text-green-200">magnifier tool</span> for precision zooming.
            </>
        )
    }

    return (
        <>
            <AuthModal open={showModal} onClose={() => setShowModal(false)} />
            <div className={`rounded-t-lg w-full flex flex-col-reverse items-center justify-between p-3 lg:px-5 lg:py-3 border-b border-[#142d29] min-h-14 bg-[#98F08C]/50 lg:bg-[#EEFFEB] dark:bg-[#0d2320]`}>
                <div className="w-full md:mb-2 mt-2">
                    <div className="text-gray-400 text-left text-sm lg:text-base font-aria hidden md:block">
                        {getInstructions()}
                    </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full justify-start lg:justify-between items-center">
                    <div className="py-2 lg:py-3 px-3 lg:px-4 text-black shadow border-[#5ECB5F] border-1 lg:border-0 dark:border-0 lg:shadow-0 lg:bg-[#5ECB5F] dark:bg-[#18312c] rounded-md flex items-center gap-3 lg:gap-4 lg:text-white dark:text-white  text-xs lg:text-sm font-medium min-w-0 flex-shrink ">
                        <span className="whitespace-nowrap">
                            Pixel:{" "}
                            {mousePixelPos?.x !== null && mousePixelPos?.y !== null
                                ? `(${mousePixelPos.x}, ${mousePixelPos.y})`
                                : "(–,–)"}
                        </span>
                        <span className="whitespace-nowrap">Block: 5x5 Pixels($25)</span>
                        {(isZoomed || magnifierActive) && (
                            <span className="whitespace-nowrap text-green-200 ">
                                {magnifierActive
                                    ? `Canvas: ${getCurrentZoomInfo()} | Magnifier: ${magnifierZoom}x`
                                    : `Zoom: ${Math.round(zoom * 100)}%`
                                }
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap lg:flex-nowrap">
                        <Button
                            onClick={handleBuyPixels}
                            style={{
                                background: canDraw && "#E44A4A",
                                borderColor: canDraw && "#E44A4A",
                            }}
                            disabled={canDrawDisabled}
                            className="whitespace-nowrap text-sm shadow bg-transparent shadow border-[#5ECB5F] border-1 lg:border-0 dark:border-0 dark:bg-green-100 lg:bg-green-100 lg:text-base !p-1 md:p-2 disabled:bg-opacity-20"
                        >
                            {canDraw ? "Revert" : "Buy Pixels"}
                        </Button>

                        {canDraw && (
                            <div className="hidden sm:block lg:ml-0">
                                <PixelLegend />
                            </div>
                        )}

                        {!isMobile && (
                            <>
                                <button
                                    className={`cursor-pointer p-2 rounded transition duration-150 ease ${magnifierActive
                                        ? 'bg-green-500 hover:bg-green-600 dark:text-white lg:text-white'
                                        : 'shadow-xl lg:bg-[#22C092]/50 dark:bg-[#18312c] hover:bg-[#19992c]/80 lg:text-white dark:text-white'
                                        }`}
                                    title={magnifierActive ? "Disable Magnifier" : "Enable Magnifier (Click to zoom in)"}
                                    onClick={onMagnifierToggle}
                                >
                                    <FaSearchPlus size={16} className="w-5 h-5" />
                                </button>

                                <button
                                    className="cursor-pointer p-2 rounded shadow-xl lg:bg-[#22C092]/50 dark:bg-[#18312c] hover:bg-[#19992c]/80 transition duration-150 ease"
                                    title="Reset Zoom"
                                    onClick={onResetZoom}
                                    style={{ color: "#fff" }}
                                >
                                    <FaSearchMinus size={16} className="w-5 h-5 text-black lg:text-white dark:text-white" />
                                </button>

                                {magnifierActive && (
                                    <>
                                        <div className="flex items-center gap-1 bg-[#18312c] rounded p-1 h-full">
                                            <button
                                                className="cursor-pointer p-1 rounded hover:bg-[#19992c]/80 transition duration-150 ease text-white"
                                                title="Decrease Magnification"
                                                onClick={() => onMagnifierZoomChange(-1)}
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="px-2 text-green-200 text-sm min-w-[30px] text-center">
                                                {magnifierZoom}x
                                            </span>
                                            <button
                                                className="cursor-pointer p-1 rounded hover:bg-[#19992c]/80 transition duration-150 ease text-white"
                                                title="Increase Magnification"
                                                onClick={() => onMagnifierZoomChange(1)}
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 bg-[#18312c] rounded p-2">
                                            <FaCrosshairs size={14} className="text-green-200" />
                                            <span className="text-green-200 text-sm">
                                                {getCurrentZoomInfo()}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </>
                        )}


                        <button
                            onClick={expandClick}
                            className="cursor-pointer p-2 shadow-xl  rounded text-black lg:text-white dark:text-white  lg:bg-[#22C092]/50 dark:bg-[#18312c] hover:bg-[#19992c]/80 transition duration-150 ease"
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
