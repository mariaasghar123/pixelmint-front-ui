import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { getShapes, saveReservation, saveShapes } from "@/utils/localStorage.utils";

function formatCoords(coord) {
    return Math.floor(coord / 10)
}

export default function ReservePixelsModal({ open, onClose, coords, onConfirmed }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(false);
        }
    }, [open]);

    function CoordCard({ label, value }) {
        return (
            <div className="flex flex-col items-center bg-dark-700 rounded-lg px-6 py-3 shadow-md border border-border min-w-[180px]">
                <span className="text-green-100 text-base font-semibold mb-2">{label}</span>
                <span className="text-green-200 text-2xl font-mono font-bold tracking-wide">
                    {value}
                </span>
            </div>
        );
    }

    function handleClose() {
        const shapes = getShapes()
        const bottomRight = [
            formatCoords(coords.bottomRight[0]),
            formatCoords(coords.bottomRight[1])
        ]
        const shapesEndCoords = shapes.map(v => v.bottomRight)
        const index = shapesEndCoords.findIndex(v => v[0] == bottomRight[0] && v[1] == bottomRight[1])
        shapes.splice(index, 1)
        saveShapes(shapes)
        onClose(shapes)
    }

    async function handleConfirm() {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        saveReservation(coords);
        setLoading(false);
        onConfirmed();
    }

    return open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-2xl px-12 py-8 min-w-[380px] shadow-2xl border border-border flex flex-col items-center">
                <div className="text-4xl font-semibold mb-3 text-green-200 font-ari tracking-tight">
                    Pixels Reserved!
                </div>
                <div className="text-green-100 mb-3 text-lg ">
                    Please confirm your reservation of the selected pixels.
                </div>
                <div className="text-gray-400 mb-6 text-center text-base font-aria">
                    The selected pixels will be <span className="text-green-200">reserved for 5 minutes</span>.<br />
                    If you do not complete your transaction within this time, the pixels will be available for purchase by others.
                </div>
                <div className="flex gap-8 mb-8 items-stretch">
                    <CoordCard
                        label="Top Left (px)"
                        value={coords?.topLeft ? `${coords.topLeft[0]}, ${coords.topLeft[1]}` : "--"}
                    />
                    <CoordCard
                        label="Bottom Right (px)"
                        value={coords?.bottomRight ? `${coords.bottomRight[0]}, ${coords.bottomRight[1]}` : "--"}
                    />
                </div>
                <div className="flex gap-4 w-full justify-center">
                    <Button onClick={handleConfirm} disabled={loading}>
                        {loading ? "Confirming..." : "Confirm Reservation"}
                    </Button>
                    <Button onClick={handleClose} className="!bg-error !hover:bg-error/20" disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    ) : null;
}
