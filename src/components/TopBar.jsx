"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";
import Button from "./ui/Button";
import { FaExpand, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { useAuth } from "./AuthProvider";

function PixelLegend() {
    return (
        <div className="flex items-center gap-6 bg-[#18312c] rounded-lg px-5 py-[7px] ml-3">
            <span className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded bg-dark-800" />
                <span className="text-green-200 text-lg font-normal">Free</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded bg-error" />
                <span className="text-green-200 text-lg font-normal">Taken</span>
            </span>
            <span className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 rounded bg-green-300" />
                <span className="text-green-200 text-lg font-normal">Selected</span>
            </span>
        </div>
    );
}

function TopBar({
    mousePixelPos,
    zoomActive,
    onZoomClick,
    zoomedIn,
    canDraw,
    onCanDrawToggle
}) {
    const [showModal, setShowModal] = useState(false);
    const { isAuthenticated } = useAuth()

    const handleBuyPixels = () => {
        // if (!isAuthenticated) {
        //     setShowModal(true);
        //     return;
        // }
        onCanDrawToggle();
    }

    return (
        <>
            <AuthModal open={showModal} onClose={() => setShowModal(false)} />
            <div
                style={{
                    width: "100%",
                    background: "#0d2320",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px",
                    boxSizing: "border-box",
                    borderBottom: "1px solid #142d29",
                    minHeight: 48,
                }}
            >
                <div style={{ display: "flex", gap: 12 }}>
                    <div
                        className="py-3 px-4"
                        style={{
                            background: "#18312c",
                            borderRadius: 6,
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            fontWeight: 500,
                        }}
                    >
                        <span>
                            Pixel: {mousePixelPos?.x !== null && mousePixelPos?.y !== null
                                ? `(${mousePixelPos.x}, ${mousePixelPos.y})`
                                : "(–,–)"}
                        </span>
                        <span>
                            Block: 10x10 Pixels($10)
                        </span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Button
                        onClick={handleBuyPixels}
                        style={{
                            background: canDraw && "#E44A4A",
                        }}
                    >
                        {canDraw ? "Revert" : "Buy Pixels"}
                    </Button>
                    {canDraw && <PixelLegend />}
                    <button
                        className={`cursor-pointer p-2 rounded transition duration-150 ease ${zoomActive
                            ? "bg-[#19992c] ring ring-primary"
                            : "bg-[#18312c] hover:bg-[#19992c]/80"
                            }`}
                        title={zoomedIn ? "Zoom Out" : "Zoom In"}
                        onClick={onZoomClick}
                        style={{
                            color: "#fff",
                            outline: zoomActive ? "2px solid #19992c" : undefined,
                            boxShadow: zoomActive ? "0 0 0 2px #19992c inset" : undefined
                        }}
                    >
                        {zoomedIn
                            ? <FaSearchMinus size={20} />
                            : <FaSearchPlus size={20} />
                        }
                    </button>
                    <button className="cursor-pointer p-2 rounded bg-[#18312c] hover:bg-[#19992c]/80 transition duration-150 ease">
                        <FaExpand size={20} />
                    </button>
                </div>
            </div></>
    );
}

export default TopBar;
