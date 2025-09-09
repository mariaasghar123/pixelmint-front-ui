"use client"

import { useEffect, useState } from "react"
import Button from "./ui/Button"
import { getShapes, saveReservation, saveShapes } from "@/utils/localStorage.utils"

function formatCoords(coord) {
    return Math.floor(coord / 10)
}

function formatPrice(price) {
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export default function ReservePixelsModal({ open, onClose, coords, onConfirmed }) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setLoading(false)
        }
    }, [open])

    function calculateAreaAndPrice() {
        if (!coords?.topLeft || !coords?.bottomRight) {
            return { area: 0, price: 0, width: 0, height: 0 }
        }

        const width = coords.bottomRight[0] - coords.topLeft[0]
        const height = coords.bottomRight[1] - coords.topLeft[1]
        const area = width * height
        const price = area

        return { area, price, width, height }
    }

    const { area, price, width, height } = calculateAreaAndPrice()

    function AreaPriceCard() {
        return (
            <div className="bg-dark-700 rounded-lg px-6 py-4 shadow-md border border-border w-full max-w-md">
                <div className="text-green-100 text-lg font-semibold mb-3 text-center">Selection Details</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-green-100">Dimensions:</span>
                        <span className="text-green-200 font-mono">
                            {width}px × {height}px
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-green-100">Total Area:</span>
                        <span className="text-green-200 font-mono">{area.toLocaleString()}px</span>
                    </div>
                    <div className="flex justify-between col-span-2 pt-2 border-t border-border">
                        <span className="text-green-100 font-semibold">Price:</span>
                        <span className="text-green-200 font-mono font-bold text-lg">{formatPrice(price)}</span>
                    </div>
                </div>
                <div className="text-green-100/70 text-xs text-center mt-2">Rate: $1 per pixel</div>
            </div>
        )
    }

    function handleClose() {
        const shapes = getShapes()
        const bottomRight = [formatCoords(coords.bottomRight[0]), formatCoords(coords.bottomRight[1])]
        const shapesEndCoords = shapes.map((v) => v.bottomRight)
        const index = shapesEndCoords.findIndex((v) => v[0] == bottomRight[0] && v[1] == bottomRight[1])
        shapes.splice(index, 1)
        saveShapes(shapes)
        onClose(shapes)
    }

    async function handleConfirm() {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))
        saveReservation(coords)
        setLoading(false)
        onConfirmed()
    }

    return open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-2xl px-6 md:px-12 py-8 w-[90%] md:w-full max-w-[550px] shadow-2xl border border-border flex flex-col items-center">
                <div className="text-2xl md:text-4xl font-semibold mb-3 text-green-200 font-ari tracking-tight">Pixels Reserved!</div>
                <div className="text-green-100 mb-3 text-center text-sm md:text-lg">Please confirm your reservation of the selected pixels.</div>
                <div className="mb-8 w-full flex justify-center">
                    <AreaPriceCard />
                </div>
                <div className="flex gap-4 w-full justify-center">
                    <Button onClick={handleConfirm} disabled={loading} className="text-xs md:text-base">
                        {loading ? "Confirming..." : "Confirm Reservation"}
                    </Button>
                    <Button onClick={handleClose} className="!bg-error !hover:bg-error/20 !border-none text-xs md:text-base" disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    ) : null
}

